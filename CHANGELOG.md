# Changelog

## [10.0.0] - 2024-07-30

- Node.js v20 以降へ変更、モジュールアップデート
- icon の格納パスを `images/_icon` → `images/_inline` に変更
- 相対パス変換の除外処理を追加（URLの先頭に `!` を付けると!のみ削除）
- アクセシビリティ指摘事項の対応（c-iconのiタグをspanタグに変更、フォーカス時のアウトライン表示）
- njkファイルのフォーマットをprettierに変更
- imageショートコード
  - `sizes="auto"` に対応、画像出力しない `generate=false` の追加
  - 生成キャッシュをファイルとして保持しないように変更
  - デフォルトの画質設定を高画質寄りに変更
  - 画質設定を変更した場合は、生成した画像を削除して再ビルドが必要に
    - `npm run clean:img-opti` で img-opti フォルダ内の画像を一括削除

## [10.0.0-beta.3] - 2023-06-27

- permalink 初期値の指定を再度変更
- site 周りの指定を `src/_11ty/site.cjs` へ移動、`site.url` → `site.base` と `site.path` へ分離

## [10.0.0-beta.2] - 2023-06-06

- permalink 初期値の指定を変更
- 静的ブログサンプルの追加

## [10.0.0-beta] - 2023-05-11

- icon の格納パスを `images/_inline` → `images/_icon` に変更
- メール暗号化の処理を共通のものに変更
  - eleventy フィルタ `emcrypt` → `aesEncrypt`
  - js `emcrypt()` → `aesDecrypt()`
- ショートコード image のオプションを変更
  - `widths='density'` の追加
  - `sizes` を指定した時の HTML 出力を変更
    - `%` `auto` を入力画像幅の `px` に変換
  - `out` → `outDir` に変更
  - `option` の追加
- ショートコード svgInline の `scale` オプション初期値を `false` → `true` に変更
- 画像キャッシュ処理の最適化
- キャッシュ対策の static 対応
- CSS Nesting の記述をネイティブ基準に変更
- 初期クラス名を kebab-case に変更
- ドキュメント作成・整理
- モジュールなどをアップデート

## [10.0.0-alpha.0] - 2023-03-10

シンプルな構成にするため IE11 を完全対象外とし、eleventy(nunjucks), esbuild, postcss での構成へ刷新しました。  
各タスクも別のツールへの変更が可能です。

詳しくは [Changed from v9](./docs/changed-from-v9.md) を参照して下さい。
