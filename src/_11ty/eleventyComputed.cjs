module.exports = {
  isDev: process.env.NODE_ENV !== 'production', //開発フラグ

  permalink(data) {
    return data.permalink || `${data.page.filePathStem}.${data.page.outputFileExtension}`
  },
}
