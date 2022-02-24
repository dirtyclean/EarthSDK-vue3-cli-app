import { createRouter, createWebHashHistory } from 'vue-router'
export const routes = [
    {
        path: '/',
        component: async () => await import('@/components/demo.vue'),
        meta: {
            title: '首页'
        }
    },
    {
        path: '/earthComp',
        component: async () => await import('@/components/EarthComp.vue'),
        meta: {
            title: 'earthComp'
        }
    },
    {
        path: '/shader',
        component: async () => await import('@/components/shader.vue'),
        meta: {
            title: 'shader'
        }
    },
    {
        path: '/XbsjEarthUI',
        component: async () => await import('@/components/XbsjEarthUI.vue'),
        meta: {
            title: 'XbsjEarthUI'
        }
    },
]

export const router = createRouter({
    history: createWebHashHistory(''),
    routes
})

export function setupRouter(app) {
    app.use(router)
}
export default router
