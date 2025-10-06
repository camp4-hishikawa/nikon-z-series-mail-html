# sass を postcss のプラグインでコンパイルする

## package.json

以下のように変更した後 `npm ci` でモジュールをインストールします。  
（バージョン等は検証時のもの）

```js
"scripts": {
  // 変更
  "styles": "npx postcss src/main.scss --dir=dist/assets/css --ext=css",
},
"dependencies": {
  // 追加
  "@csstools/postcss-sass": "^5.0.1",
  "postcss-scss": "^4.0.6",
},
"devDependencies": {
  // 追加
  "stylelint-config-recommended-scss": "^8.0.0"
},
"stylelint": {
  // 追加
  "overrides": [{
    "files": ["**/*.scss"],
    "customSyntax": "postcss-scss"
  }],
  "extends": [
    // stylelint-config-recommendedを置き換え
    "stylelint-config-recommended-scss",
  ]
},
```

## postcss.config.mjs

```js
return {
  map: ctx.options.map,
  plugins: {
    // 先頭に追加
    '@csstools/postcss-sass': { includePaths: ['.'] },
    // postcss-easy-import, postcss-preset-env は削除
  },
  // 追加
  extension: 'css',
  syntax: 'postcss-scss',
  parser: 'postcss-scss',
}
```

## .vscode/settings.json

```js
// 追加
"scss.validate": false,
"stylelint.validate": ["scss"],
```

## CSSの書き換え

初期で用意している PostCSS の `@import` や `@custom-media` などは使用出来なくなるため、  
`@use` に書き換えやメディアクエリの `mixin` などを作成して対応して下さい。 
