import { resolve } from 'node:path'
import { cacheBuster, toRelative } from './lib/urlPath.cjs'

export default function (ctx) {
  const dist = 'dist' //出力先
  return {
    map: ctx.options.map,
    plugins: {
      'postcss-easy-import': {},
      'postcss-preset-env': { stage: 2, autoprefixer: {}, features: { 'nesting-rules': true } },
      'postcss-sort-media-queries': {},
      'postcss-url': [
        { filter: '**/_inline/**', basePath: resolve('src/images'), url: 'inline' },
        {
          filter: '**/*.{jpg,png,webp,svg,gif,avif}',
          url(asset, dir, options, decl, warn, result) {
            let url = cacheBuster(asset.url, [dist, 'src/static'], dir.to) //キャッシュ対策
            url = toRelative(url, dist, dir.to) //相対パス変換
            return url
          },
        },
      ],
      cssnano: { preset: 'default' },
    },
  }
}
