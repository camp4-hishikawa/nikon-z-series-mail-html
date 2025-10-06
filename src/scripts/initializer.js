function findUA(value) {
  const type = Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
  if (type == 'regexp') return navigator.userAgent.match(value)
  if (type == 'string') return navigator.userAgent.indexOf(value) > 0
  return false
}

// document class
export function setDocumentClass() {
  const classList = document.documentElement.classList
  // os
  if (findUA(/iPhone|iP[ao]d/)) classList.add('ios')
  else if (findUA('Macintosh') && 'ontouchend' in document) classList.add('ios')
  else if (findUA('Android')) classList.add('android')
  else if (findUA('Windows')) classList.add('win')
  else if (findUA('Mac OS')) classList.add('mac')

  // browser
  if (findUA('Chrome')) classList.add('chrome')
  else if (findUA('Safari')) classList.add('safari')
  else if (findUA('Firefox')) classList.add('firefox')

  // hover, touch
  // if (window.matchMedia('(hover: hover)').matches) classList.add('hover')
  // if ('ontouchstart' in window || !!navigator.maxTouchPoints) classList.add('touch')
}

// viewport固定
export function fixedViewport(options) {
  if (!options) return
  const $viewport = document.querySelector('meta[name="viewport"]')
  const contentOrig = $viewport.getAttribute('content')
  let prevWidth = null

  // クエリとマッチする場合に固定する
  const fixedMediaChange = () => {
    const { clientWidth } = document.documentElement
    if (prevWidth == clientWidth) return
    let contentVal = contentOrig
    const currentOption = options.find((option) => option._mql.matches)
    if (currentOption) contentVal = contentOrig.replace('width=device-width', `width=${currentOption.width}`)
    $viewport.setAttribute('content', contentVal)
    prevWidth = clientWidth
  }
  options.forEach((option) => {
    option._mql = window.matchMedia(option.media)
    option._mql.addEventListener('change', () => fixedMediaChange())
  })
  fixedMediaChange()

  // 画面回転時にリセットすると再度matchMediaが判定される
  window.addEventListener('orientationchange', () => {
    prevWidth = null
    $viewport.setAttribute('content', contentOrig)
  })
}
