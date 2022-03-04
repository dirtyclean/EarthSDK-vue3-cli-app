import { createApp } from 'vue'
import '@/assets/styles/cover.scss'
import App from './App.vue'
import router, { setupRouter } from './router'
const app = createApp(App)
setupRouter(app)
// createApp(App).mount('#app')
/* eslint-disable */
// XE.ready()会加载Cesium.js等其他资源，注意ready()返回一个Promise对象。
XE.ready()
  .then(() => {
    const p1 = XE.HTML.loadJS('/v1.7.6/XbsjEarth-Plugins/plottingSymbol/plottingSymbol.js')
    // 平滑多边形need
    const p2 = XE.HTML.loadJS('/v1.7.6/XbsjEarth-Plugins/plottingSymbol2/plottingSymbol2.js')
    return Promise.all([p1, p2])
  })
  .then(function startup() {
    router.isReady().then(() => app.mount('#app'))
  })
