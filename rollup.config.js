import rpi_resolve from '@rollup/plugin-node-resolve'
import { terser as rpi_terser } from 'rollup-plugin-terser'
import rpi_jsy from 'rollup-plugin-jsy-lite'

import pkg from './package.json'
const pkg_name = pkg.name.replace('-', '_')

const configs = []
export default configs

const sourcemap = true

const plugins = [ rpi_jsy(), rpi_resolve() ]
const plugins_min = [ ... plugins, rpi_terser({}) ]


add_jsy('index', {module_name: pkg_name})
add_jsy('asn1_decode')
add_jsy('asn1_encode')


function add_jsy(src_name, opt={}) {
  let module_name = opt.module_name || `${pkg_name}_${src_name}`

  configs.push({
    input: `code/${src_name}.jsy`,
    plugins,
    output: [
      { file: `esm/${src_name}.mjs`, format: 'es', sourcemap },
      { file: `cjs/${src_name}.cjs`, format: 'cjs', exports:'named', sourcemap },
      { file: `umd/${src_name}.js`, format: 'umd', name:module_name, exports:'named', sourcemap }, ]})

  if (plugins_min)
    configs.push({
      input: `code/${src_name}.jsy`,
      plugins: plugins_min,
      output: { file: `umd/${src_name}.min.js`, format: 'umd', name:module_name, exports:'named', sourcemap }})
}
