# ショートコード

## image

### 設定

`eleventy.config.cjs` の `image` ショートコード部分で  
入力や出力ディレクトリ、画像フォーマットのオプション、タグの初期属性値などを設定します。

### 使用方法

設定の入力ディレクトリに画像を格納しファイルパスを指定します。

```njk
{% image 'hoge.jpg' %}
```

```html
<img src="/assets/img-opti/hoge.jpg" width="600" height="400" />
```

### オプション

```js
{% image
    // 入力画像パス (type:string, required) - 設定の入力ディレクトリ基準
    'hoge.jpg',

    // 出力フォーマット (type:string, default:'auto') - 'auto','jpg','png','webp','avif','gif','svg','ico'
    // 'format:N' で画質(0-100)を設定可(jpg,webp,avif,png のみ)、'png:N' は100以外256色へ減色
    // カンマ区切りで複数指定可
    formats='jpg,webp:90',

    // 入力画像ピクセル密度 (type:number) - 密度と画像幅から width, height を算出
    density=2,

    // 出力画像幅 (type:string|number, default:'auto') - 拡大は不可、stringはカンマ区切りで複数指定可
    // 'auto':入力画像幅, '400':400px, '50%':入力画像幅の50%
    // 'density':densityの指定から複数サイズを設定(density=2の場合 '50%,100%' と同等)
    widths='390,50%,auto',

    // メディアクエリ (type:string)
    media=viewportMd,

    // メディア条件サイズ (type:string) - 未設定時は必要に応じで width と同じ値が出力
    sizes='100vw',

    // 出力ファイル名 (type:string) - 未設定時は入力ファイル名と同じ
    rename='fuga',

    // 出力パス (type:string) - 設定の出力パスを上書き、設定の出力ディレクトリ基準
    outPath='/img-hoge/',

    // 出力タグ (type:string|false, default:'img') - 'img','icon',false
    // 'img':必要に応じて<source>タグも出力, 'icon':icon用<link>タグを出力
    // false:画像書出しのみ、HTMLタグは出力しない
    tag='img',

    // 画像出力 (type:boolean, default:true) - falseで画像の生成をせずにタグのみ出力する
    // 処理に時間がかかる画像ファイルで、一度生成後に設定する事で処理時間を短縮出来る
    generate=false,

    // キャッシュ対策 (type:boolean, default:false) - キャッシュ対策用パラメータを追加
    cacheBuster=true,

    // オプションの継承 (type:object) - 上のオプションをオブジェクトで一括指定
    option=imageOption.img,
%}
```

#### 注意

画質の設定を変更した場合は、生成された画像を削除して再ビルドするまで反映されません  
（`npm run clean:img-opti` で img-opti フォルダ内の画像を一括削除）

同じ画像でもオプションが違う場合、  
別の画像として認識されるため画像処理がループしてしまします。

オプションを同じにするか、 `rename` 等で別画像として書き出す指定にして下さい。

### オプションセットの継承

何度も同じオプションを指定する場合は、オプションセットを継承すると便利です。  
`src/pages/pages.11tydata.cjs` でオプションセットを記述。

```js
imageOption: {
  img: {
    formats: 'jpg',
    widths: '750,1200',
  },
},
```

ショートコードで `option` を指定、他のオプションを指定すると上書き出来ます。

```njk
{% image 'hoge.jpg', option=imageOption.img, formats='webp' %}
```

```html
<img src="/assets/img-opti/hoge-750.webp" srcset="/assets/img-opti/hoge-750.webp 750w, /assets/img-opti/hoge.webp 1200w" sizes="1200px" />
```

### タグ属性

オプション以外の属性は HTML タグに追加されます。  
ハイフンを含む属性を指定したい場合は camelCase で記述して下さい。

```njk
{% image 'hoge.jpg', class='u-fluid', dataFoo='bar', alt='hoge' %}
```

```html
<img src="/assets/img-opti/hoge.jpg" class="u-fluid" data-foo="bar" alt="hoge" width="600" height="400" />
```

### picture タグ

`formats` を複数指定、あるいは `media` を指定した場合、 `<source>` タグが出力されるので `<picture>` タグで囲む必要があります。

```njk
<picture>
  {% image 'hoge.jpg', formats='jpg,webp,avif' %}
</picture>
```

### sizes

`srcset` が出力されるオプションを指定した場合、 `sizes` を指定する事でピクセル密度とサイズからブラウザが最適な画像を表示します。 `%` や `auto` は出力画像最大幅の `px` へ変換します。

```njk
{% image 'hoge.jpg', widths='750,1200', sizes=viewportUntilMd+' 100vw, 100%' %}
```

```html
<img src="/assets/img-opti/hoge.jpg" srcset="/assets/img-opti/hoge.jpg 750w, /assets/img-opti/hoge.jpg 1200w" sizes="(max-width: 767.98px) 100vw, 1200px" />
```

### 記述サンプルと出力例

##### 高倍率画像(2 倍)

```njk
{% image 'fuga.jpg', density=2, widths='density' %}
```

```html
<img src="/assets/img-opti/fuga-300.jpg" srcset="/assets/img-opti/fuga-300.jpg 300w, /assets/img-opti/fuga.jpg 600w" width="300" height="200" sizes="300px" />
```

##### メディアクエリ＆複数フォーマット

```njk
<picture>
  {% image 'hoge.jpg', formats='jpg,webp', media=viewportUntilMd %}
  {% image 'fuga.jpg', formats='jpg,webp' %}
</picture>
```

```html
<picture>
  <source media="(max-width: 767.98px)" srcset="/assets/img-opti/hoge.webp 600w" width="600" height="400" type="image/webp" />
  <source media="(max-width: 767.98px)" srcset="/assets/img-opti/hoge.jpg 600w" width="600" height="400" type="image/jpeg" />
  <source srcset="/assets/img-opti/fuga.webp 600w" type="image/webp" />
  <img src="/assets/img-opti/fuga.jpg" width="600" height="400" />
</picture>
```

## svgInline

### 設定

`eleventy.config.cjs` の `svgInline` ショートコード部分で入力ディレクトリを設定します。

### 使用方法

設定の入力ディレクトリに画像を格納しファイルパスを指定します。

```njk
{% svgInline 'hoge.svg' %}
```

### オプション

```js
{% svgInline
    // 入力画像パス (type:string, required) - 設定の入力ディレクトリ基準
    'hoge.svg',
    // スケール (type:boolean, default:true) - false時に入力画像幅をstyle属性で追加
    scale=false
%}
```

オプション以外の属性は [HTML タグに反映](#タグ属性) されます。
