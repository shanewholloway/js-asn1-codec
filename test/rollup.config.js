import rpi_resolve from 'rollup-plugin-node-resolve'
import rpi_commonjs from 'rollup-plugin-commonjs'
import rpi_jsy from 'rollup-plugin-jsy-lite'

const sourcemap = 'inline'

const plugins = [
  rpi_jsy(),
  rpi_resolve({ module: true, main: true }),
  rpi_commonjs({ include: 'node_modules/**'}),
]

export default [
  { input: `./unittest.jsy`, context: 'window', plugins,
    output: { file: './__unittest.iife.js', format: 'iife', name: `test_asn1_codec`, sourcemap } },

  { input: `./unittest.jsy`, plugins,
    output: { file: './__unittest.cjs.js', format: 'cjs', sourcemap } },

].filter(Boolean)
