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

- [ ] 1. js-build-tools: Babel 8 (`@babel/core` 8.1.0, preset-env / preset-typescript 8.0.7, plugin-transform-modules-commonjs 8.0.1); polyfills via `babel-plugin-polyfill-corejs3` with the same options; plugins and presets referenced by resolved path, so the config works wherever npm puts them (fixes 1)
- [ ] 2. Decide how projects get `@babel/preset-typescript` (fixes 3): (a) the base config includes it (it only touches `.ts` files) and projects delete their `presets.push(...)` line, or (b) js-build-tools exports its resolved path for projects to push
- [ ] 3. Confirm the project setup with a real install (not `--no-save`): projects declare `@babel/core` ^8 as a dev dependency so their `babel-jest` uses Babel 8 (fixes 2); write it up for the release notes
- [ ] 4. common-exports: its own tests on Jest's native ES-module mode (fixes 4)
- [ ] 5. Project adoption PRs, base projects first (test-fs, si-funciona, collect-your-stuff, then up the chain): own `@babel/*` packages to 8, `@babel/core` ^8, the preset-typescript change; each checked against this branch (tests, `dist/` byte comparison, bundles, Chromium for the apps)
- [ ] 6. Release js-build-tools 8.0.0, then bump every project to ^8.0.0

## Out of scope

- The core-js `proposals: true` setting (injects iterator polyfills for every `.map` / `.forEach`): changing it changes compiled output; its own decision.
- TypeScript 7 for js-build-tools (no TypeScript source here; its TS-API tools need TS 6 until TS 7.1).

## Release notes for 8.0.0 (collected as the epic goes)

- **Breaking:** projects need Babel 8: declare `@babel/core` ^8 as a dev dependency (their `babel-jest` uses it), bump any `@babel/*` packages they list themselves to 8, and the `@babel/preset-typescript` change from task 2.
- js-build-tools' `babel.config.js` references its plugins and presets by resolved path (works wherever npm installs Babel 8); polyfills come from `babel-plugin-polyfill-corejs3` with the same settings, and inject the same core-js modules as before (pinned by `functions/babelConfig.test.mjs`).
- Compiled output: dynamic `import()` stays native in CommonJS `dist/` instead of becoming `Promise.resolve().then(() => require(...))` (same result for CommonJS files; and ES-module-only packages can now be loaded lazily from a CommonJS `dist/`). Babel's `_interopRequireWildcard` helper has renamed variables.
