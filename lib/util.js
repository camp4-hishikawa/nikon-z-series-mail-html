import { dirname } from 'node:path'
import { existsSync, mkdirSync, copyFileSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'

// String ============================================================
export function capitalize(s) {
  return s ? s[0].toUpperCase() + s.slice(1) : ''
}

export function kebabCase(str) {
  return str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, s) => (s ? '-' : '') + $.toLowerCase())
}

// Array ============================================================
export function uniq(array) {
  return [...new Set(array)]
}

// Object ============================================================
export function filterBy(obj, filterCallback) {
  return Object.fromEntries(Object.entries(obj).filter(filterCallback))
}

export function pick(obj, keys) {
  return filterBy(obj, ([key]) => keys.includes(key))
}

// export function omit(obj, keys) {
//   return filterBy(obj, ([key]) => !keys.includes(key))
// }

export function omitNil(obj) {
  return filterBy(obj, ([key, value]) => value != null)
}

export function kebabCaseKeys(obj) {
  return Object.keys(obj).reduce((res, key) => {
    res[kebabCase(key)] = obj[key]
    return res
  }, {})
}

// Math ============================================================
export function round(num, decimal = 2) {
  return Number(Math.round(num + `e+${decimal}`) + `e-${decimal}`)
}
export function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max)
}

// File ============================================================
export function ensureDirSync(dir, options = { recursive: true }) {
  if (!existsSync(dir)) mkdirSync(dir, options)
}

export function copySync(src, dist) {
  ensureDirSync(dirname(dist))
  copyFileSync(src, dist)
}

export async function readJson(filepath) {
  if (!existsSync(filepath)) return null
  try {
    return JSON.parse(await readFile(filepath))
  } catch (error) {
    console.error(error)
  }
}

export async function writeJson(filepath, json, beautify = true) {
  ensureDirSync(dirname(filepath))
  try {
    await writeFile(filepath, beautify ? JSON.stringify(json, null, 2) : JSON.stringify(json))
  } catch (error) {
    console.error(error)
  }
}
