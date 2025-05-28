import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/applications'
      },
      {
        path: 'login',
        component: () => import('pages/LoginPage.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: 'register',
        component: () => import('pages/RegisterPage.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: 'applications',
        component: () => import('pages/ApplicationsPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'applications/new',
        component: () => import('pages/ApplicationFormPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'applications/:id',
        component: () => import('pages/ApplicationFormPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'search',
        component: () => import('pages/SearchPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'profile',
        component: () => import('pages/ProfilePage.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
