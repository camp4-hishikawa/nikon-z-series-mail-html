import base from 'layouts/base'
import header from 'components/partials/header'
import pageHome from 'pages/index'

base() //共通
header() //ヘッダー

// ページ
// const bodyId = document.body.id
const bodyHasClass = (v) => document.body.classList.contains(v)
if (bodyHasClass('page-home')) pageHome()
