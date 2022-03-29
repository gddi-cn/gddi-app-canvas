import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import bundleSize from 'rollup-plugin-bundle-size'
import { visualizer } from 'rollup-plugin-visualizer'

const packageJson = require('./package.json')

export default {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
      name: 'gddi-app-canvas'
    },
    {
      file: packageJson.module,
      format: 'esm',
      strict: false
    }
  ],
  external: [
    // 'canvas-prebuilt',
    // 'canvas',
    // 'jsdom/lib/jsdom/utils',
    // 'jsdom/lib/jsdom/living/generated/utils',
    // 'jsdom',
    // 'xmldom'
    'fabric'
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true }),
    postcss(),
    json({ compact: true }),
    terser(),
    bundleSize(),
    visualizer({ sourcemap: true, open: true })
  ]
}
