/// <reference path="global.d.ts" />

import type {
  ChildLike,
  DOMNode,
  NodeLike,
  ParseResult,
  RootNode,
} from "@thednp/domparser";

import React from "react";

import type { FilterPattern } from "@rollup/pluginutils";
import type {
  EsbuildTransformOptions,
  OxcOptions,
  Plugin,
  ResolvedConfig,
} from "vite";

export type VitePluginSvgReactOptions = {
  oxcOptions?: OxcOptions;
  /** @deprecated */
  esbuildOptions?: EsbuildTransformOptions;
  exclude?: FilterPattern;
  include?: FilterPattern;
};

export declare const VitePluginReactSVG: (
  config?: VitePluginSvgReactOptions,
) => Plugin<VitePluginSvgReactOptions>;
export default VitePluginReactSVG;

export type ReactCode = {
  code: string;
  attributes?: Record<string, string | Record<string, string>>;
};

type ChildEl = ChildLike & Omit<NodeLike, "attributes"> & {
  attributes: Record<string, string>;
} & {
  children: ChildLike[];
};

/**
 * Converts a `ChildLike` to a React code string
 * @param input
 * @param depth
 */
export const DomToReact: (input: ChildEl, depth?: number) => string;

/**
 * Converts HTML to React code.
 */
export const htmlToReact: (
  input?: string,
) => ReactCode;

/** Converts HTML to DOMLike */
export const htmlToDOM: (
  input?: string,
  options?: Partial<ParserOptions>,
) => ParseResult["root"];

/**
 * Returns a quoted string if the key is a valid identifier,
 * otherwise returns the original key.
 */
export const quoteText: (key: string) => string;
