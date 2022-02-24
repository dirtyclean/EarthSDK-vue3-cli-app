import { createApp } from 'vue'
import App from './App.vue'
import router, { setupRouter } from './router'
const app = createApp(App)
setupRouter(app)
// createApp(App).mount('#app')
/* eslint-disable */
// XE.ready()会加载Cesium.js等其他资源，注意ready()返回一个Promise对象。
XE.ready().then(function startup() {
    router.isReady().then(() => app.mount('#app'))
});
