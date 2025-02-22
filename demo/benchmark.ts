/**
 * comparing vite-react-svg with vite-plugin-svgr
 * 
 *  * With NodeJS (requires NodeJS v20+ for experimental transformation)
 * ```bash
 * node --experimental-transform-types demo/benchmark.ts
 * ```
 * OR with Deno
 * ```bash
 * deno -A demo/benchmark.ts
 * ```
 */

import svgPlugin from "../src/index.mjs";
import svgRPlugin from "vite-plugin-svgr";

// const svgPlugin = await import("../src/index.mjs");

const svg = svgPlugin();
const svgr = svgRPlugin();
let startTime1 = 0;
let endTime1 = 0;
let dif1 = 0;
let startTime2 = 0;
let endTime2 = 0;
let dif2 = 0;
let comp1: string | undefined = '';
let comp2: string | undefined = '';

console.log('Benchmarking...');
startTime1 = new Date().getTime();
for (let i = 0; i < 100; i += 1) {
    const res = await svg.load("../src/react.svg");
    if (!i) comp1 = res?.code;
}
endTime1 = new Date().getTime();
dif1 = endTime1 - startTime1;
console.log('vite-react-svg: ', dif1, 'ms');

startTime2 = new Date().getTime();
for (let i = 0; i < 100; i += 1) {
    // @ts-expect-error
    const res = (await svgr.load?.("../src/react.svg"));
    if (!i) comp2 = res;
}
endTime2 = new Date().getTime();
dif2 = endTime2 - startTime2;
console.log('vite-plugin-svgr: ', dif2, 'ms');

console.log(`vite-react-svg is ${(dif2/dif1).toFixed(2)}x faster`);

console.log({ comp1 })
console.log({ comp2 })
