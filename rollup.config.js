import rpi_jsy from 'rollup-plugin-jsy-lite'

const configs = []
export default configs

const sourcemap = true

const plugins_base = [ ]

const plugins_nodejs = [
  rpi_jsy({defines: {PLAT_NODEJS: true}})
].concat(plugins_base)

const plugins_web = [
  rpi_jsy({defines: {PLAT_WEB: true}})
].concat(plugins_base)

const plugins = [
  rpi_jsy()
].concat(plugins_base)

const plugins_min = plugins_web.slice()

//import { terser as rpi_terser } from 'rollup-plugin-terser'
//plugins_min.push(rpi_terser({}))


add_esm_jsy('index.all', {outname:'index.all'})

add_node_jsy('index.nodejs', {name: 'asn1_codec', outname:'index'})
add_node_jsy('nodejs/u8_utils', {name: 'u8_utils'})

add_web_jsy('index.web', {name: 'asn1_codec', outname:'asn1_codec'})
add_web_jsy('web/u8_utils', {name: 'u8_utils'})

add_jsy('u8_utils')
add_jsy('asn1_decode')
add_jsy('asn1_encode')

add_jsy('ecdsa')

add_node_jsy('nodejs/ecdh')
add_web_jsy('web/ecdh')
add_jsy('ecdh')


function add_node_jsy(srcname, {outname, name, exports}={}) {
  if (!name) name = srcname.replace(/\//g, '_')
  if (!outname) outname = srcname
  if (!exports) exports = 'named'

  configs.push({
    input: `code/${srcname}.jsy`, plugins: plugins_nodejs,
    output: [
      { file: `esm/${outname}.js`, format: 'es', sourcemap },
      { file: `cjs/${outname}.js`, format: 'cjs', exports, sourcemap },
    ]})
}

function add_web_jsy(srcname, {outname, name, exports}={}) {
  if (!name) name = srcname.replace(/\//g, '_')
  if (!outname) outname = srcname
  if (!exports) exports = 'named'

  configs.push(
    { input: `code/${srcname}.jsy`, plugins: plugins_web,
      output: [
        { file: `esm/${outname}.js`, format: 'es', sourcemap },
        { file: `umd/${outname}.dbg.js`, format: 'umd', name, exports, sourcemap },
    ]},

    { input: `code/${srcname}.jsy`, plugins: plugins_min,
      output: { file: `umd/${outname}.min.js`, format: 'umd', name, exports }, },
  )
}

function add_jsy(srcname, {outname, name, exports}={}) {
  if (!name) name = srcname.replace(/\//g, '_')
  if (!outname) outname = srcname
  if (!exports) exports = 'named'

  configs.push(
    { input: `code/${srcname}.jsy`, plugins,
      output: [
        { file: `esm/${outname}.js`, format: 'es', sourcemap },
        { file: `cjs/${outname}.js`, format: 'cjs', exports, sourcemap },
        { file: `umd/${outname}.dbg.js`, format: 'umd', name, exports, sourcemap },
    ]},

    { input: `code/${srcname}.jsy`, plugins: plugins_min,
      output: { file: `umd/${outname}.min.js`, format: 'umd', name, exports }, },
  )
}

function add_esm_jsy(srcname, {outname}={}) {
  if (!outname) outname = srcname

  configs.push({
    input: `code/${srcname}.jsy`, plugins,
    output: { file: `esm/${outname}.js`, format: 'es', sourcemap }, }) }
