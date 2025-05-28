import { Parser } from "@thednp/domparser/parser";

/** @typedef {typeof import("./types").DomToReact} DomToReact */
/** @typedef {typeof import("./types").htmlToDOM} htmlToDOM */
/** @typedef {import("@thednp/domparser").NodeLike} NodeLike */
/** @typedef {import("@thednp/domparser").ChildLike} ChildLike */
/** @typedef {import("@thednp/domparser").ParseResult} ParseResult */
/** @typedef {typeof import("./types").htmlToReact} htmlToReact */

/**
 * Returns a quoted string if the key is a valid identifier,
 * otherwise returns the original key.
 * @type {typeof import('./types').quoteText}
 */
export const quoteText = (key) =>
  /^[a-zA-Z_][a-zA-Z_0-9]+$/.test(key) ? key : `"${key}"`;

/**
 * Transform a string to camel case.
 * @param {string} input source string
 */
export const camelCase = (input) =>
  input?.trim().replace(
    /(?:^\w|[A-Z]|\b\w)/g,
    (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase(),
  ).replace(/\s+|-/g, "");

/**
 * Returns the React equivalent of attribute name.
 * @param {string} att
 */
export const reactAttr = (att) => {
  if (att === "for") return "htmlFor";
  if (att === "class") return "className";
  if (att === "xmlns:xlink") return "xmlnsXlink";
  if (att === "xlink:actuate") return "xlinkActuate";
  if (att === "xlink:arcrole") return "xlinkArcrole";
  if (att === "xlink:role") return "xlinkRole";
  if (att === "xlink:show") return "xlinkShow";
  if (att === "xlink:title") return "xlinkTitle";
  if (att === "xlink:type") return "xlinkType";
  if (att.startsWith("data-") || att.startsWith("aria-")) return att;
  if (att.includes("-")) return camelCase(att);
  return att;
};

/**
 * Returns the React value enclosed in quotes or brackets depending on the value.
 * @param {string | number} val
 */
export const reactValue = (val) => {
  return `"${val}"`;
};

/**
 * Converts HTML to React code.
 *
 * @type {htmlToDOM}
 */
const htmlToDOM = (input) => {
  if (!input) return { nodeName: "#document", children: [] };
  if (typeof input !== "string") throw new TypeError("input must be a string");
  return Parser().parseFromString(input).root;
};

/**
 * Converts a `DOMNode` to a React code string
 * @type {DomToReact}
 */
const DomToReact = (input, depth = 0) => {
  const { tagName, nodeName, attributes, children, nodeValue } = input;
  const isText = nodeName === "#text";
  const firstChildIsText = children?.[0]?.nodeName === "#text";
  const attributeEntries = Object.entries(attributes || {});
  const spaces = "  ".repeat(depth); // Calculate spaces based on depth
  let output = isText ? "" : (spaces + `createElement("${tagName}", `);

  const attributesHTML =
    (attributeEntries.length
      ? attributeEntries.map(([key, value]) =>
        `${quoteText(reactAttr(key))}: ${reactValue(value)}`
      )
        .join(", ")
      : "")
      // don't add props to children
      .concat(depth === 0 ? ", ...props" : "");
  output += !isText ? `{${attributesHTML}}` : "";
  output += !isText && children?.length ? "," : "";

  if (children?.length) {
    const childrenHTML = children
      // Increase depth for children
      .map((child) =>
        (firstChildIsText
          ? (attributeEntries.length ? " " : "")
          // @ts-expect-error
          : ("\n" + "  ".repeat(depth + 1))) + DomToReact(child, depth + 1)
      )
      .join(",");
    output += childrenHTML;
  }
  // text/comment nodes
  if (nodeValue) {
    output += `\`${nodeValue}\``;
  }
  // Adjust newline for closing bracket
  output += isText
    ? ""
    : (children?.length && !firstChildIsText
      ? ("\n" + "  ".repeat(depth + 1) + ")")
      : ")");

  return output;
};

/**
 * Converts HTML markup to React code.
 *
 * @type {htmlToReact}
 */
export const htmlToReact = (input) => {
  const doc = htmlToDOM(input);
  if (!doc?.children.length) return { code: "", attributes: {} };
  const { tagName, nodeName, attributes, children } = doc.children[0];
  // @ts-expect-error
  const code = DomToReact({ tagName, nodeName, attributes, children });

  return { code, attributes };
};
