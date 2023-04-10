export enum TokenType {
  Number,
  Identifier,
  Equals,
  OpenParem,
  CloseParem,
  BinaryOperator,
  Let,
}

const KEYWORDS: Record<string, TokenType> = {
  let: TokenType.Let,
};

export interface Token {
  value: string;
  type: TokenType;
}

function token(value: string, type: TokenType): Token {
  return { value, type };
}

function isBinaryOperator(char: string): boolean {
  return char === "+" || char === "-" || char === "*" || char === "/";
}

function isAlpha(src: string): boolean {
  return src.toUpperCase() !== src.toLocaleLowerCase();
}

function isInt(src: string): boolean {
  return /^-?\d+$/.test(src);
}

// If character is useless so we don't create its token
function isSkippable(src: string): boolean {
  return src === " " || src === "\n" || src === "\t";
}

function pushToken(src: string[], tokens: Array<Token>): void {
  if (src[0] === "(") {
    tokens.push(token(src.shift() ?? "", TokenType.OpenParem));
  } else if (src[0] === ")") {
    tokens.push(token(src.shift() ?? "", TokenType.CloseParem));
  } else if (isBinaryOperator(src[0])) {
    tokens.push(token(src.shift() ?? "", TokenType.BinaryOperator));
  } else if (src[0] === "=") {
    tokens.push(token(src.shift() ?? "", TokenType.Equals));
  } else {
    // Handle Multi character tokens
    if (isInt(src[0])) {
      let num = "";
      while (src.length > 0 && isInt(src[0])) {
        num += src.shift();
      }
      tokens.push(token(num, TokenType.Number));
    } else if (isAlpha(src[0])) {
      let ident = "";
      while (src.length > 0 && isAlpha(src[0])) {
        ident += src.shift();
      }

      // Check for reserved keywords first
      const reserved = KEYWORDS[ident];
      if (reserved === undefined) {
        tokens.push(token(ident, TokenType.Identifier));
      } else {
        tokens.push(token(ident, reserved));
      }
    } else if (isSkippable(src[0])) {
      src.shift();
    } else {
      console.log(`Unrecognized character found in source: ${src[0]}`);
      Deno.exit(1);
    }
  }
}

// Function to tokenize source code
export function tokenize(sourceCode: string): Token[] {
  const tokens = new Array<Token>();
  const src: string[] = sourceCode.split("");

  // Build each token until end of source code
  while (src.length > 0) {
    pushToken(src, tokens);
  }

  return tokens;
}

const source = await Deno.readTextFile("./source.txt");

for (const token of tokenize(source)) {
  console.log(token);
}
