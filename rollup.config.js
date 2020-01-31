import rpi_resolve from '@rollup/plugin-node-resolve'
import { terser as rpi_terser } from 'rollup-plugin-terser'
import rpi_jsy from 'rollup-plugin-jsy-lite'

const configs = []
export default configs
const sourcemap = true

const plugins = [ rpi_resolve(), rpi_jsy(), ]
const plugins_min = [ ... plugins, rpi_terser({}), ]


add_jsy('index', {name: 'asn1_codec'})
add_jsy('asn1_codec_plus')

add_jsy('asn1_decode')
add_jsy('asn1_encode')

add_jsy('ecc/index')
add_jsy('ecc/ecc_encode')
add_jsy('ecc/ecc_decode')
add_jsy('ecc/ecc_jwk')

add_jsy('ecc/ecdsa/index')
add_jsy('ecc/ecdsa/ecdsa_encode')
add_jsy('ecc/ecdsa/ecdsa_decode')

//add_node_jsy('nodejs/ecdh')


function add_jsy(srcname, {outname, name, exports, node_only}={}) {
  if (!name) name = srcname.replace(/[_\/]/g, '_')
  if (!outname) outname = srcname
  if (!exports) exports = 'named'

  configs.push({
    input: `code/${srcname}.jsy`, plugins,
    output: [
      { file: `esm/${outname}.mjs`, format: 'es', sourcemap },
      { file: `cjs/${outname}.js`, format: 'cjs', exports, sourcemap },
      !node_only && { file: `umd/${outname}.dbg.js`, format: 'umd', name, exports, sourcemap },
  ].filter(Boolean)})

  !node_only && configs.push({
    input: `code/${srcname}.jsy`, plugins: plugins_min,
    output: { file: `umd/${outname}.min.js`, format: 'umd', name, exports }, })
}

