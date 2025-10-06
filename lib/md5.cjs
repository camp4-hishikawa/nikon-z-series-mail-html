const { existsSync, readFileSync, statSync } = require('node:fs')
const { createHash } = require('node:crypto')

// Crypto ============================================================
function md5(str, length = 0) {
  const hash = createHash('md5').update(str).digest('hex')
  return length > 0 ? hash.substring(0, length) : hash
}

// ファイルのmd5ハッシュを返す
const _md5PathCache = {}
function md5File(filepath, length = 0, errorLog = true) {
  if (!existsSync(filepath)) {
    if (errorLog) console.error(`md5File: file not found. (${filepath})`)
    return null
  }
  const cache = _md5PathCache[filepath]
  const { size, mtimeMs: mtime } = statSync(filepath)
  let hash = null
  if (cache?.size === size && cache.mtime === mtime) {
    hash = cache.hash
  } else {
    hash = md5(readFileSync(filepath))
    _md5PathCache[filepath] = { mtime, size, hash }
  }
  return length > 0 ? hash.substring(0, length) : hash
}

module.exports = { md5, md5File }
