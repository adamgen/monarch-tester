import { languages } from "monaco-editor";

export const ESQUERY = "esquery";

export enum Token {
  // misc
  space = "space",
  subject = "subject",
  invalid = "invalid",

  // Selector
  selector = "selector",
  fieldSelector = "field-selector",
  selectorEnd = "selector.end",

  // Attribute
  squareBracketStart = "square-bracket.start",
  squareBracketEndAttribute = "square-bracket.end.attribute",
  attributeName = "attribute.name",
  attributeValue = "attribute.value",
  condition = "condition",
  doubleQuote = "double-quote",
  singleQuote = "single-quote",
  regex = "regex",

  // :first-child, :last-child
  firstChild = "first-child",
  lastChild = "last-child",

  // :statement, :expression, :declaration, :function, :pattern
  astNodeClass = "ast-node-class",

  // :nth-child or nth-last-child
  nthChild = "nth-child",
  nthLastChild = "nth-last-child",

  // child, sibling and adjacent. Or: >, ~, +
  relative = "relative",

  // :not()
  not = "not",
  notOpen = "not-open",
  bracketClose = "bracket-close",

  // :has()
  has = "has",
  hasOpen = "has-open",

  // :matches()
  matches = "matches",
  matchesOpen = "matches-open",

  // testing
  testing = "testing",
}

interface CustomAction extends languages.IExpandedMonarchLanguageAction {
  token: Token;
}

type Action = CustomAction | Token | Token[] | CustomAction[];

type MonarchAction =
  | "@pop"
  | "@brackets"
  | "@attribute"
  | "@selector"
  | "@attributeValue";

type ShortMonarchLanguageRule1 = [string | RegExp, Action | MonarchAction];
type ShortMonarchLanguageRule2 = [string | RegExp, Action, MonarchAction];

interface ExpandedMonarchLanguageRule
  extends languages.IExpandedMonarchLanguageRule {
  action?: Action;
}

type Rule =
  | ExpandedMonarchLanguageRule
  | ShortMonarchLanguageRule1
  | ShortMonarchLanguageRule2;

interface CustomLanguage extends languages.IMonarchLanguage {
  tokenizer: { [name: string]: Rule[] };
}

export const tokenizer: CustomLanguage = {
  defaultToken: "invalid",
  tokenPostfix: ".esquery",
  ignoreCase: false,
  tokenizer: {
    root: [{ include: "base" }],

    base: [
      [/\s/, Token.space],
      [/(!)( *)(!*)/, [Token.subject, Token.space, Token.invalid]],
      [
        /\[/,
        { token: Token.squareBracketStart, bracket: "@open", next: "@pop" },
        "@attribute",
      ],
      [/[A-Z]/, Token.selector, "@selector"],
      [/:first-child/, Token.firstChild],
      [/:last-child/, Token.lastChild],
      [/:last-child/, Token.lastChild],
      [
        /:statement|:expression|:declaration|:function|:pattern/,
        Token.astNodeClass,
      ],
      [/:nth-child\(\d+\)/, Token.nthChild],
      [/:nth-last-child\(\d+\)/, Token.nthLastChild],
      [/([+~>])( *)([+~>]+)/, [Token.relative, Token.space, Token.invalid]],
      [/[+~>]/, Token.relative],
      [
        /(:not)(\()/,
        [
          { token: Token.not },
          { token: Token.notOpen, next: "@bracketCounting" },
        ],
      ],
      [
        /(:has)(\()/,
        [
          { token: Token.has },
          { token: Token.hasOpen, next: "@bracketCounting" },
        ],
      ],
      [
        /(:matches)(\()/,
        [
          { token: Token.matches },
          { token: Token.matchesOpen, next: "@bracketCounting" },
        ],
      ],
    ],

    bracketCounting: [
      [/\)/, { token: Token.bracketClose, next: "@pop" }],
      { include: "base" },
    ],

    attribute: [
      [/ /, Token.space],
      [/]/, Token.squareBracketEndAttribute, "@pop"],
      [
        /((?:\w+\.)*\w+)( *)(=|!=|>=|<=|>|<)( *)/,
        [
          { token: Token.attributeName },
          { token: Token.space },
          { token: Token.condition },
          { token: Token.space, next: "@attributeValue" },
        ],
      ],
      [/((?:\w+\.)*\w+)/, [{ token: Token.attributeName }]],
    ],

    attributeValue: [
      [/(\w+)/, [{ token: Token.attributeValue, next: "@pop" }]],
      [/\/.*?[^\\]\/(?!\/)/, { token: Token.regex }, "@pop"],
      [
        /(")(\w+)(")/,
        [
          { token: Token.doubleQuote },
          { token: Token.attributeValue },
          { token: Token.doubleQuote, next: "@pop" },
        ],
      ],
      [
        /(')(\w+)(')/,
        [
          { token: Token.singleQuote },
          { token: Token.attributeValue },
          { token: Token.singleQuote, next: "@pop" },
        ],
      ],
    ],

    selector: [
      [/\.\w+/, Token.fieldSelector],
      [/(?=\W)/, Token.selectorEnd, "@pop"],
      [/\w*/, Token.selector],
    ],
  },
};
