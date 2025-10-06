# ソースフォルダ構成の変更

`js`, `css`, `html` という分け方ではなく、`html(.njk)` と同階層に同名で配置する構成に変更しました。

# 自動インストール

他のフレームワーク等の動作に合わせて、タスク実行時の自動インストールを削除しました。  
複数人で作業する場合はモジュールに変更がある度に `npm ci` でインストールを実行して下さい。

# browserslist 自動キャッシュ

初回実行時に対応ブラウザバージョンを固定化する処理を削除しました。

運用案件などで更新毎に差分を出したくないなどバージョンを固定したい場合は、  
[browsersl.ist](https://browsersl.ist/) で確認して `package.json > browserslist` を変更して下さい。

> 例： `and_chr >= 112, chrome >= 110, edge >= 110, firefox >= 110, ios_saf >= 15, safari >= 15`

# prod タスク

`dev` タスクでも最適化処理を標準化したため削除しました。

# static のコピー

`dev` タスク時は `src/static` 内のファイルが `dist` へコピーされません。  
公開時などは `build` タスクを必ず実行して下さい。

# breakpoints

初期値は `md`, `until-md` のブレイクポイントに変更。共通化はせずに各設定ファイル等に移行しました。  
（`src/_vars.css`, `src/pages/pages.11tydata.js`, `src/layouts/base.js`）

# EJS

[Nunjucks](https://mozilla.github.io/nunjucks/) へ移行しました。 → [記述方法など](https://mozilla.github.io/nunjucks/templating.html)  
EJS では Eleventy の機能が一部しか使用出来ないため、 [Filters](https://www.11ty.dev/docs/filters/), [Shortcodes](https://www.11ty.dev/docs/shortcodes/) などに対応するため乗り換えです。

> EJS のように `{% %}` 内は js で何でも記述出来るという感じではありません。

# Sass

PostCSS へ移行しました。  
mixin や function でやっていた事も `var()` や `:where()` で出来る場合が多いです。

@each, @for などで変数を一括生成している場合などは、[Sass meister](https://www.sassmeister.com/) や [CodePen](https://codepen.io/) での出力を貼り付けで事足りる場合が多いと思います。

- `@mixin hover()` → `@media (hover: hover) { &:hover { ... } }`
  - 単純に `&:hover{}` と書いた場合でも iOS16 以降では問題ない？タブレット PC でもマウスカーソルがある場合は hover 判定となる
- `rem()` → `calc(size * (1 / 16rem))`
- `vw()` → `calc(size / base * 100vw)`
  - `vw-range()` など → [Min-Max-Value Interpolation](https://min-max-calculator.9elements.com/) で生成（他参考 [[1]](https://stoffel.io/blog/css-tailwind-fluid-typography-clamp-calc) [[2]](https://chriskirknielsen.com/blog/modern-fluid-typography-with-clamp/)）
- Sass 機能の代替プラグイン：[@mixin](https://github.com/postcss/postcss-mixins), [function](https://github.com/andyjansson/postcss-functions), [@if](https://github.com/andyjansson/postcss-conditionals), [@each](https://github.com/madyankin/postcss-each), [@for](https://github.com/antyakushev/postcss-for), [@rule 内で変数を展開](https://github.com/scrum/postcss-at-rules-variables)

> プラグインを追加しても Sass と同様の処理にするのは難しいため、複雑な処理をしたい場合は Sass を追加して下さい  
> [sass を postcss のプラグインでコンパイルする](./tips/postcss-sass.md)

# favicon, imagemin

Eleventy ショートコードに変更になりました。  
[記述や設定はこちらを参照](../src/images/README.md)

# iconfont

CSS の `mask` を使用する方法に変更になりました。  
[準備や記述はこちらを参照](../src/README.md#images/_icon)

> フォントを生成する手法ではなくなったため下限 10px の制限が無くなります。  
> 以前のものも使う方法はあるので使いたい場合は聞いて下さい

# DesignOverlay

以下のブラウザの拡張機能をインストールして同等の機能が使用出来ます。

- [Window Resizer](https://chrome.google.com/webstore/detail/window-resizer/kkelicaakdanhinjdeammmilcgefonfh?hl=ja)
- [PerfectPixel](https://chrome.google.com/webstore/detail/perfectpixel-by-welldonec/dkaagdgjmgdmbnecmcefdhjekcoceebi)

> 以前のものも使う方法はあるので使いたい場合は聞いて下さい

# svgsprite

初期状態でのインストールはなくなりました。必要な場合は追加して下さい。

- [eleventy-plugin-svg-sprite](https://github.com/patrickxchong/eleventy-plugin-svg-sprite)
- [svg-sprite](https://github.com/svg-sprite/svg-sprite)
