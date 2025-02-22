import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { transformWithEsbuild } from "vite";
import { createFilter } from "@rollup/pluginutils";
import { htmlToReact, quoteText, reactAttr, reactValue } from "./htmlToReact.mjs";

const cwd = process.cwd();

/** @typedef {import("vite").UserConfig} UserConfig */
/** @typedef {typeof import("./types").VitePlugiReactSVG} VitePlugiReactSVG */
/** @typedef {import("./types").VitePluginSvgReactOptions} VitePluginSvgReactOptions */

/**
 * Compiles SVGs to React component code
 * @param {string} svgCode
 * @returns {string} the compiled code
 */
function transformSvgToReact(svgCode) {
  // Convert the SVG string directly to React code using htmlToVanCode
  const reactCode = htmlToReact(svgCode, { replacement: "props" });

  /** @returns {string} */
  const getCode = () => {
    const {
      transform,
      stroke,
      strokeOpacity,
      strokeWidth,
      fill,
      fillOpacity,
      width,
      height,
      className,
      style,
      ...rest
    } = reactCode.attributes || /* istanbul ignore next @preserve */ {};

    const output = `
const props = {
  ${
      Object.entries(rest)
        .map(([key, value]) => `${quoteText(reactAttr(key))}: ${reactValue(value)}`)
        .join(",\n")
    },
};

  props.fill = initialProps.fill || ${reactValue(fill) || `null`};
  props.fillOpacity = initialProps.fillOpacity || ${reactValue(fillOpacity) || `null`};
  props.stroke = initialProps.stroke || ${reactValue(stroke) || `null`};
  props.strokeOpacity = initialProps.strokeOpacity || ${
    reactValue(strokeOpacity) || `null`
  };
  props.strokeWidth = initialProps.strokeWidth || ${reactValue(strokeWidth) || `null`};
  props.className = initialProps.className || ${reactValue(className) || `null`};
  props.style = initialProps.style || ${reactValue(style) || `null`};
  props.transform = initialProps.transform || ${reactValue(transform) || `null`};

  if (["null", null].every(w => w !== initialProps.width)) {
    props.width = initialProps.width || ${
      reactValue(width) || /* istanbul ignore next @preserve */ `null`
    };
  }

  if (["null", null].every(h => h !== initialProps.height)) {
    props.height = initialProps.height || ${
      reactValue(height) || /* istanbul ignore next @preserve */ `null`
    };
  }

return ${reactCode.code};
`.trim();

    return output;
  };

  // Wrap the converted code in a component
  const componentCode = `
import { createElement } from "react";

export default function SVGComponent(initialProps = {}) {
	${getCode()}
}
`.trim();

  return componentCode;
}

/** @type {VitePlugiReactSVG} */
export default function vitePluginSvgReact(options = {}) {
  const {
    esbuildOptions,
    include = ["**/*.svg?react"],
    exclude,
  } = options;
  const filter = createFilter(include, exclude);
  const postfixRE = /[?#].*$/s;
  /** @type {VitePluginSvgReactOptions} */
  let config;

  return {
    name: "react-svg",
    enforce: "pre",
    // istanbul ignore next - impossible to test outside of vite runtime
    configResolved(cfg) {
      config = cfg;
    },
    async load(id) {
      if (filter(id)) {
        const file = id.replace(postfixRE, "");
        // Resolve the file path
        /* istanbul ignore next @preserve - we cannot test this outside the vite runtime */
        const filePath = !file.startsWith(cwd) && file.startsWith("/") && config?.publicDir
          ? path.resolve(config.publicDir, file.slice(1))
          : file;
        // Read the SVG file
        const svgCode = await fs.promises.readFile(filePath, "utf8");

        // Transform SVG to React component
        const componentCode = transformSvgToReact(svgCode);

        // Transform the component code using esbuild
        const result = await transformWithEsbuild(componentCode, id, {
          loader: "js",
          ...esbuildOptions,
        });

        return {
          code: result.code,
          map: null,
        };
      }
      return null;
    },
  };
}
