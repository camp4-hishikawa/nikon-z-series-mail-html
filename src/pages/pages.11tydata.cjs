module.exports = {
  // ページ初期値
  layout: 'base.njk',
  title: '❌タイトル未設定',
  description: '',
  bodyId: '',
  bodyClass: '',
  ogUrl: '',
  ogImage: '/assets/img/ogp.png',
  ogTitle: '',
  ogType: 'article',

  viewportMd: '(min-width: 768px)',
  viewportUntilMd: '(max-width: 767.98px)',
  // 参考：https://getbootstrap.jp/docs/5.0/layout/breakpoints/#available-breakpoints
  // safari16.4以降対応：https://caniuse.com/css-media-range-syntax

  // imageショートコード オプションセット
  imageOption: {
    img: {
      formats: 'jpg,avif',
      widths: '750,1200,1600',
      // sizes: '(max-width: 767.98px) 100vw, auto',
    },
  },
}
