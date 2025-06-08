import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useAuth0 } from '@auth0/auth0-vue';

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

router.beforeEach( (to, from, next) => {

  const auth0 = useAuth0();

  // Handle root path
  if (to.path === '/') {
    const target = auth0.isAuthenticated.value ? '/dashboard/applications' : '/login';
    return next(target);
  }

  // Allow access to public routes
  if (publicRoutes.includes(to.path)) {
    return next();
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  if (!requiresAuth) {
    return next();
  }

  if (auth0.isAuthenticated.value) {
    return next();
  }

  // Only include redirect parameter if we're not coming from a logout
  const isLogout = from.path.startsWith('/dashboard');
  if (isLogout) {
    return next('/login');
  }
  return next({ path: '/login', query: { redirect: to.fullPath } });
});

export default router; 