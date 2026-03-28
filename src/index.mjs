import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createFilter } from "@rollup/pluginutils";
import { htmlToReact } from "./htmlToReact.mjs";

const cwd = process.cwd();

/** @typedef {typeof import("./types").VitePluginReactSVG} VitePluginReactSVG */
/** @typedef {import("./types").VitePluginSvgReactOptions} VitePluginSvgReactOptions */
/** @typedef {import("vite").BuildAppHook} BuildAppHook */
/** @typedef {ThisParameterType<BuildAppHook>} PluginContext */

/**
 * Compiles SVGs to React component code
 * @param {string} svgCode
 * @returns {string} the compiled code
 */
function transformSvgToReact(svgCode) {
  // Convert the SVG string directly to React code
  const reactCode = htmlToReact(svgCode);

  // Wrap the converted code in a component
  const componentCode = `
import { createElement } from "react";

export default function SVGComponent(props = {}) {
	return ${reactCode.code};
};
`.trim();

  return componentCode;
}

/** @type {VitePluginReactSVG} */
export default function vitePluginSvgReact(options = {}) {
  const {
    include = ["**/*.svg?react"],
    exclude,
  } = options;
  const filter = createFilter(include, exclude);
  const postfixRE = /[?#].*$/s;
  /** @type {VitePluginSvgReactOptions} */
  let config;
  /** @type {PluginContext} */
  let context;

  return {
    name: "react-svg",
    enforce: "pre",
    buildStart() {
      context = this;
    },
    // istanbul ignore next - impossible to test outside of vite runtime
    configResolved(cfg) {
      config = cfg;
    },
    async load(id) {
      if (filter(id)) {
        const file = id.replace(postfixRE, "");
        // Resolve the file path
        /* istanbul ignore next @preserve - we cannot test this outside the vite runtime */
        const filePath =
          !file.startsWith(cwd) && file.startsWith("/") && config?.publicDir
            ? path.resolve(config.publicDir, file.slice(1))
            : file;
        // Read the SVG file
        const svgCode = await fs.promises.readFile(filePath, "utf8");

        // Transform SVG to React component
        const componentCode = transformSvgToReact(svgCode);

        const vite = await import("vite");
        const viteVersion = context.meta.viteVersion;
        const isVite8 = viteVersion?.startsWith("8");
        const transformer = isVite8
          ? "transformWithOxc"
          : "transformWithEsbuild";
        const langProp = isVite8 ? "lang" : "loader";
        const mapProp = isVite8 ? "source_map" : "sourcemap";

        // Transform the component code using esbuild/oxc
        const result = await vite[transformer](componentCode, id, {
          [langProp]: "js",
          [mapProp]: true,
        });

        return {
          code: result.code,
          map: result.map
            ? (
              typeof result.map === "string"
                ? JSON.parse(result.map)
                : result.map
            )
            : /* istanbul ignore next @preserve */ null,
        };
      }
      return null;
    },
  };
}
