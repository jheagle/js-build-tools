module.exports = {
  testMatch: [
    '**/?(*.)+(spec|test).mjs?(x)'
  ],
  transform: {
    '^.+\\.[cm]?[jt]sx?$': 'babel-jest'
  }
}
