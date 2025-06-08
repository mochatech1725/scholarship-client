import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useAuth0 } from '@auth0/auth0-vue';
import { watch } from 'vue';

const createHistory = process.env.SERVER
  ? createMemoryHistory
  : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes,
  history: createHistory(process.env.VUE_ROUTER_BASE),
});

// Public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/callback'];

router.beforeEach(async (to, from, next) => {
  const auth0 = useAuth0();

  // Wait for Auth0 to finish loading
  if (auth0.isLoading.value) {
    await new Promise<void>(resolve => {
      const unwatch = watch(auth0.isLoading, (loading) => {
        if (!loading) {
          unwatch();
          resolve();
        }
      });
    });
  }

  // Redirect root to appropriate page
  if (to.path === '/') {
    return next(auth0.isAuthenticated.value ? '/dashboard/applications' : '/login');
  }

  // Allow access to public routes
  if (auth0.isAuthenticated.value || publicRoutes.includes(to.path) || !to.matched.some(record => record.meta.requiresAuth)) {
    return next();
  }

  // Redirect to login
  const isLogout = from.path.startsWith('/dashboard');
  return next(isLogout ? '/login' : { path: '/login', query: { redirect: to.fullPath } });
});

export default router; 