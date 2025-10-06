# FAQ

## v9からの変更点を知りたい

[Changed from v9](./changed-from-v9.md) を参照して下さい。

## サブディレクトリを設定したい

`src/_11ty/site.cjs` の `path` を変更して下さい。

## 簡易サーバーで proxy を使用したい

[browsersync を設定](https://www.11ty.dev/docs/dev-server/#swap-back-to-browsersync) を参考に `eleventy.config.cjs` のサーバーオプションを変更してください。

```js
// eleventyConfig.setServerPassthroughCopyBehavior('passthrough') //コメントアウト
eleventyConfig.setServerOptions({
  module: '@11ty/eleventy-server-browsersync',
  proxy: 'localhost:8888',
  files: [`${baseDir}/assets/**/*.{css,js,jpg,png,svg,webp,avif,gif}`],
  server: false,
  // ...省略
})
```

## メールアドレス復号化が動作しない

https 環境でないと動作しません。  
簡易サーバー含む http 環境でも動作させたい場合は [CryptoJS](https://github.com/brix/crypto-js) をインストールし、`src/scripts/aesCrypto.js` の `decrypt` 関数を書き換えて下さい。

```js
// 追加
import CryptoCore from 'crypto-js/core'
import AES from 'crypto-js/aes'
import Utf8 from 'crypto-js/enc-utf8'

  // 書き換え
  async decrypt(cipherText) {
    return AES.decrypt(cipherText, Utf8.parse(this.#key), { iv: Utf8.parse(this.#iv), mode: CryptoCore.mode.CBC }).toString(Utf8)
  }
```

## 拡張子を.php にしたい、PHP でメールアドレスの暗号化をしたい

[TIPS: PHP](./tips/php.md)
