"use strict";

export default {
  // stop after first failing test
  bail: true,
  testMatch: ["<rootDir>/lib/**/*.test.ts"],
  // globalSetup: "<rootDir>/jest/config/globalSetup.ts",
  // setupFiles: ["dotenv/config", "<rootDir>/jest/config/setupEnvVars.ts"],
  setupFilesAfterEnv: ["jest-extended/all", "<rootDir>/jest/setupAfterEnv.ts"],
  // reporters: ["default", "<rootDir>/jest/config/reporter-importer.js"],
  // moduleNameMapper: { "^jest/(.*)$": "<rootDir>/jest/$1" },
  moduleDirectories: ["node_modules", "src"],
  modulePathIgnorePatterns: ["dist"],
  coverageDirectory: "src/__tests__/coverage",
  watchPlugins: [
    [
      "jest-watch-typeahead/filename",
      {
        key: "F",
        prompt: "Filename typeahead",
      },
    ],
    [
      "jest-watch-typeahead/testname",
      {
        key: "T",
        prompt: "Test name typeahead",
      },
    ],
  ],

  /**
   * That's the config that worked to run jest with monarch.
   */
  moduleNameMapper: {
    "monaco-editor":
      "<rootDir>/node_modules/monaco-editor/esm/vs/editor/editor.api.js",
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js",
  },
  transformIgnorePatterns: [
    "<rootDir>/node_modules/monaco-editor/esm/vs/editor/edcore.main.js",
  ],
  testEnvironment: "jsdom",
};
