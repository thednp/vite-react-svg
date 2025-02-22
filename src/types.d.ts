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
import { type ResolvedConfig, transformWithEsbuild } from "vite";

export type VitePluginSvgReactOptions = Partial<ResolvedConfig> & {
  esbuildOptions?: Parameters<typeof transformWithEsbuild>[2];
  exclude?: FilterPattern;
  include?: FilterPattern;
};

export declare const VitePluginReactSVG: (
  config?: VitePluginSvgReactOptions,
) => {
  name: string;
  enforce: "pre" | "post" | undefined;
  configResolved: (cfg: VitePluginSvgReactOptions) => void;
  load: (id: string) => Promise<{ code: string; map: null } | null>;
};
export default VitePluginReactSVG;

export type ReactCode = {
  code: string;
  attributes?: Record<string, string | Record<string, string>>;
};

type ChildEl = ChildLike & Omit<NodeLike, "attributes"> & {
  attributes: Record<string, string>;
} & {
  //   nodeName: string;
  //   tagName: string;
  children: ChildLike[];
};

/**
 * Converts a `ChildLike` to a React code string
 * @param input
 * @param depth
 */
export const DomToReact: (input: ChildEl, depth?: number) => string;

export type ConverterOptions = { replacement?: string };

/**
 * Converts HTML to React code.
 */
export const htmlToReact: (
  input?: string,
  converterOptions?: ConverterOptions,
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
