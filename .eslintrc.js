module.exports = {
  env: {
    es6: true,
    commonjs: true,
    node: true
  },
  'extends': [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended"
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: [
    "@typescript-eslint"
  ],
  rules: {
    indent: ["warn", 2],
    quotes: [
      "warn",
      "single",
      {
        allowTemplateLiterals: true
      }
    ],
    "no-unused-vars": 0,
    "no-console": ["warn", {
      "allow": ["warn", "error", "info"]
    }]
  }
}