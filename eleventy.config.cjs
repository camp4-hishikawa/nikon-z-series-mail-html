const { EleventyHtmlBasePlugin } = require('@11ty/eleventy')
const cpx = require('cpx2')
const posthtml = require('posthtml')
const posthtmlUrls = require('posthtml-urls')
const beautify = require('js-beautify')
const { minify } = require('html-minifier')

const { cacheBuster, toRelative } = require('./lib/urlPath.cjs')
const siteData = require('./src/_11ty/site.cjs')

const isProduction = process.env.NODE_ENV === 'production'
const dist = 'dist' //出力先

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin)

  // config
  if (isProduction) {
    eleventyConfig.ignores.add('src/pages/_dev')
    eleventyConfig.addPassthroughCopy({ 'src/static': '.' }, { dot: true, filter: ['**', '!_dev{,/**}'] })
    eleventyConfig.on('eleventy.after', ({ dir }) => {
      cpx.copySync(`src/static/**/*.{jpg,png,webp,avif,svg,gif,ico}`, dir.output, { ignore: ['_dev'] })
    })
  } else {
    eleventyConfig.addWatchTarget('src/images/')
    eleventyConfig.addPassthroughCopy({ 'src/static': '.' }, { dot: true })
    eleventyConfig.setServerPassthroughCopyBehavior('passthrough')
    eleventyConfig.setServerOptions({
      liveReload: true,
      domDiff: false,
      watch: [`${dist}/assets/css/*.css`, `${dist}/assets/js/*.js`],
      showAllHosts: true,
    })
  }

  // filter
  eleventyConfig.addFilter('cacheBuster', (urlStr, outputPath) => {
    return cacheBuster(urlStr, [dist, 'src/static'], outputPath /*, 'rev', 8 */)
  })

  eleventyConfig.addFilter('aesEncrypt', async (string) => {
    const { encrypt } = await import('./lib/aesCrypto.js')
    const key = 'C7pB7SmuPgcBHdDdALWdOGBdfWxZ82Qd'
    const iv = 'wUXDZBYm00aUcjU1'
    return encrypt(string, key, iv)
  })

  // shortCode image
  eleventyConfig.addAsyncShortcode('image', async (src, args = {}) => {
    const { imageCode } = await import('./lib/eleventy-img/shortcodes.js')
    const options = {
      src: 'src/images', //入力ディレクトリ
      dist: 'src/static', //出力ディレクトリ
      out: '/assets/img-opti/', //デフォルト出力パス
    }
    // @see https://www.11ty.dev/docs/plugins/image/#advanced-control-of-sharp-image-processor
    const imageOptions = {
      sharpJpegOptions: { quality: 87, mozjpeg: true },
      sharpAvifOptions: { quality: 75, effort: 4 },
      sharpWebpOptions: { quality: 85, effort: 2 },
      // 高画質設定
      // sharpJpegOptions: { quality: 90, mozjpeg: true },
      // sharpAvifOptions: { quality: 82, effort: 6 },
      // sharpWebpOptions: { quality: 89, effort: 2 },
    }
    // 生成タグの初期属性値
    const defaultAttrs = { img: { alt: '', loading: 'lazy', decoding: 'async' } }

    return imageCode(src, args, options, imageOptions, defaultAttrs)
  })

  // shortCode svgInline
  eleventyConfig.addAsyncShortcode('svgInline', async (src, args = {}) => {
    const srcDir = 'src/images/_inline' //入力ディレクトリ
    const { scale = true, ...attr } = args
    const { svgInlineCode } = await import('./lib/eleventy-img/shortcodes.js')
    return svgInlineCode(`${srcDir}/${src}`, scale, attr)
  })

  // posthtml 相対パス変換
  eleventyConfig.addTransform('posthtml', async (content, outputPath) => {
    if (!outputPath?.endsWith('.html')) return content
    return await posthtml([posthtmlUrls({ eachURL: (urlStr) => toRelative(urlStr, dist, outputPath) })])
      .process(content)
      .then(({ html }) => html)
      .catch((e) => {
        console.error(e)
        return e.message
      })
  })

  // beautify
  eleventyConfig.addTransform('beautify', (content, outputPath) => {
    if (!outputPath?.endsWith('.html')) return content
    const _content = minify(content, { collapseBooleanAttributes: true, removeEmptyAttributes: true, removeComments: true })
    return beautify.html(_content, { indent_size: 2, preserve_newlines: false, extra_liners: [], unformatted: ['script', 'style', 'svg', 'noscript'] })
  })

  return {
    pathPrefix: siteData.path,
    templateFormats: ['njk', 'md'],
    dir: {
      input: 'src/pages',
      includes: '../components',
      layouts: '../layouts',
      data: '../_11ty',
      output: dist,
    },
  }
}
