const { extname, dirname, resolve } = require('node:path')
const { existsSync } = require('node:fs')

const dist = 'dist'
const staticDir = 'src/static'

module.exports = {
  /**
   * fileExists ファイルの存在チェック
   * @param filepath ファイルパス
   * @param base 基準となるパス（filepathで相対パス指定時に必要）
   * @returns {boolean}
   */
  fileExists(filepath, base = null) {
    if (/^\//.test(filepath)) return existsSync(resolve(dist, filepath.replace(/^\//, ''))) || existsSync(resolve(staticDir, filepath.replace(/^\//, '')))
    if (base && extname(base)) base = dirname(base)
    return existsSync(resolve(base ?? '.', filepath))
  },
}
