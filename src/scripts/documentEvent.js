/**
 * document ready async対応
 *
 * @example
 * import {documentReady} from 'scripts/documentEvent'
 * await documentReady()
 * console.log('documentReady')
 *
 * @returns {Promise}
 */
export function documentReady(handler) {
  if (document.readyState === 'loading') {
    return new Promise((resolve) => {
      document.addEventListener('DOMContentLoaded', () => resolve(handler))
    })
  }
  return Promise.resolve(handler)
}

/**
 * window onload async対応
 * 使用方法は documentReadyと同じ
 *
 * @returns {Promise}
 */
export function windowLoad(handler) {
  if (document.readyState !== 'complete') {
    return new Promise((resolve) => {
      window.addEventListener('load', () => resolve(handler))
    })
  }
  return Promise.resolve(handler)
}
