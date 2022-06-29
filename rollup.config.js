import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'
import dts from 'rollup-plugin-dts'
import { terser } from 'rollup-plugin-terser'
import bundleSize from 'rollup-plugin-bundle-size'
import { visualizer } from 'rollup-plugin-visualizer'

const packageJson = require('./package.json')
const isProduction = process.env.NODE_ENV === 'production'
process.env.VER = packageJson.version

console.log(`[Rollup] - isProduction: ${isProduction}`)
console.log(`[Rollup] - version: ${process.env.VER}`)

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        name: 'gddi-app-canvas'
      },
      {
        // if in package.json -- "module": "dist/esm/index.js",
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
        name: 'gddi-app-canvas'
      }
    ],
    external: ['react', 'react-dom', 'fabric', 'react/jsx-runtime'],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      postcss(),
      json({ compact: true }),
      typescript({ tsconfig: './tsconfig.json' }),
      terser({ compress: { drop_console: true } }),
      bundleSize(),
      visualizer({ sourcemap: true, open: true })
    ]
  },
  {
    // input: 'dist/esm/types/index.d.ts',
    input: 'dist/cjs/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    external: ['react', 'react-dom', 'fabric'],
    plugins: [dts()]
  }
]

// export default async () => ({
//   input: 'src/index.ts',
//   output: [
//     {
//       file: packageJson.main,
//       format: 'cjs',
//       sourcemap: true,
//       name: 'gddi-app-canvas'
//     },
//     {
//       file: packageJson.module,
//       format: 'esm',
//       sourcemap: true
//       //   strict: false
//     }
//   ],
//   external: ['react', 'react-dom', 'fabric'],
//   plugins: [
//     peerDepsExternal(),
//     resolve(),
//     commonjs(),
//     typescript({ useTsconfigDeclarationDir: true }),
//     postcss(),
//     json({ compact: true }),
//     isProduction && (await import('rollup-plugin-terser')).terser(),
//     bundleSize(),
//     visualizer({ sourcemap: true, open: true })
//   ]
// })
