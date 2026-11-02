module.exports = {
  testMatch: [
    '**/?(*.)+(spec|test).mjs?(x)'
  ],
  // Native ES modules, no transform: run with node --experimental-vm-modules (the npm scripts do). Projects using
  // js-build-tools keep their own Jest setup; this is only for js-build-tools' own tests.
  transform: {}
}
