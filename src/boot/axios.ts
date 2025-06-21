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
console.log('API Base URL:', import.meta.env.VITE_API_URL)

const api = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

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

  // Add response interceptor for better error handling
  api.interceptors.response.use(
    (response) => {
      console.log('API response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
      return response;
    },
    (error) => {
      console.error('API request failed:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message
      });
      return Promise.reject(new Error(error.message || 'API request failed'));
    }
  );
});

export { api };
