import rpi_resolve from '@rollup/plugin-node-resolve'
import rpi_replace from '@rollup/plugin-replace'
import rpi_commonjs from '@rollup/plugin-commonjs'
import rpi_strip_code from 'rollup-plugin-strip-code'
import rpi_jsy from 'rollup-plugin-jsy-lite'

const sourcemap = 'inline'

const plugins = [
  rpi_jsy(),
  rpi_resolve(),
  rpi_commonjs({ include: 'node_modules/**'}),
]

const plugins_nodejs = conditional_plugins('NODEJS').concat(plugins)
const plugins_web = conditional_plugins('WEB', 'window').concat(plugins)

const config = [
  { input: `./unittest.jsy`, context: 'window', plugins: plugins_web,
    output: { file: './__unittest.iife.js', format: 'iife', name: `test_asn1_codec`, sourcemap } },

  { input: `./unittest.jsy`, plugins: plugins_nodejs,
    output: { file: './__unittest.cjs.js', format: 'cjs', sourcemap } },
]
export default config

config.push({
  input: `./unit/ecdh/test.jsy`, plugins: plugins_nodejs,
  output: { file: './oow/ecdh.js', format: 'cjs', sourcemap } })


function conditional_plugins(section, context) {
  if (! /^[A-Z]+$/.test(section))
    throw new Error(`Expected section to be an uppercase word`)
  return [
    rpi_strip_code({
      start_comment: `BEGIN (?!${section})[A-Z]+ ONLY`,
      end_comment: `END (?!${section})[A-Z]+ ONLY`,
    }),
    rpi_replace({
      'typeof window': 'window' === context ? '"object"' : '"undefined"',
    }),
  ]
}
