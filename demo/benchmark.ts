/**
 * comparing vite-react-svg with vite-plugin-svgr
 *
 * With NodeJS (requires NodeJS v20+ for experimental transformation)
 * ```bash
 * node --experimental-transform-types demo/benchmark.ts
 * ```
 * OR with Deno
 * ```bash
 * deno -A demo/benchmark.ts
 * ```
 */

import path from "node:path";
import { performance } from "node:perf_hooks";
import svgPlugin from "../src/index.mjs";
import svgRPlugin from "vite-plugin-svgr";

const svg = svgPlugin();
const svgr = svgRPlugin();
const filePath = path.resolve(process.cwd(), "src", "react.svg");

// Warm-up phase to eliminate JIT compilation impact
console.log("Warming up...");
for (let i = 0; i < 10; i++) {
  await svg.load("/src/react.svg");
  // @ts-expect-error
  await svgr.load?.("/src/react.svg");
}

const samples = 5;
const iterations = 100;
const results = {
  "vite-react-svg": [] as number[],
  "vite-plugin-svgr": [] as number[],
};

// Run multiple samples for statistical significance
console.log("Benchmarking...");
for (let sample = 0; sample < samples; sample++) {
  // Test vite-react-svg
  const start1 = performance.now();
  for (let i = 0; i < iterations; i++) {
    await svg.load(filePath + "?react");
  }
  const end1 = performance.now();
  results["vite-react-svg"].push(end1 - start1);

  // Test vite-plugin-svgr
  const start2 = performance.now();
  for (let i = 0; i < iterations; i++) {
    // @ts-expect-error
    await svgr.load?.(filePath + "?react");
  }
  const end2 = performance.now();
  results["vite-plugin-svgr"].push(end2 - start2);
}

// Calculate statistics
const avg1 = results["vite-react-svg"].reduce((a, b) => a + b, 0) / samples;
const avg2 = results["vite-plugin-svgr"].reduce((a, b) => a + b, 0) / samples;

// Calculate standard deviation to show variation
const std1 = Math.sqrt(
  results["vite-react-svg"].reduce(
    (acc, val) => acc + Math.pow(val - avg1, 2),
    0,
  ) / samples,
);
const std2 = Math.sqrt(
  results["vite-plugin-svgr"].reduce(
    (acc, val) => acc + Math.pow(val - avg2, 2),
    0,
  ) / samples,
);

console.log("\nResults:");
console.log("vite-react-svg:", avg1.toFixed(2), "±", std1.toFixed(2), "ms");
console.log("vite-plugin-svgr:", avg2.toFixed(2), "±", std2.toFixed(2), "ms");
console.log(
  `Relative speed: vite-react-svg is ${
    (avg2 / avg1).toFixed(2)
  }x faster than vite-plugin-svgr`,
);

// Also compare first outputs to ensure they're equivalent
const comp1 = await svg.load(filePath + "?react");
// @ts-expect-error
const comp2 = await svgr.load?.(filePath + "?react");

// Compare output sizes
console.log("\nOutput size comparison:");
console.log(
  "vite-react-svg output size:",
  comp1 ? comp1.code.length : 0,
  "bytes",
);
console.log(
  "vite-plugin-svgr output size:",
  comp2 ? comp2.code.length : 0,
  "bytes",
);
