# vite-react-svg

[![Coverage Status](https://coveralls.io/repos/github/thednp/vite-react-svg/badge.svg)](https://coveralls.io/github/thednp/vite-react-svg)
[![ci](https://github.com/thednp/vite-react-svg/actions/workflows/ci.yml/badge.svg)](https://github.com/thednp/vite-react-svg/actions/workflows/ci.yml)
[![NPM Version](https://img.shields.io/npm/v/vite-react-svg.svg)](https://www.npmjs.com/package/vite-react-svg)
[![typescript version](https://img.shields.io/badge/typescript-5.6.2-brightgreen)](https://www.typescriptlang.org/)
[![react version](https://img.shields.io/badge/react-19.0.0-brightgreen)](https://github.com/facebook/react)
[![vitest version](https://img.shields.io/badge/vitest-3.0.6-brightgreen)](https://www.vitest.dev/)
[![vite version](https://img.shields.io/badge/vite-6.1.1-brightgreen)](https://vite.dev)


A Vite plugin that transforms SVG files into React components using the [DOMParser](https://github.com/thednp/domparser).

## Performance
This plugin significantly outperforms alternatives in terms of speed and consistency. You can boost the render speed by up to 3 times. Here are the benchmark results:

```
Performance Benchmark (100 iterations x 5 samples):
┌─────────────────┬────────────┬──────────────┬──────────────┐
│ Plugin          │ Time (ms)  │ Std Dev (ms) │ Output Size  │
├─────────────────┼────────────┼──────────────┼──────────────┤
│ vite-react-svg  │    76.99   │    ±11.93    │   720 bytes  │
│ vite-plugin-svgr│   217.36   │    ±95.54    │   708 bytes  │
└─────────────────┴────────────┴──────────────┴──────────────┘

Relative Performance: vite-react-svg is 2.82x faster!
```
**Note** - find `demo/benchmarks.ts` and run these tests yourself.


## Key Advantages
* 🚀 **Superior Speed**: Processes SVGs 2.82x faster than alternatives
* 🎯 **Consistent Performance**: Much lower variance in processing time (±11.93ms vs ±95.54ms)
* ⚡ **Efficient Output**: Generates optimized output (720 bytes) comparable to alternatives
* 🔄 **Ecosystem Compatible**: Uses esbuild formatter for seamless integration with other Vite plugins


Visual Performance Comparison:
```
Processing Time (ms) - Lower is better
vite-react-svg  │████████ 77ms
vite-plugin-svgr│████████████████████████ 217ms

Standard Deviation (ms) - Lower is better
vite-react-svg  │█ 12ms
vite-plugin-svgr│████████████ 96ms
```
**Note** - the results are coming from a desktop PC with NodeJS v23.5. Your results my vary.


## Features
* 🚀 Fast transformation using [DOMParser](https://github.com/thednp/domparser)
* 🎯 TypeScript support
* 🔧 Configurable transformation options
* 💪 Full props support (className, style, events, etc.)
* 🔥 Hot Module Replacement (HMR) support
* ⚡ Vitest powered tests


## Installation

```bash
npm install -D vite-react-svg
```

```bash
pnpm add -D vite-react-svg
```

```bash
yarn add -D vite-react-svg
```

```bash
deno add npm:vite-react-svg
```

```bash
bun install vite-react-svg
```


## Usage
### Configuration
```ts
// vite.config.ts
import { defineConfig } from 'vite'
import reactSVG from 'vite-react-svg'

export default defineConfig({
  plugins: [
    // other plugins
    reactSVG({
        // optional
    })
  ]
})
```

### Options
While the default options work just fine, for your convenience the plugin allows you to set them all:

```ts
interface VitePluginReactSvgOptions {
  // esbuild transform options
  esbuildOptions?: EsbuildTransformOPtions;
  // filter options
  include?: string | RegExp | (string | RegExp)[]
  exclude?: string | RegExp | (string | RegExp)[]
}
```

* `esbuildOptions`: [EsbuildTransformOptions](https://esbuild.github.io/api/#transform) esbuild will make sure the plugin will work seamless within the Vite ecosystem and provides some additional options;
* `include`: filter option to **include** one or more RegExp for file IDs; the default value is `["**/*.svg?react"]`;
* `exclude`: filter option to **exclude** one or more RegExp for file IDs.

**Note** - If you modify or add more include filters and you're using Typescript, you should also define new global modules.


### Typescript
To add typescript support, edit your `src/vite-env.d.ts` (or any global types you have set in your app) as follows:

```ts
/// <reference types="vite/client" />
/// <reference types="vite-react-svg" />
```


### In Your Code
```ts
import Icon from './icon.svg?react'

const app = () => {
  return div(
    Icon({ 
      width: 24,
      height: 24,
      class: 'my-icon',
      style: 'fill: "currentColor"'
    })
  )
}
```
**Notes**:
 * All properties present in the markup of your SVG files will be used as default values;
 * The `viewBox` and `xmlns` properties are somewhat required in order for the SVG to be rendered properly;
 * The plugin will also resolve SVG files from the `/public` folder or any valid `viteConfig.publicDir` option.


## Contributing
* Fork it!
* Create your feature branch: `git checkout -b my-new-feature`
* Commit your changes: `git commit -am 'Add some feature'`
* Push to the branch: `git push origin 'my-new-feature'`
* Submit a pull request


## Acknowledgments
* [vite-plugin-svgr](https://github.com/pd4d10/vite-plugin-svgr) - For inspiration on the plugin architecture.


## License
**vite-react-svg** is released under [MIT License](LICENSE).
