# 静的ブログ テンプレート

ブログとニュースの Markdown テンプレートを追加します。

`eleventy.config.cjs` の `filter` 部分に以下を追加します。

```js
eleventyConfig.addFilter('date', (value) => {
  return new Intl.DateTimeFormat('ja-JP', { dateStyle: 'short' }).format(new Date(value))
})

eleventyConfig.addFilter('dateISO', (value) => {
  return new Date(value).toLocaleString('sv-SE', { timeZone: 'Asia/Tokyo', timeZoneName: 'longOffset' }).replace(' ', 'T').replace(' GMT', '')
})

eleventyConfig.addFilter('limit', (value, limit = 0) => {
  return limit > 0 && (Array.isArray(value) || typeof value === 'string') ? value.slice(0, limit) : value
})

eleventyConfig.addFilter('extractCurrentPagination', (pagination, limit = 0) => {
  const length = pagination.pages.length
  let min = Math.max(0, pagination.pageNumber - Math.floor(limit / 2))
  const max = Math.min(length, min + limit)
  if (max == length && limit <= length) min = max - limit
  return [...Array(max - min).keys()].map((index) => {
    const index0 = min + index
    return { index: index0 + 1, href: pagination.hrefs[index0], current: index0 == pagination.pageNumber }
  })
})
```

プロジェクトルートで以下のコマンドを実行するとテンプレートが反映されます。

> 反映時に同名のファイルがある場合上書きされます。  
> すでに作業中の場合などはGit等でコミットしてから反映して下さい。

```sh
npx cpx2 "_samples/static-blog/src/**" src -v
```

反映後ビルドを実行して `home-sample.html` 等で確認して下さい。