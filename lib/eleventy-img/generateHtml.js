import { pick, omitNil, kebabCaseKeys } from '../util.js'

const formatOrder = ['avif', 'webp', 'svg', 'png', 'jpeg']

function objectToHTML(tag, attrs = {}) {
  const html = Object.entries(omitNil(attrs))
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ')
  return `<${tag}${html ? ` ${html}` : ''}>`
}

export default function (tag, metadata, attrs) {
  attrs = kebabCaseKeys(attrs)
  const formats = Object.keys(metadata)
  const imgFormat = attrs.media ? null : formatOrder.findLast((fm) => formats.indexOf(fm) > -1)
  const resultTags = []
  if (tag == 'img') {
    const sourceFormats = formatOrder.filter((format) => formats.includes(format))
    for (const format of sourceFormats) {
      const metaList = metadata[format]
      const srcset = metaList.map(({ srcset }) => srcset).join(', ')
      if (format == imgFormat) {
        const attr = { src: metaList[0].url }
        if (attrs.sizes) attr.srcset = srcset
        resultTags.push(objectToHTML('img', { ...attrs, ...attr }))
      } else {
        const attr = { srcset, type: metaList[0].sourceType }
        resultTags.push(objectToHTML('source', { ...pick(attrs, ['media', 'width', 'height', 'sizes']), ...attr }))
      }
    }
  } else {
    for (const format of formats) {
      const metaList = metadata[format]
      let attr = {}
      if (tag == 'icon') {
        tag = 'link'
        attr = { rel: attrs.rel ?? 'icon', href: metaList[0].url, type: !('type' in attrs) ? metaList[0].sourceType : null }
      }
      resultTags.push(objectToHTML(tag, { ...attrs, ...attr }))
    }
  }
  return resultTags.join('\n')
}
