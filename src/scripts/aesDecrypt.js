class AesDecrypt {
  #key = 'C7pB7SmuPgcBHdDdALWdOGBdfWxZ82Qd'
  #iv = 'wUXDZBYm00aUcjU1'

  constructor(datasetNames) {
    this.datasetNames = datasetNames
  }

  async decrypt(cipherText) {
    const enc = new TextEncoder()
    const cipherTextBuf = Uint8Array.from(atob(cipherText), (c) => c.charCodeAt(0))
    const key = await crypto.subtle.importKey('raw', enc.encode(this.#key), { name: 'AES-CBC' }, false, ['encrypt', 'decrypt'])
    const text = await crypto.subtle.decrypt({ name: 'AES-CBC', iv: enc.encode(this.#iv) }, key, cipherTextBuf)
    return new TextDecoder().decode(text)
  }

  handleEvent(e) {
    const elem = e.currentTarget
    this.datasetNames.forEach(async (name) => {
      if (!elem.dataset[name]) return
      elem.setAttribute(name, await this.decrypt(elem.dataset[name]))
      elem.removeAttribute(`data-${name}`)
    })
    elem.removeEventListener('touchend', this)
    elem.removeEventListener('mouseenter', this)
  }
}

export default async function (selector, datasetNames = ['href']) {
  const aesDecrypt = new AesDecrypt(datasetNames)
  document.querySelectorAll(selector).forEach((elem) => {
    elem.addEventListener('touchend', aesDecrypt)
    elem.addEventListener('mouseenter', aesDecrypt)
  })
}
