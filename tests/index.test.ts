import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import type { VitePluginSvgReactOptions } from "../src/types";
import { mockPlugin7Context, mockPlugin8Context } from "./fixtures/mock"

// import plugin
import svgReact from "../src/index.mjs";

import { htmlToReact } from "../src/htmlToReact.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

type Load = (
  id: string,
  ops?: { ssr: boolean },
) => Promise<({ code: string; map: null } | null)>;

vi.mock('vite', async () => {
  const actual = await vi.importActual('vite');
  return {
    ...actual,
    // Mock any Vite exports if necessary
    transformWithOxc: vi.fn().mockImplementation((code) =>
      Promise.resolve({
        code,  // return the same code that was passed
        map: `[{"file": "./file.ts"}]`
      })
    ),
    transformWithEsbuild: vi.fn().mockImplementation((code) =>
      Promise.resolve({
        code,  // return the same code that was passed
        map: [{ "file": "./file.ts" }]
      })
    ),
  };
});

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

  it("should transform svg files with ?react query with vite 7", async () => {
    const plugin = svgReact();
    // @ts-expect-error - this is testing
    plugin?.buildStart?.call(mockPlugin7Context);
    const svgPath = resolve(__dirname, "./fixtures/react.svg");
    const result = await (plugin.load as Load)(svgPath + "?react");

    expect(result).toBeDefined();
    expect(typeof result?.code).toBe("string");

    // Check if the transformed code includes React imports
    expect(result?.code).toContain("import { createElement } from");

    // Check if the transformed code creates a component
    expect(result?.code).toContain("export default function SVGComponent");

    // Check if the component handles props
    expect(result?.code).toContain("props = {}");

    // Check if SVG content is included
    expect(result?.code).toContain("viewBox");

    // Check if SVG map is included
    expect(result?.map).toBeDefined();
  });

  it("should transform svg files with ?react query with vite 8", async () => {
    const plugin = svgReact();
    // @ts-expect-error - this is testing
    plugin?.buildStart?.call(mockPlugin8Context);
    const svgPath = resolve(__dirname, "./fixtures/react.svg");
    const result = await (plugin.load as Load)(svgPath + "?react");

    expect(result).toBeDefined();
    expect(typeof result?.code).toBe("string");

    // Check if the transformed code includes React imports
    expect(result?.code).toContain("import { createElement } from");

    // Check if the transformed code creates a component
    expect(result?.code).toContain("export default function SVGComponent");

    // Check if the component handles props
    expect(result?.code).toContain("props = {}");

    // Check if SVG content is included
    expect(result?.code).toContain("viewBox");

    // Check if SVG map is included
    expect(result?.map).toBeDefined();
  });

  it("should not have any default props", async () => {
    const plugin = svgReact();
    // @ts-expect-error - this is testing
    plugin?.buildStart?.call(mockPlugin8Context);
    const svgPath = resolve(__dirname, "./fixtures/react-no-props.svg");
    const result = await (plugin.load as Load)(svgPath + "?react");

    if (!result) return;

    expect(result).toBeDefined();
    expect(typeof result.code).toBe("string");

    // Check if the transformed code includes React imports
    expect(result.code).toContain("import { createElement } from");
  });

  it("should not transform non-svg files", async () => {
    const plugin = svgReact();
    const result = await (plugin.load as Load)("test.js?react");
    expect(result).toBeNull();
  });

  it("should not transform svg files without ?react query", async () => {
    const plugin = svgReact();
    const result = await (plugin.load as Load)("test.svg");
    expect(result).toBeNull();
  });

  it("should work with React special attributes", () => {
    // a set of tests to add full coverage
    // while the plugin is designed strictly for SVG
    // we still need to handle React attribute namespace
    const html = `
  <fieldset>
    "This is a text node"
    <svg xmlns:xlink="sample-text" xlink:actuate="sample-text" xlink:arcrole="sample" xlink:arcrole="test" xlink:role="bam" xlink:show="yes" xlink:title="Sample" xlink:type="svg"></svg>
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
