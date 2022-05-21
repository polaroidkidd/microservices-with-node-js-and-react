module.exports = {
  extends: ["airbnb", "airbnb-typescript", "airbnb/hooks", "prettier"],
  plugins: ["prettier"],
  rules: {
    "no-unused-vars": "error",
    "no-console": "off",
    "func-names": "off",
    "no-process-exit": "off",
    "object-shorthand": "off",
    "class-methods-use-this": "off",
    "import/prefer-default-export": "off",
    "import/no-default-export": "error",
    "no-void": "off",
    "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
  },
  parserOptions: {
    project: "./tsconfig.base.json",
    allowAutomaticSingleRunInference: true,
  },
};
