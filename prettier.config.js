"use strict";

module.exports = {
  printWidth: 80,
  tabWidth: 2,
  singleQuote: false,
  trailingComma: "es5",
  arrowParens: "avoid",
  importOrder: ["<THIRD_PARTY_MODULES>", "@ms/(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  overrides: [
    {
      files: "*.{json,css,scss}",
      options: {
        tabWidth: 2,
        singleQuote: false,
      },
    },
    {
      files: "*.json",
      options: {
        printWidth: 999999,
      },
    },
  ],
};
