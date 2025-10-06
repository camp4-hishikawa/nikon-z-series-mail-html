// import { setDocumentClass, fixedViewport } from 'scripts/initializer'
import { documentReady } from 'scripts/documentEvent'
import aesDecrypt from 'scripts/aesDecrypt'

export default async function () {
  // initializer
  // setDocumentClass() //OS・ブラウザのクラスを追加
  // if ('ontouchend' in document) { //Viewport固定
  //   fixedViewport([
  //     { media: 'screen and (max-width: 374.98px)', width: 374 }, //ブレイクポイントxss未満の時に固定する
  //     { media: 'screen and (min-width: 992px) and (max-width: 1199.98px)', width: 1199 }, //ブレイクポイントlgの時に固定する
  //   ])
  // }

  await documentReady()

  // メールアドレス復号化
  aesDecrypt('.js-crypto', ['href'])
}
