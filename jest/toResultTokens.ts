import { editor } from "monaco-editor";
import { ESQUERY, Token } from "../lib/monarch";
import * as _ from "lodash";
import { diff } from "jest-diff";
import { bgWhiteBright } from "chalk";

import CustomMatcher = jest.CustomMatcher;

interface LengthIndicator {
  string: string;
  index: number;
}

type ExpectedTokens = Array<[LengthIndicator, Token]>;

interface CustomMatchers {
  toResultTokens: (expectedToken: ExpectedTokens) => {};
}

declare global {
  namespace jest {
    interface Expect extends CustomMatchers {}

    interface Matchers<R> extends CustomMatchers {}

    interface InverseAsymmetricMatchers extends CustomMatchers {}
  }
}

const toResultTokens: CustomMatcher = function (
  this: jest.MatcherContext,
  string: string,
  expectedTokens: ExpectedTokens
) {
  if (typeof string !== "string") {
    throw new Error(`toResultTokens accepts only string as first argument`);
  }
  const tokensLines = editor.tokenize(string, ESQUERY);

  if (tokensLines.length !== 1) {
    throw new Error(
      `toResultTokens accepts a string with a single line at this stage`
    );
  }

  const token = tokensLines[0].map((t) => [t.offset, t.type]);

  const postFixedExpectedToken: [number, string][] = expectedTokens.map(
    ([i, t]) => [typeof i === "number" ? i : i.index, `${t}.${ESQUERY}`]
  );

  let message = () => `string ${string} passed with no diff`;

  const mapIndicesToStrings = (d, i)=>{
    if(!expectedTokens[i]){
      return d
    }
    const lengthIndicator = expectedTokens[i][0] as LengthIndicator;
    d[0] = lengthIndicator.string;

    return d
  }

  const pass = _.isEqual(token.map(mapIndicesToStrings), postFixedExpectedToken.map(mapIndicesToStrings));

  if (!pass) {
    const diffString = diff(postFixedExpectedToken.map(mapIndicesToStrings), token.map(mapIndicesToStrings), {
      expand: this.expand,
    });
    const arrayDiff = _.differenceWith(
      token,
      postFixedExpectedToken,
      _.isEqual
    );
    const index = arrayDiff && arrayDiff[0] && arrayDiff[0][0];
    let stringHelper = "";
    if (typeof index === "undefined") {
      const expectedToken = expectedTokens.find(([d]) => {
        return typeof d !== "number" && d.index === index;
      }) as [LengthIndicator, Token];
      stringHelper =
        (expectedToken &&
          expectedToken[0] &&
          `${bgWhiteBright.black(`${expectedToken[0].string}`)}\n`) ||
        "";
    }

    message = () =>
      `${string}\n\n${stringHelper}\nhas a diff of:\n\n${diffString}`;
  }

  return { actual: string, message, pass };
};

expect.extend({ toResultTokens });
