# Babel 8 (epic)

Move js-build-tools to Babel 8 and get every project using it ready, then release as **8.0.0** (a breaking change for projects). Branch: `feature/babel-8`; each task is its own branch with a PR into this one. This file is removed before the epic merges to main.

## Why it's an epic

Babel 8 itself is a small change to js-build-tools (its own `dist/` only differs by a renamed helper, plus dynamic `import()` now kept native). The work is in the projects. A wave of all 14 projects on 2026-11-02 (packed js-build-tools with Babel 8, details in ~/Sites/tasks/js-build-tools.md) found:

1. **Plugin lookup.** `babel.config.js` names plugins by string (`'@babel/preset-env'`), and Babel resolves those from the *project's* root. Jest's own internals keep `@babel/core` 7 at the project's top level, so npm puts Babel 8 inside js-build-tools: 7 projects fail with `Cannot find package '@babel/plugin-transform-modules-commonjs'`.
2. **Project tests.** A project's `babel-jest` loads the top-level `@babel/core` (7) with a Babel 8 config: tests don't run (title-switcher 0, website 0) unless the project declares `@babel/core` ^8 itself.
3. **`presets.push('@babel/preset-typescript')`** in most projects' `babel.config.js` hits the same lookup problem as 1.
4. **common-exports** loads gulp-babel inside its own tests; Babel 8 is ES-module-only, so those suites need Jest's native ES-module mode (as js-build-tools got in #363).

## Testing a project against this branch

js-build-tools doesn't commit `dist/` and has no `prepare` script, so `npm install github:...#feature/babel-8` gives a package without its compiled files. Instead:

```
git clone -b feature/babel-8 https://github.com/jheagle/js-build-tools && cd js-build-tools
npm ci && npm run build && npm pack            # -> js-build-tools-<version>.tgz
cd ../<project> && npm install --no-save ../js-build-tools/js-build-tools-<version>.tgz
npm run build                                  # compare tests, dist/ and bundles with the build on main
```

When comparing `dist/`: Babel 8 renames the variables inside its `_interopRequireWildcard` helper (`cache` -> `e`); those lines are expected to differ.

## Work Split

- [x] 1. js-build-tools: Babel 8 (#367) (`@babel/core` 8.1.0, preset-env / preset-typescript 8.0.7, plugin-transform-modules-commonjs 8.0.1); polyfills via `babel-plugin-polyfill-corejs3` with the same options; plugins and presets referenced by resolved path, so the config works wherever npm puts them (fixes 1)
- [x] 2. `@babel/preset-typescript` in the base config (#369; decided 2026-11-02: option a); projects delete their `presets.push(...)` line (fixes 3)
- [x] 3. Confirm the project setup with a real install (dry run 2026-11-02, all 14 projects, packed epic branch installed for real + `@babel/core` ^8 + own `@babel/*` to 8 + the preset-typescript line removed): top-level `@babel/core` is 8.1.0 everywhere, so `babel-jest` runs on Babel 8. Results:
  - Clean (same tests, `dist/` and bundles identical apart from the renamed helper): battleship, collect-your-stuff, JSON-DOM, json-dom-components, matrix-dom, pseudo-dom, quizzes, si-funciona, json-file-db, website.
  - **title-switcher:** 7 of 9 tests fail: Babel 8's TypeScript preset keeps uninitialized class fields (`typingEffect: switchTitleCallback` becomes `this.typingEffect = undefined`), hiding the method set on `TitleSwitcher.prototype`. Fix in its source: `declare typingEffect: ...` (no other project's tests hit this).
  - **workout-planner, task-manager:** own `babel.config.cjs` without `targets` (Babel 7 compiled to ES5; Babel 8 would default to modern browsers). Switched to the shared config + `throw-expressions` (by `require.resolve`): builds, workout-planner 44/44; `dist/` changes (modern targets), but their pages load `assets/js/index.js`, not that output.
  - **common-exports:** see task 4.
- [ ] 4. common-exports: 4 suites load gulp-babel, so Babel 8 (ES-module-only) inside its Babel-transformed Jest. Jest only does `require(esm)` with `--experimental-vm-modules` (jest-runtime: "Without --experimental-vm-modules, CjsParseError is never thrown"). With the flag all 18 suites load (71 tests run, babel-jest kept), **but the 4 image tests ("can use compiled package", gulp-imagemin converted to CommonJS by common-exports, then loaded) time out at 25s** - also on Babel 7 with the flag, so it's the flag, not Babel 8. Next: find why the converted package hangs under VM modules (investigation)
- [ ] 5. Project adoption PRs, base projects first (test-fs, si-funciona, collect-your-stuff, then up the chain): own `@babel/*` packages to 8, `@babel/core` ^8, the preset-typescript line removed (title-switcher: `declare` fields; workout-planner / task-manager: shared config); each checked against this branch (tests, `dist/` byte comparison, bundles, Chromium for the apps)
- [ ] 6. Release js-build-tools 8.0.0, then bump every project to ^8.0.0

## Out of scope

- The core-js `proposals: true` setting (injects iterator polyfills for every `.map` / `.forEach`): changing it changes compiled output; its own decision.
- TypeScript 7 for js-build-tools (no TypeScript source here; its TS-API tools need TS 6 until TS 7.1).

## Release notes for 8.0.0 (collected as the epic goes)

- **Breaking:** projects need Babel 8: declare `@babel/core` ^8 as a dev dependency (their `babel-jest` uses it), bump any `@babel/*` packages they list themselves to 8, and delete `babelConfig.presets.push('@babel/preset-typescript')` (the base config includes it now; keeping the line fails with "Duplicate plugin/preset detected").
- js-build-tools' `babel.config.js` references its plugins and presets by resolved path (works wherever npm installs Babel 8); polyfills come from `babel-plugin-polyfill-corejs3` with the same settings, and inject the same core-js modules as before (pinned by `functions/babelConfig.test.mjs`).
- Compiled output: dynamic `import()` stays native in CommonJS `dist/` instead of becoming `Promise.resolve().then(() => require(...))` (same result for CommonJS files; and ES-module-only packages can now be loaded lazily from a CommonJS `dist/`). Babel's `_interopRequireWildcard` helper has renamed variables.
