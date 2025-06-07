import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';

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

router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  // If the route is public, allow access
  if (!requiresAuth || publicRoutes.includes(to.path)) {
    next();
    return;
  }

  // For protected routes, check if we're in a callback
  if (to.path === '/callback') {
    next();
    return;
  }

  // For all other protected routes, redirect to login
  next('/login');
});

export default router; 