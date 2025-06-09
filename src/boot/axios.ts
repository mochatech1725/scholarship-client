import { defineBoot } from '#q-app/wrappers';
import axios, { type AxiosInstance } from 'axios';
import { useAuth0 } from '@auth0/auth0-vue';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Debug environment variables
console.log('API Base URL:', import.meta.env.API_BASE_URL)

const api = axios.create({ baseURL: import.meta.env.API_BASE_URL});

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;

  // Add Auth0 token to requests
  api.interceptors.request.use(async (config) => {
    const auth0 = useAuth0();
    if (auth0?.isAuthenticated?.value) {
      try {
        const token = await auth0.getAccessTokenSilently();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error getting token:', error);
      }
    }
    return config;
  });
});

export { api };
