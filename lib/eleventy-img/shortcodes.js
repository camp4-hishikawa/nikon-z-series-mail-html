import { basename, extname } from 'node:path'
import Image from '@11ty/eleventy-img'

import { svgInlineHook } from './hooks.js'
import ProcessImage from './image.js'
import generateHtml from './generateHtml.js'
import { round } from '../util.js'
import urlPath from '../urlPath.cjs'
import { md5File } from '../md5.cjs'

export async function imageCode(src, args, options, imageOptions, defaultAttrs) {
  delete args.__keywords
  if (args.option) {
    args = Object.assign({}, args.option, args)
    delete args.option
  }

  let { density = 1, formats = 'auto', widths = 'auto', rename = null, outPath = null, tag = 'img', generate = true, cacheBuster = false, ...attr } = args
  const urlItem = new URL(src, 'file:///')
  src = src.replace(/(\?|#).*?$/, '')

  const formatOptions = formats.split(',').reduce((res, formatStr) => {
    let [format = 'auto', quality = null] = formatStr.trim().split(':')
    if (format == 'auto') format = extname(src).slice(1) || 'webp'
    res[format.replace('jpg', 'jpeg')] = { quality }
    return res
  }, {})

  widths = `${widths}`
    .split(',')
    .map((width) => {
      if (width === 'density') return [...Array(density).keys()].map((i) => `${round(((i + 1) / density) * 100, 5)}%`)
      return width
    })
    .flat()

  if (!rename) rename = basename(src, extname(src))

  const metadata = await ProcessImage(src, { formatOptions, widths, rename, outPath, generate }, options, imageOptions)
  if (!tag) return ''

  for (const [format, metaList] of Object.entries(metadata)) {
    metaList.forEach((meta, i) => {
      const origUrl = meta.url
      if (urlItem.search) meta.url += urlItem.search
      if (urlItem.hash) meta.url += urlItem.hash
      if (cacheBuster) meta.url = urlPath.cacheBuster(meta.url, options.dist)
      if (origUrl != meta.url) meta.srcset = meta.srcset.replace(origUrl, meta.url)
    })
  }

  if (tag == 'img') {
    const maxMeta = metadata[Object.keys(metadata)[0]].at(-1)
    const width = Math.round(maxMeta.width / density)
    if (!attr.sizes || attr.sizes == 'auto') {
      const height = Math.round(maxMeta.height / density)
      if (!('width' in attr)) attr.width = width
      if (!('height' in attr)) attr.height = height
      if (widths.length > 1) attr.sizes = 'auto'
    } else {
      delete attr.width
      delete attr.height
      attr.sizes = attr.sizes.replace(/\d+(\.\d+)?%/g, (m) => Math.round((parseFloat(m) / 100) * width) + 'px')
    }
  }
  const defaultAttr = defaultAttrs[tag] ?? {}
  return generateHtml(tag, metadata, { ...defaultAttr, ...attr })
}

const _svgInlineCache = {}
export async function svgInlineCode(src, scale = true, attr = {}) {
  delete attr.__keywords
  const hash = JSON.stringify({ hash: md5File(src), scale, attr })
  const svgHook = async (sharpIns) => await svgInlineHook(sharpIns, scale, attr)
  const metadata = await Image(src, { formats: ['svg'], dryRun: true, formatHooks: { svg: svgHook }, useCache: _svgInlineCache[src] === hash })
  _svgInlineCache[src] = hash
  return metadata.svg[0].buffer.toString() ?? ''
}
