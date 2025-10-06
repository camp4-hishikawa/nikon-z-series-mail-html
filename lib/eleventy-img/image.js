import { posix } from 'node:path'
import Image from '@11ty/eleventy-img'
import sharp from 'sharp'

import { svgHook, icoHook } from './hooks.js'
import { capitalize, uniq, clamp } from '../util.js'

export default async function (src, args, dir, _imageOptions) {
  let { formatOptions, widths, rename, outPath, generate } = args

  const filepath = `${dir.src}/${src}`
  const origSharp = await sharp(filepath)
  const origMeta = await origSharp.metadata()

  widths = widths.map((width) => {
    if (width === 'auto') return origMeta.width
    else if (/^\d+(\.\d+)?%$/.test(width)) width = Math.round((parseFloat(width) / 100) * origMeta.width)
    if (origMeta.format === 'svg') return parseInt(width)
    return Math.min(parseInt(width), origMeta.width)
  })
  widths = uniq(widths).sort((a, b) => a - b)

  const urlPath = outPath ? posix.resolve('/', outPath) : posix.resolve('/', dir.out, posix.dirname(src))
  const filenameFormat = (id, src, width, format, options) => {
    const suffix = widths.length > 1 && width !== origMeta.width ? `-${width}` : ''
    return `${rename}${suffix}.${format.replace('jpeg', 'jpg')}`
  }
  const imageOptions = {
    widths,
    formats: Object.keys(formatOptions),
    urlPath,
    outputDir: `${dir.dist}${urlPath}`,
    filenameFormat,
    formatHooks: { svg: svgHook, ico: icoHook },
    sharpOptions: {},
    sharpJpegOptions: {},
    sharpPngOptions: {},
    sharpWebpOptions: {},
    sharpAvifOptions: {},
    ..._imageOptions,
  }
  for (const _format of imageOptions.formats) {
    const sharpOptKey = `sharp${capitalize(_format)}Options`
    if (imageOptions[sharpOptKey]) {
      const quality = parseInt(formatOptions[_format].quality)
      if (!isNaN(quality)) imageOptions[sharpOptKey].quality = clamp(0, quality, 100)
    }
  }

  if (!generate) imageOptions.statsOnly = true
  const metadata = await Image(filepath, imageOptions)
  return metadata
}
