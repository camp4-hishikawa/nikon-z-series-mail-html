import { webcrypto as crypto } from 'node:crypto'

const _encoder = new TextEncoder()
const _decoder = new TextDecoder()
const encode = (str) => _encoder.encode(str)
const decode = (buf) => _decoder.decode(buf)

export async function importKey(key) {
  return await crypto.subtle.importKey('raw', encode(key), { name: 'AES-CBC' }, false, ['encrypt', 'decrypt'])
}

export async function encrypt(text, key, iv) {
  const _key = await importKey(key)
  const cipherText = await crypto.subtle.encrypt({ name: 'AES-CBC', iv: encode(iv) }, _key, encode(text))
  return Buffer.from(cipherText).toString('base64')
}

export async function decrypt(cipherText, key, iv) {
  const _key = await importKey(key)
  const text = await crypto.subtle.decrypt({ name: 'AES-CBC', iv: encode(iv) }, _key, Buffer.from(cipherText, 'base64'))
  return decode(text)
}
