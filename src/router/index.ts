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
    console.log('Auth0 is loading, waiting...');
    await new Promise(resolve => {
      const unwatch = watch(auth0.isLoading, (isLoading) => {
        if (!isLoading) {
          unwatch();
          resolve(true);
        }
      });
    });
  }

  console.log('Router guard - Auth0 state:', {
    isAuthenticated: auth0.isAuthenticated.value,
    isLoading: auth0.isLoading.value,
    path: to.path
  });

  // Handle root path
  if (to.path === '/') {
    return next(auth0.isAuthenticated.value ? '/dashboard/applications' : '/login');
  }

  // Allow access to public routes
  if (publicRoutes.includes(to.path)) {
    return next();
  }

  // Check if the route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  if (!requiresAuth) {
    return next();
  }

  // For protected routes, check authentication
  if (auth0.isAuthenticated.value) {
    return next();
  }

  // If not authenticated, redirect to login
  return next({
    path: '/login',
    query: { redirect: to.fullPath }
  });
});

export default router; 