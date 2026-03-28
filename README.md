# vite-react-svg

[![Coverage Status](https://coveralls.io/repos/github/thednp/vite-react-svg/badge.svg)](https://coveralls.io/github/thednp/vite-react-svg)
[![ci](https://github.com/thednp/vite-react-svg/actions/workflows/ci.yml/badge.svg)](https://github.com/thednp/vite-react-svg/actions/workflows/ci.yml)
[![NPM Version](https://img.shields.io/npm/v/vite-react-svg.svg)](https://www.npmjs.com/package/vite-react-svg)

A Vite plugin that transforms SVG files into React components using the [DOMParser](https://github.com/thednp/domparser).

## Performance
This plugin significantly outperforms alternatives in terms of speed and consistency. You can boost the render speed of your SVG components by up to 3 times.

Performance Benchmark (100 iterations x 5 samples):

| Plugin           | Time (ms) | Std dev (ms) | Output Size (bytes) |
| ---------------- |      ---: |         ---: |                ---: |
| vite-react-svg   | **34.14** |   **±9.44** |                 783 |
| vite-plugin-svgr |    172.73 |      ±92.57 |             **958** |

Relative Performance: **vite-react-svg** is 5x faster!

**Notes**
- find [demo/benchmarks.ts](https://github.com/thednp/vite-react-svg/blob/master/demo/benchmark.ts) and run these tests yourself.
- other tools like [unplugin-icons](https://github.com/unplugin/unplugin-icons/blob/main/README.md#L459-L629) require SVGR and fall into the same performance category.


## Key Advantages
* 🚀 **Superior Speed**: Processes SVGs ~5x faster than alternatives;
* 🎯 **Consistent Performance**: Much lower variance in processing time (±11.21ms vs ±101.89ms);
* 🔄 **Ecosystem Compatible**: Uses esbuild formatter for seamless integration with other Vite plugins.


Visual Performance Comparison:
```
Processing Time (ms) - Lower is better
vite-react-svg  │███ 34ms
vite-plugin-svgr│█████████████████ 173ms

Standard Deviation (ms) - Lower is better
vite-react-svg  │█ 9ms
vite-plugin-svgr│█████████████████ 93ms
```
**Note** - the results are coming from a desktop PC with NodeJS v24.x. Your results my vary.


## Features
* 🚀 Fast transformation using [DOMParser](https://github.com/thednp/domparser)
* 🎯 TypeScript support
* 🔧 Configurable transformation options
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
deno add -D npm:vite-react-svg
```

```bash
bun add -D vite-react-svg
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
  include?: string | RegExp | (string | RegExp)[]
  exclude?: string | RegExp | (string | RegExp)[]
}
```

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
```tsx
import Icon from './icon.svg?react'

const app = () => {
  return <div>
    <Icon
      class='my-icon'
      width={24} height={24}
      style={{ fill: "currentColor" }}
    />
  </div>
}
```
**Notes**:
 * All properties present in the markup of your SVG files will be used as default values;
 * The `viewBox` and `xmlns` properties are somewhat required in order for the SVG to be rendered properly;
 * The plugin will also resolve SVG files from the `/public` folder or any valid `viteConfig.publicDir` option.


## Acknowledgments
* [vite-plugin-svgr](https://github.com/pd4d10/vite-plugin-svgr) - For inspiration on the plugin architecture.
* [vite-solid-svg](https://github.com/thednp/vite-solid-svg) - For a SolidJS version.


## License
**vite-react-svg** is released under [MIT License](LICENSE).
