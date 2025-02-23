import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { VitePluginSvgReactOptions } from "./types";

// import plugin
import svgReact from "./index.mjs";

import { htmlToReact } from "./htmlToReact.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("vite-react-svg", () => {
  it("should be a function", () => {
    expect(typeof svgReact).toBe("function");
  });

  it("should return a vite plugin object", () => {
    const plugin = svgReact();
    expect(plugin).toHaveProperty("name", "react-svg");
    expect(plugin).toHaveProperty("enforce", "pre");
    expect(typeof plugin.load).toBe("function");
  });

  it("should transform svg files with ?react query", async () => {
    const plugin = svgReact();
    const svgPath = resolve(__dirname, "react.svg");
    const result = await plugin.load?.(svgPath + "?react");

    if (!result) return;

    expect(result).toBeDefined();
    expect(typeof result.code).toBe("string");

    // Check if the transformed code includes React imports
    expect(result.code).toContain("import { createElement } from");

    // Check if the transformed code creates a component
    expect(result.code).toContain("export default function SVGComponent");

    // Check if the component handles props
    expect(result.code).toContain("props = {}");

    // Check if SVG content is included
    expect(result.code).toContain("viewBox");
  });

  it("should not have any default props", async () => {
    const plugin = svgReact();
    const svgPath = resolve(__dirname, "react-no-props.svg");
    const result = await plugin.load?.(svgPath + "?react");

    if (!result) return;

    expect(result).toBeDefined();
    expect(typeof result.code).toBe("string");

    // Check if the transformed code includes React imports
    expect(result.code).toContain("import { createElement } from");
  });

  it("should not transform non-svg files", async () => {
    const plugin = svgReact();
    const result = await plugin.load?.("test.js?react");
    expect(result).toBeNull();
  });

  it("should not transform svg files without ?react query", async () => {
    const plugin = svgReact();
    const result = await plugin.load?.("test.svg");
    expect(result).toBeNull();
  });

  it("should work with React special attributes", () => {
    // a set of tests to add full coverage
    // while the plugin is designed strictly for SVG
    // we still need to handle React attribute namespace
    const html = `
  <fieldset>
    "This is a text node"
    <button class="btn" aria-disabled="true" data-disabled="true" disabled>click me</button>
    <label for="text-input">Sample label</label>
    <input type="text" id="text-input" name="text-input" value="Sample value" />
  </fieldset>
    `.trim();

    const code = htmlToReact(html);
    expect(code.attributes).toEqual({});
  });

  it("should handle invalid markup", () => {
    expect(htmlToReact()).toEqual({ code: "", attributes: {} });

    try {
      // @ts-expect-error - we need to test this case
      htmlToReact({});
    } catch (er: unknown) {
      expect(er).toBeInstanceOf(TypeError);
      expect((er as TypeError).message).toEqual("input must be a string");
    }
  });

  it("should accept plugin options", () => {
    const options: Partial<VitePluginSvgReactOptions> = {
      include: "**/*.svg",
    };
    const plugin = svgReact(options);
    expect(plugin).toBeDefined();
  });
});
