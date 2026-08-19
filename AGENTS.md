# AGENTS.md

This file provides guidance to AI agents when working with code in this repository.

## Project

`inquirer-form-prompt` is a published npm package: a single custom prompt for [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) that renders several fields at once as a form, instead of asking one question at a time. Read `README.md` for the public API surface (field types, `theme`, `footer`).

Node v22 (`.nvmrc`), pnpm, ESM-only (`"type": "module"`, `module`/`moduleResolution: NodeNext`).

## Commands

```sh
pnpm test                 # vitest in watch mode
pnpm test:once            # single run (used by the pre-commit hook and CI)
pnpm test:once src/keyHandlers/editText.test.ts     # one file
pnpm test:once -t 'should toggle'                   # one test by name
pnpm lint                 # tsc --noEmit && eslint --fix && prettier --write
pnpm build                # tsc && tsc-alias (rewrites `src/*` aliases in dist)
pnpm demo                 # tsx ./src/demo.ts --run — interactive manual check
pnpm ci                   # build + check-format + check-exports (also runs on prepublishOnly)
```

`pnpm demo` is the only way to exercise real terminal rendering; run it after touching renderers or key handlers. Snapshots live in `src/__snapshots__/`; update with `pnpm test:once -u`.

Releases are tag-driven: pushing a `v*.*.*` tag triggers both the npm publish and the GitHub release workflows. Bump `version` in `package.json` first.

## Architecture

`src/index.ts` is the only public entry point. It wraps `createPrompt(promptCreator)`, manually hides/shows the terminal cursor around the prompt, and converts the escape-key sentinel into a thrown `EscapeKeyError`.

`src/promptCreator.ts` is the heart: an Inquirer hook-based render function holding two pieces of state — `fields` (the whole array, replaced wholesale on every edit) and `focusedIndex`. Its `useKeypress` handler dispatches in a fixed order:

1. Enter → `done(fields)`; Escape → `done(Symbol('Escape key pressed'))`.
2. `handleNavigation` — returns `true` if it consumed the key (tab/shift-tab/up/down, skipping `Separator` entries and wrapping around).
3. Otherwise the key goes to the `editXField` handler for the focused field's `type`.

Two layers, kept strictly separate:

- **`src/keyHandlers/`** — pure state transitions. Each `editXField({ fields, currentField, key, focusedIndex, rl })` returns a *new* `InternalFields` array (return `fields` unchanged to signal "ignored this key"). No rendering, no side effects beyond `rl.clearLine`.
- **`src/renderers/`** — pure `fields → string`. `toTable` (default) and `toLabelTop` are the two theme variants; both split output into sections at `Separator` entries and delegate per-field markup to `renderers/common/*`. Add a new variant here and branch in `promptCreator`.

### Types (`src/util/types.ts`)

There is a deliberate three-way split, and mixing them up is the most common source of type errors:

- **User-facing**: `Field`/`Fields`, `FormField`, `Config`.
- **Internal**: `InternalField`/`InternalFields`, which add fields the user never sets — currently `highlightIndex` on checkboxes (the cursor *within* a checkbox's choices, distinct from `focusedIndex` across the form). `toInternalFields()` adds them on mount.
- **Returned**: `ReturnedItem`/`ReturnedItems` — `{ type, label, value }` only, plus passed-through `Separator` instances. `toReturnedItems()` strips internals; this is what `footer()` receives.

`Separator` (from `@inquirer/core`) can appear anywhere in a fields array. Every loop over fields must handle it — always via `field instanceof Separator`.

## Conventions

- Imports use the `src/*` path alias with an explicit `.js` extension (e.g. `import { toTable } from 'src/renderers/table/toTable.js'`). The alias is configured in `tsconfig.json`, `vitest.config.mts`, and resolved at build time by `tsc-alias`.
- Tests sit beside their source as `*.test.ts`. Prompt-level tests render through `@inquirer/testing`'s `render()` and assert on `getScreen()`; handler and renderer tests call the pure function directly. Both styles are heavily used — match the neighbouring file.
- Terminal styling goes through the small helpers in `src/util/styles.ts` (`node:util`'s `styleText`), not raw ANSI codes.
- `noUncheckedIndexedAccess` is on, so indexed reads are `T | undefined` — guard them.
- ESLint runs type-checked rules and bans `any`; explicit return types are expected on functions.
- Prettier: 4 spaces, no semicolons, single quotes, 120 columns.
- A Husky pre-commit hook runs `pnpm lint` then `pnpm test:once`.
