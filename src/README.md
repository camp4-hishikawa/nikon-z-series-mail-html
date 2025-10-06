# ファイル構造

`components/` , `layouts/` , `pages/` 内は HTML と同じファイル名で必要に応じて CSS, JS を作成します。

# パスの記述

`/` からの絶対パスで記述します。PostHTML・PostCSS でコンパイル時に相対パスへ変換します。

```html
<a href="/">Home</a>
<!-- ↓ -->
<a href="../../">Home</a>
```

```css
background-image: url(/assets/img/logo.png);
/* ↓ */
background-image: url(../img/logo.png);
```

# HTML

[Nunjucks](https://mozilla.github.io/nunjucks/) を使用します。[記述方法など](https://mozilla.github.io/nunjucks/templating.html)

# CSS

[PostCSS](https://postcss.org/) を使用します。 `postcss.config.js` で設定します。  
初期エントリーポイントは `main.css` です。

## エントリーポイントの変更

`package.json > scripts > styles` タスクの [postcss-cli](https://github.com/postcss/postcss-cli) オプションで指定します。

## インライン画像

`background: url('_inline/logo.png')` のように `src/images/_inline` の画像を参照すると変換して埋め込みます。

## beautify

css 生成後に `npm run beautify:styles` を手動実行するか、  
`package.json > scripts > build` の最後に `beautify:styles` を追加すれば `build` タスク時のみ自動で処理されます。

> `dev` タスクでも自動で処理したい場合は [postcss-prettify](https://github.com/codekirei/postcss-prettify) 等を追加して下さい。  
> `cssnano` の無効化は他の最適化処理も無効になる為、推奨しません。

# JavaScript

[esbuild](https://esbuild.github.io/) でビルドします。一部 `jsconfig.json` に設定があります。  
初期エントリーポイントは `main.js` です。

新しい記述は [JavaScript Primer チートシート](https://jsprimer.net/cheatsheet/) で大体見つかります。

## エントリーポイントの変更

`package.json > scripts > scripts` タスクの [esbuild オプション](https://esbuild.github.io/api/#build) で指定します。

## beautify

`scripts` タスクの `--minify` フラグを外します

# images

画像を格納しショートコードで記述すると、最適化した画像を `static/assets/img-opti/` に書き出します。  
[記述や設定はこちらを参照](./images/README.md)

処理したくない画像は `static/assets/img/` 等に格納し、通常の `<img>` タグ等で記述して下さい。

## icon

`images/_inline` に SVG を格納し、 `components/c-icon.css` を編集して追加します。  
HTML に `<span class="c-icon is-hoge"></span>` と記述します。

# static

`static/` 内はフォルダ構造を保ったまま `dist` へコピーされます。
