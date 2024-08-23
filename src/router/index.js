import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import { useUserStore } from '@/stores/modules/user.js'
import {defineAsyncComponent} from "vue";

const isAdmin = (to, from, next) => {
    const payload = JSON.parse(atob(localStorage.getItem('accessToken').split('.')[1]))
    const roles = payload.roles || [];

    if (roles.includes('ROLE_ADMIN')) {
        next()
    } else {
        next({name: 'notFound'})
    }
}

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/HomeView.vue'),
            meta: {
                requiresAuth: true,
                layout: defineAsyncComponent(() => import('@/layouts/MainLayout.vue'))
            },
            redirect: { name: 'finance'},
            children: [
                {
                    path: 'materials',
                    name: 'materials',
                    component: () => import('@/components/warehouse/MaterialsComponent.vue')
                },
                {
                    path: 'products',
                    name: 'products',
                    component: () => import('@/components/warehouse/ProductsComponent.vue')
                },
                {
                    path: 'receipts',
                    name: 'receipts',
                    component: () => import('@/components/warehouse/ReceiptsComponent.vue')
                },
                {
                    path: 'finance',
                    name: 'finance',
                    component: () => import('@/components/finance/FinanceComponent.vue')
                },
                {
                    path: 'logs',
                    name: 'logs',
                    component: () => import('@/components/logs/LogsComponent.vue')
                },

            ]
        },
        {
            path: '/auth',
            name: 'auth',
            component: () => import('@/views/AuthView.vue'),
            meta: {
                layout: defineAsyncComponent(() => import('@/layouts/AuthLayout.vue'))
            }
        },
        {
            path: '/forgot-password',
            name: 'forgot-password',
            component: () => import('@/views/ForgotPasswordView.vue'),
            meta: {
                layout: defineAsyncComponent(() => import('@/layouts/AuthLayout.vue'))
            }
        },
        {
            path: '/reset-password/:resetToken',
            name: 'reset-password',
            component: () => import('@/views/ResetPasswordView.vue'),
            props: true,
            meta: {
                layout: defineAsyncComponent(() => import('@/layouts/AuthLayout.vue'))
            }
        },
        {
            path: '/test',
            name: 'test',
            component: () => import('@/views/TestView.vue'),
            meta: {
                layout: defineAsyncComponent(() => import('@/layouts/BlankLayout.vue'))
            }
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'notFound',
            component: () => import('@/views/NotFound.vue'),
            meta: {
                layout: defineAsyncComponent(() => import('@/layouts/BlankLayout.vue'))
            }
        }
    ]
})

router.beforeEach((to, from, next) => {
    const userStore = useUserStore()

    if (to.path === '/auth' && userStore.isAuthorized) {
        next('/')
    } else if (to.meta.requiresAuth && !userStore.isAuthorized) {
        next('/auth')
    } else {
        next()
    }
})

NProgress.configure({ easing: 'ease', speed: 1000, showSpinner: false, trickle: false })

router.beforeEach(() => {
    NProgress.start()
})

router.afterEach(() => {
    NProgress.done()
})

export default router
