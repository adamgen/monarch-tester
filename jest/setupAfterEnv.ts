import { languages } from "monaco-editor";
import { ESQUERY, tokenizer } from "../lib/monarch";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

languages.register({
  id: ESQUERY,
});
languages.setMonarchTokensProvider(ESQUERY, tokenizer);
