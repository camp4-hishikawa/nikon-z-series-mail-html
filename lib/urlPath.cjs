const { dirname, resolve, relative, sep } = require('node:path')
const { URL } = require('node:url')
const { md5File } = require('./md5.cjs')

const remoteUrlRegExp = /^(https?:|file:|\/\/)/

class UrlUtil {
  #urlStr = ''
  #pathname = ''
  URL = {}
  absolutePath = null
  relativePath = null

  constructor(urlStr, root, outputPath = null) {
    this.#urlStr = urlStr
    this.#pathname = urlStr.split(/(\?|#)/)[0]
    if (this.#pathname === '') return

    this.URL = new URL(urlStr, 'file:///')
    const outDirPath = outputPath && /\.\w+$/.test(outputPath) ? dirname(outputPath) : outputPath

    if (/^\//.test(this.#pathname)) {
      this.absolutePath = resolve(root, this.#pathname.replace(/^\//, '')) //docRoot
    } else if (outDirPath) {
      this.absolutePath = resolve(outDirPath, this.#pathname) //relative
    } else {
      console.error(`UrlItem.fullPath: missing required arguments "outputPath" (${urlStr})`)
    }

    if (outDirPath && this.absolutePath) this.relativePath = relative(outDirPath, this.absolutePath) || '.'
  }

  url() {
    if (this.#pathname === '') return this.#urlStr
    return this.#pathname + this.URL.search + this.URL.hash
  }

  relativeUrl(prefixDir = true, suffixDir = true) {
    if (this.#pathname === '' || this.relativePath === null) return this.#urlStr
    let relPath = this.relativePath
    if (prefixDir && !relPath.startsWith('.')) relPath = `.${sep}${relPath}`
    if (suffixDir && this.#urlStr.endsWith('/')) relPath += sep
    return relPath.replaceAll(sep, '/') + this.URL.search + this.URL.hash
  }
}

function cacheBuster(urlStr, roots, outputPath = null, paramsName = 'rev', hashLength = 8) {
  if (remoteUrlRegExp.test(urlStr)) return urlStr
  let hash = Date.now()
  let urlItem = null
  if (!Array.isArray(roots)) roots = [roots]
  for (const root of roots) {
    urlItem = new UrlUtil(urlStr, root, outputPath)
    if (urlItem.URL.searchParams.has(paramsName)) return urlStr
    if (urlItem.absolutePath) {
      const _hash = md5File(urlItem.absolutePath, hashLength, false)
      if (_hash) {
        hash = _hash
        break
      }
    }
  }
  if (!urlItem) return urlStr
  urlItem.URL.searchParams.append(paramsName, hash)
  return urlItem.url()
}

function toRelative(urlStr, root, outputPath) {
  if (urlStr.startsWith('!')) return urlStr.substring(1)
  if (remoteUrlRegExp.test(urlStr)) return urlStr
  const urlItem = new UrlUtil(urlStr, root, outputPath)
  return urlItem.relativeUrl()
}

module.exports = { cacheBuster, toRelative }
