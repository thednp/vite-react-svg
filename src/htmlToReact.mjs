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
  if (att.startsWith("data-") || att.startsWith("aria-")) return att;
  if (att.includes("-")) return camelCase(att);
  return att;
}

/**
 * Returns the React value enclosed in quotes or brackets depending on the value.
 * @param {string | Record<string, string> | null} val
 */
export const reactValue = (val) => {
  if (!val) return null;
  // if (typeof val === "object") return `{${val}}`;
  if (typeof val === "object") return JSON.stringify(val, null, 2);
  return `"${val}"`;
}

/**
 * Converts HTML to React code.
 * 
 * @type {htmlToDOM}
 */
const htmlToDOM = (input) => {
  if (!input) return { nodeName: '#document', children: [] };
  if (typeof input !== 'string') throw new TypeError('input must be a string');
  return Parser().parseFromString(input).root;
}

/**
 * Converts a `DOMNode` to a React code string
 * @type {DomToReact} 
 */
const DomToReact = (input, depth = 0) => {
  const { tagName, nodeName, attributes, children, nodeValue } = input;
  const isReplacement = typeof attributes === 'string';
  const isText = nodeName === '#text';
  const firstChildIsText = children?.[0]?.nodeName === '#text';
  const attributeEntries = isReplacement ? [] : Object.entries(attributes || {});
  const spaces = "  ".repeat(depth); // Calculate spaces based on depth
  let output = isText ? '' : (spaces + `createElement("${tagName}", `);

  if (attributeEntries.length || isReplacement) {
    const attributesHTML = isReplacement ? attributes : attributeEntries.map(([key, value]) =>
      `${quoteText(reactAttr(key))}: ${reactValue(value)}`).join(', ');
    output += isReplacement ? attributesHTML : `{ ${attributesHTML}, ...props }`;
    output += children?.length ? ',' : '';
  }
  if (children?.length) {
    const childrenHTML = children
      // Increase depth for children
      // @ts-expect-error
      .map(child => (firstChildIsText ? (attributeEntries.length ? " " : "") : ("\n" + "  ".repeat(depth + 1))) + DomToReact(child, depth + 1))
      .join(',');
    output += `${childrenHTML}`;
  }
  if (nodeValue) {
    output += `"${nodeValue}"`;
  }
  // Adjust newline for closing bracket
  output += isText ? "" : (children?.length && !firstChildIsText ? ("\n" + "  ".repeat(depth + 1) + ')') : ')');

  return output;
}

/**
 * Converts HTML markup to React code.
 * 
 * @type {htmlToReact}
 */
export const htmlToReact = (input, options = {}) => {
  const { replacement } = options;
  const doc = htmlToDOM(input);
  if (!doc?.children.length) return { code: '', attributes: {} };
  const { tagName, nodeName, attributes, children } = doc.children[0];
  // @ts-expect-error
  const code = DomToReact({ tagName, nodeName, attributes: replacement || attributes, children });

  return { code, attributes };
}
