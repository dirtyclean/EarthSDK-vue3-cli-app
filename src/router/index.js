import { createRouter, createWebHashHistory } from 'vue-router'
export const routes = [
  {
    path: '/',
    component: async () => await import('@/views/plotTools.vue'),
    meta: {
      title: 'plotTools'
    }
  },
  {
    path: '/earthComp',
    component: async () => await import('@/views/earthComp.vue'),
    meta: {
      title: 'earthComp'
    }
  },
  {
    path: '/shader',
    component: async () => await import('@/views/shader.vue'),
    meta: {
      title: 'shader'
    }
  },
  {
    path: '/XbsjEarthUI',
    component: async () => await import('@/views/xbsjEarthUI.vue'),
    meta: {
      title: 'XbsjEarthUI'
    }
  },
  {
    path: '/plotTools',
    component: async () => await import('@/views/plotTools.vue'),
    meta: {
      title: 'plotTools'
    }
  }
]

export const router = createRouter({
  history: createWebHashHistory(''),
  routes
})

export function setupRouter(app) {
  app.use(router)
}
export default router
