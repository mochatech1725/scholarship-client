import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'stores/auth.store';
import { storeToRefs } from 'pinia';

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
  const authStore = useAuthStore();
  const { isAuthenticated } = storeToRefs(authStore);

  // if (isAuthenticated.value && publicRoutes.includes(to.path)) {
  //   return next('/dashboard/applications');
  // }

  if (to.path === '/') {
    return next(isAuthenticated.value ? '/dashboard/applications' : '/login');
  }

  // Check if the route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  if (!requiresAuth || publicRoutes.includes(to.path)) {
    next();
    return;
  }

  // For protected routes, check if we're in a callback
  if (to.path === '/callback') {
    next();
    return;
  }

  // Check if user is authenticated
  if (isAuthenticated.value) {
    next();
  } else {
    // Redirect to login without query parameters
    next('/login');
  }
});

export default router; 