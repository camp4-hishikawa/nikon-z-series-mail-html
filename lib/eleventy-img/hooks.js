import { readFile } from 'node:fs/promises'

import { optimize } from 'svgo'
import pngToIco from 'png-to-ico'

import { kebabCaseKeys } from '../util.js'
import { md5 } from '../md5.cjs'

export async function svgInlineHook(sharpIns, scale = false, attr = {}) {
  const { class: className, ...attributes } = attr
  if (!scale) {
    const { width, height } = await sharpIns.metadata()
    let style = `width:${width}px;height:${height}px`
    if (attributes.style) style = `${attributes.style.replace(/;$/, '')};${style}`
    attributes.style = style
  }
  const svgBuffer = await readFile(sharpIns.options.input.file)
  const prefixId = attributes.id ?? `svg${md5(svgBuffer, 6)}`
  const plugins = [
    { name: 'preset-default', params: { overrides: { removeUnknownsAndDefaults: { unknownAttrs: false } } } },
    { name: 'prefixIds', params: { prefix: prefixId, prefixClassNames: false } },
    'removeXMLNS',
    'removeDimensions',
  ]
  if (className) plugins.push({ name: 'addClassesToSVGElement', params: { className } })
  if (Object.keys(attributes).length) plugins.push({ name: 'addAttributesToSVGElement', params: { attributes: [kebabCaseKeys(attributes)] } })
  return optimize(svgBuffer.toString(), { plugins, multipass: true }).data
}

export async function svgHook(sharpIns) {
  const svgBuffer = await readFile(sharpIns.options.input.file)
  return optimize(svgBuffer.toString(), { plugins: ['preset-default'], multipass: true }).data
}

export async function icoHook(sharpIns) {
  const png = sharpIns.png({ palette: true }).clone()
  const buffers = await Promise.all([16, 32, 48].map((size) => png.resize({ width: size }).toBuffer()))
  return await pngToIco(buffers)
}
