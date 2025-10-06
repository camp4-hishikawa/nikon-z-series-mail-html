# PHP

## 拡張子を .php にしたい

eleventy の [permalink](https://www.11ty.dev/docs/permalinks/) で出力先を指定する

```yaml
permalink: 'hoge/fuga.php'
```

## メールアドレスの暗号化

暗号化を PHP で処理する場合は以下の関数を使用する。

```php
function aesEncrypt($value) {
  $key = 'C7pB7SmuPgcBHdDdALWdOGBdfWxZ82Qd';
  $iv = 'wUXDZBYm00aUcjU1';
  return openssl_encrypt($value, 'aes-256-cbc', $key, 0, $iv);
}
```

```html
<a href="#" class="js-emcrypt" data-href="<?php echo aesEncrypt('mailto:dummy@example.com') ?>">メールリンク</a>
```
