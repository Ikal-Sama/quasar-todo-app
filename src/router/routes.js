import { useAuthStore } from '@/stores/auth-store'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('@/pages/IndexPage.vue') },
      { path: 'new', name: 'todo.new', component: () => import('@/pages/NewPage.vue') },
      { path: 'note/:id', name: 'todo.show', component: () => import('@/pages/NotePage.vue') },
    ],
  },

  {
    path: '/',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/pages/LoginPage.vue'),
        meta: { guestOnly: true },
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/pages/RegisterPage.vue'),
        meta: { guestOnly: true },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  },
]

export default routes

// Global beforeEach guard:
// - requires auth for everything except guest-only pages
// - redirects already-authenticated users away from guest-only pages
export const beforeEachGuard = (to) => {
  const auth = useAuthStore()

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'home' }
  }

  if (!to.meta.guestOnly && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
}
