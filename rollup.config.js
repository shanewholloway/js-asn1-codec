import rpi_resolve from '@rollup/plugin-node-resolve'
import { terser as rpi_terser } from 'rollup-plugin-terser'
import rpi_jsy from 'rollup-plugin-jsy-lite'

const sourcemap = true

const plugins = [ rpi_jsy(), rpi_resolve() ]
const plugins_min = [ ... plugins, rpi_terser({}) ]


export default [
  ... add_jsy('index'),
  ... add_jsy('asn1_decode'),
  ... add_jsy('asn1_encode'),
]


function * add_jsy(src_name, opt={}) {
  yield ({
    input: `code/${src_name}.jsy`,
    plugins,
    output: { file: `esm/${src_name}.mjs`, format: 'es', sourcemap }})

  if (plugins_min)
    yield ({
      input: `code/${src_name}.jsy`,
      plugins: plugins_min,
      output: { file: `esm/${src_name}.min.mjs`, format: 'es', sourcemap }})
}
