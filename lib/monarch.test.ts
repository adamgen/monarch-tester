import { Token, tokenizer } from "./monarch";
import "../jest/toResultTokens";

const l = (string) => ({
  index: string[0].length,
  string: string[0],
});

describe("tokenizer", () => {
  it("should successfully tokenize sub attribute", function () {
    expect(`[test.left.name=x]`).toResultTokens([
      [l``, Token.squareBracketStart],
      [l`[`, Token.attributeName],
      [l`[test.left.name`, Token.condition],
      [l`[test.left.name=`, Token.attributeValue],
      [l`[test.left.name=x`, Token.squareBracketEndAttribute],
    ]);
    expect(`[test.left=x]`).toResultTokens([
      [l``, Token.squareBracketStart],
      [l`[`, Token.attributeName],
      [l`[test.left`, Token.condition],
      [l`[test.left=`, Token.attributeValue],
      [l`[test.left=x`, Token.squareBracketEndAttribute],
    ]);
    expect(`[test=x]`).toResultTokens([
      [l``, Token.squareBracketStart],
      [l`[`, Token.attributeName],
      [l`[test`, Token.condition],
      [l`[test=`, Token.attributeValue],
      [l`[test=x`, Token.squareBracketEndAttribute],
    ]);
  });
  it("should successfully tokenize subject indicator", function () {
    expect(`!Se`).toResultTokens([
      [l``, Token.subject],
      [l`!`, Token.selector],
    ]);
    expect(`!!Se`).toResultTokens([
      [l``, Token.subject],
      [l`!`, Token.invalid],
      [l`!!`, Token.selector],
    ]);

    expect(`! !Se`).toResultTokens([
      [l``, Token.subject],
      [l`!`, Token.space],
      [l`! `, Token.invalid],
      [l`! !`, Token.selector],
    ]);
  });

  it("should successfully tokenize not, has, and matches", function () {
    expect(`:matches(ForStatement)`).toResultTokens([
      [l``, Token.matches],
      [l`:matches`, Token.matchesOpen],
      [l`:matches(`, Token.selector],
      [l`:matches(ForStatement`, Token.bracketClose],
    ]);

    expect(`:has(ForStatement)`).toResultTokens([
      [l``, Token.has],
      [l`:has`, Token.hasOpen],
      [l`:has(`, Token.selector],
      [l`:has(ForStatement`, Token.bracketClose],
    ]);

    expect(`:not(ForStatement)`).toResultTokens([
      [l``, Token.not],
      [l`:not`, Token.notOpen],
      [l`:not(`, Token.selector],
      [l`:not(ForStatement`, Token.bracketClose],
    ]);

    expect(`:not( :not( ForStatement))`).toResultTokens([
      [l``, Token.not],
      [l`:not`, Token.notOpen],
      [l`:not(`, Token.space],
      [l`:not( `, Token.not],
      [l`:not( :not`, Token.notOpen],
      [l`:not( :not(`, Token.space],
      [l`:not( :not( `, Token.selector],
      [l`:not( :not( ForStatement`, Token.bracketClose],
    ]);
  });

  it("should successfully tokenize child, sibling and adjacent", function () {
    expect(`Parent > Child`).toResultTokens([
      [l``, Token.selector],
      [l`Parent`, Token.space],
      [l`Parent `, Token.relative],
      [l`Parent >`, Token.space],
      [l`Parent > `, Token.selector],
    ]);

    expect(`Parent > > Child`).toResultTokens([
      [l``, Token.selector],
      [l`Parent`, Token.space],
      [l`Parent `, Token.relative],
      [l`Parent >`, Token.space],
      [l`Parent > `, Token.invalid],
      [l`Parent > >`, Token.space],
      [l`Parent > > `, Token.selector],
    ]);
  });

  it("should successfully tokenize nth and nth-last child", function () {
    expect(`:nth-last-child(5):nth-child(5)`).toResultTokens([
      [l`:nth-last-child(5)`, Token.nthLastChild],
      [l``, Token.nthChild],
    ]);

    expect(`:nth-child(2)`).toResultTokens([[l``, Token.nthChild]]);
    expect(`:nth-last-child(435)`).toResultTokens([[l``, Token.nthLastChild]]);
  });

  it("should successfully tokenize first and last child, and AST node classes", function () {
    expect(`Selector:first-child[id]:function :statement`).toResultTokens([
      [l``, Token.selector],
      [l`Selector`, Token.firstChild],
      [l`Selector:first-child`, Token.squareBracketStart],
      [l`Selector:first-child[`, Token.attributeName],
      [l`Selector:first-child[id`, Token.squareBracketEndAttribute],
      [l`Selector:first-child[id]`, Token.astNodeClass],
      [l`Selector:first-child[id]:function`, Token.space],
      [l`Selector:first-child[id]:function `, Token.astNodeClass],
    ]);

    expect(`:first-child`).toResultTokens([[l``, Token.firstChild]]);
    expect(`:last-child`).toResultTokens([[l``, Token.lastChild]]);
    expect(`:statement`).toResultTokens([[l``, Token.astNodeClass]]);
    expect(`:expression`).toResultTokens([[l``, Token.astNodeClass]]);
    expect(`:declaration`).toResultTokens([[l``, Token.astNodeClass]]);
    expect(`:function`).toResultTokens([[l``, Token.astNodeClass]]);
    expect(`:pattern`).toResultTokens([[l``, Token.astNodeClass]]);
  });
  it("should successfully tokenize attribute that have spaces in it", function () {
    expect(`Identifier.id`).toResultTokens([
      [l``, Token.selector],
      [l`Identifier`, Token.fieldSelector],
    ]);
    expect(`Identifier.id.id`).toResultTokens([
      [l``, Token.selector],
      [l`Identifier`, Token.fieldSelector],
    ]);
    expect(`Identifier.id[id="id"]`).toResultTokens([
      [l``, Token.selector],
      [l`Identifier`, Token.fieldSelector],
      [l`Identifier.id`, Token.squareBracketStart],
      [l`Identifier.id[`, Token.attributeName],
      [l`Identifier.id[id`, Token.condition],
      [l`Identifier.id[id=`, Token.doubleQuote],
      [l`Identifier.id[id="`, Token.attributeValue],
      [l`Identifier.id[id="id`, Token.doubleQuote],
      [l`Identifier.id[id="id"`, Token.squareBracketEndAttribute],
    ]);
  });

  it("should successfully tokenize attribute that have spaces in it", function () {
    expect(`[ a ]`).toResultTokens([
      [l``, Token.squareBracketStart],
      [l`[`, Token.space],
      [l`[ `, Token.attributeName],
      [l`[ a`, Token.space],
      [l`[ a `, Token.squareBracketEndAttribute],
    ]);

    expect(`[ a != 2 ]`).toResultTokens([
      [l``, Token.squareBracketStart],
      [l`[`, Token.space],
      [l`[ `, Token.attributeName],
      [l`[ a`, Token.space],
      [l`[ a `, Token.condition],
      [l`[ a !=`, Token.space],
      [l`[ a != `, Token.attributeValue],
      [l`[ a != 2`, Token.space],
      [l`[ a != 2 `, Token.squareBracketEndAttribute],
    ]);

    expect(`[ a =/2/ ]`).toResultTokens([
      [l``, Token.squareBracketStart],
      [l`[`, Token.space],
      [l`[ `, Token.attributeName],
      [l`[ a`, Token.space],
      [l`[ a `, Token.condition],
      [l`[ a =`, Token.regex],
      [l`[ a =/2/`, Token.space],
      [l`[ a =/2/ `, Token.squareBracketEndAttribute],
    ]);
  });

  it("should successfully tokenize attribute with conditions", function () {
    expect(`[a!=2]`).toResultTokens([
      [l``, Token.squareBracketStart],
      [l`[`, Token.attributeName],
      [l`[a`, Token.condition],
      [l`[a!=`, Token.attributeValue],
      [l`[a!=2`, Token.squareBracketEndAttribute],
    ]);
    expect(`[a<=2]`).toResultTokens([
      [l``, Token.squareBracketStart],
      [l`[`, Token.attributeName],
      [l`[a`, Token.condition],
      [l`[a<=`, Token.attributeValue],
      [l`[a<=2`, Token.squareBracketEndAttribute],
    ]);
    expect(`[a<2]`).toResultTokens([
      [l``, Token.squareBracketStart],
      [l`[`, Token.attributeName],
      [l`[a`, Token.condition],
      [l`[a<`, Token.attributeValue],
      [l`[a<2`, Token.squareBracketEndAttribute],
    ]);
    expect(`[a>=2]`).toResultTokens([
      [l``, Token.squareBracketStart],
      [l`[`, Token.attributeName],
      [l`[a`, Token.condition],
      [l`[a>=`, Token.attributeValue],
      [l`[a>=2`, Token.squareBracketEndAttribute],
    ]);
    expect(`[a>"2"]`).toResultTokens([
      [l``, Token.squareBracketStart],
      [l`[`, Token.attributeName],
      [l`[a`, Token.condition],
      [l`[a>`, Token.doubleQuote],
      [l`[a>"`, Token.attributeValue],
      [l`[a>"2`, Token.doubleQuote],
      [l`[a>"2"`, Token.squareBracketEndAttribute],
    ]);
    expect(`[a>'2']`).toResultTokens([
      [l``, Token.squareBracketStart],
      [l`[`, Token.attributeName],
      [l`[a`, Token.condition],
      [l`[a>`, Token.singleQuote],
      [l`[a>'`, Token.attributeValue],
      [l`[a>'2`, Token.singleQuote],
      [l`[a>'2'`, Token.squareBracketEndAttribute],
    ]);
  });

  it("should successfully tokenize a regex attribute", function () {
    expect(`[a=/v\//] [a=/v\\//] [c=/\/.*?[^\\]\\/(?!\\//]`).toResultTokens([
      [l``, Token.squareBracketStart],
      [l`[`, Token.attributeName],
      [l`[a`, Token.condition],
      [l`[a=`, Token.regex],
      [l`[a=/v\//`, Token.squareBracketEndAttribute],
      [l`[a=/v\//]`, Token.space],
      [l`[a=/v\//] `, Token.squareBracketStart],
      [l`[a=/v\//] [`, Token.attributeName],
      [l`[a=/v\//] [a`, Token.condition],
      [l`[a=/v\//] [a=`, Token.regex],
      [l`[a=/v\//] [a=/v\\//`, Token.squareBracketEndAttribute],
      [l`[a=/v\//] [a=/v\\//]`, Token.space],
      [l`[a=/v\//] [a=/v\\//] `, Token.squareBracketStart],
      [l`[a=/v\//] [a=/v\\//] [`, Token.attributeName],
      [l`[a=/v\//] [a=/v\\//] [a`, Token.condition],
      [l`[a=/v\//] [a=/v\\//] [a=`, Token.regex],
      [
        l`[a=/v\//] [a=/v\\//] [a=/\/.*?[^\\]\\/(?!\\//`,
        Token.squareBracketEndAttribute,
      ],
    ]);

    expect("[a=/v/]").toResultTokens([
      [l``, Token.squareBracketStart],
      [l`[`, Token.attributeName],
      [l`[a`, Token.condition],
      [l`[a=`, Token.regex],
      [l`[a=/v/`, Token.squareBracketEndAttribute],
    ]);
  });

  it("should successfully tokenize a multiple selectors and attributes", function () {
    expect("[a=v] Li[at='val'] Bi [key]").toResultTokens([
      [l``, Token.squareBracketStart],
      [l`[`, Token.attributeName],
      [l`[a`, Token.condition],
      [l`[a=`, Token.attributeValue],
      [l`[a=v`, Token.squareBracketEndAttribute],
      [l`[a=v]`, Token.space],
      [l`[a=v] `, Token.selector],
      [l`[a=v] Li`, Token.squareBracketStart],
      [l`[a=v] Li[`, Token.attributeName],
      [l`[a=v] Li[at`, Token.condition],
      [l`[a=v] Li[at=`, Token.singleQuote],
      [l`[a=v] Li[at='`, Token.attributeValue],
      [l`[a=v] Li[at='val`, Token.singleQuote],
      [l`[a=v] Li[at='val'`, Token.squareBracketEndAttribute],
      [l`[a=v] Li[at='val']`, Token.space],
      [l`[a=v] Li[at='val'] `, Token.selector],
      [l`[a=v] Li[at='val'] Bi`, Token.space],
      [l`[a=v] Li[at='val'] Bi `, Token.squareBracketStart],
      [l`[a=v] Li[at='val'] Bi [`, Token.attributeName],
      [l`[a=v] Li[at='val'] Bi [key`, Token.squareBracketEndAttribute],
    ]);
  });

  it("should successfully tokenize a multiple selectors with attributes", function () {
    expect("Selector ForEach").toResultTokens([
      [l``, Token.selector],
      [l`Selector`, Token.space],
      [l`Selector `, Token.selector],
    ]);

    expect(
      "Selector[att=value] ForEach[attribute=\"value\"]    FunctionCall[name='myFunc']"
    ).toResultTokens([
      [l``, Token.selector],
      [l`Selector`, Token.squareBracketStart],
      [l`Selector[`, Token.attributeName],
      [l`Selector[att`, Token.condition],
      [l`Selector[att=`, Token.attributeValue],
      [l`Selector[att=value`, Token.squareBracketEndAttribute],
      [l`Selector[att=value]`, Token.space],
      [l`Selector[att=value] `, Token.selector],
      [l`Selector[att=value] ForEach`, Token.squareBracketStart],
      [l`Selector[att=value] ForEach[`, Token.attributeName],
      [l`Selector[att=value] ForEach[attribute`, Token.condition],
      [l`Selector[att=value] ForEach[attribute=`, Token.doubleQuote],
      [l`Selector[att=value] ForEach[attribute="`, Token.attributeValue],
      [l`Selector[att=value] ForEach[attribute="value`, Token.doubleQuote],
      [
        l`Selector[att=value] ForEach[attribute="value"`,
        Token.squareBracketEndAttribute,
      ],
      [l`Selector[att=value] ForEach[attribute="value"]`, Token.space],
      [l`Selector[att=value] ForEach[attribute="value"]    `, Token.selector],
      [
        l`Selector[att=value] ForEach[attribute="value"]    FunctionCall`,
        Token.squareBracketStart,
      ],
      [
        l`Selector[att=value] ForEach[attribute="value"]    FunctionCall[`,
        Token.attributeName,
      ],
      [
        l`Selector[att=value] ForEach[attribute="value"]    FunctionCall[name`,
        Token.condition,
      ],
      [
        l`Selector[att=value] ForEach[attribute="value"]    FunctionCall[name=`,
        Token.singleQuote,
      ],
      [
        l`Selector[att=value] ForEach[attribute="value"]    FunctionCall[name='`,
        Token.attributeValue,
      ],
      [
        l`Selector[att=value] ForEach[attribute="value"]    FunctionCall[name='myFunc`,
        Token.singleQuote,
      ],
      [
        l`Selector[att=value] ForEach[attribute="value"]    FunctionCall[name='myFunc'`,
        Token.squareBracketEndAttribute,
      ],
    ]);
  });

  it("should successfully tokenize a basic selector with attribute", function () {
    expect("Selector").toResultTokens([[l``, Token.selector]]);

    expect("[attribute]").toResultTokens([
      [l``, Token.squareBracketStart],
      [l`[`, Token.attributeName],
      [l`[attribute`, Token.squareBracketEndAttribute],
    ]);

    expect("Selector[attribute]").toResultTokens([
      [l``, Token.selector],
      [l`Selector`, Token.squareBracketStart],
      [l`Selector[`, Token.attributeName],
      [l`Selector[attribute`, Token.squareBracketEndAttribute],
    ]);

    expect("Selector[attribute=value]").toResultTokens([
      [l``, Token.selector],
      [l`Selector`, Token.squareBracketStart],
      [l`Selector[`, Token.attributeName],
      [l`Selector[attribute`, Token.condition],
      [l`Selector[attribute=`, Token.attributeValue],
      [l`Selector[attribute=value`, Token.squareBracketEndAttribute],
    ]);

    expect('    Selector[attribute="value"]    ').toResultTokens([
      [l``, Token.space],
      [l`    `, Token.selector],
      [l`    Selector`, Token.squareBracketStart],
      [l`    Selector[`, Token.attributeName],
      [l`    Selector[attribute`, Token.condition],
      [l`    Selector[attribute=`, Token.doubleQuote],
      [l`    Selector[attribute="`, Token.attributeValue],
      [l`    Selector[attribute="value`, Token.doubleQuote],
      [l`    Selector[attribute="value"`, Token.squareBracketEndAttribute],
      [l`    Selector[attribute="value"]`, Token.space],
    ]);

    expect("Selector[attribute='value']").toResultTokens([
      [l``, Token.selector],
      [l`Selector`, Token.squareBracketStart],
      [l`Selector[`, Token.attributeName],
      [l`Selector[attribute`, Token.condition],
      [l`Selector[attribute=`, Token.singleQuote],
      [l`Selector[attribute="`, Token.attributeValue],
      [l`Selector[attribute="value`, Token.singleQuote],
      [l`Selector[attribute="value"`, Token.squareBracketEndAttribute],
    ]);
  });
});
