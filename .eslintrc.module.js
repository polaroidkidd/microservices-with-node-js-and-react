module.exports = {
  extends: ["./.eslintrc.js"],
  parserOptions: {
    ...require.resolve("./.eslintrc.js").parserOptions,
    project: ["./tsconfig.json"],
  },
};
