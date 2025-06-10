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
const publicRoutes = ['login', 'register', 'callback'];

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

  // Wait for authentication state to be determined
  if (!auth0.isAuthenticated.value && !publicRoutes.includes(to.name as string)) {
    await new Promise<void>(resolve => {
      const unwatch = watch(auth0.isAuthenticated, (isAuthenticated) => {
        if (isAuthenticated) {
          unwatch();
          resolve();
        }
      });
    });
  }

  if (to.name === 'home') {
    return next(auth0.isAuthenticated.value ? { name: 'applicationsList' } : { name: 'login' });
  }

  // Allow access to public routes
  if (auth0.isAuthenticated.value || publicRoutes.includes(to.name as string) || !to.matched.some(record => record.meta.requiresAuth)) {
    return next();
  }

  // Redirect to login
  const isLogout = from.name?.toString().startsWith('dashboard');
  return next(isLogout ? { name: 'login' } : { name: 'login', query: { redirect: to.fullPath } });
});

export default router; 