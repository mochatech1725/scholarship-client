import { boot } from 'quasar/wrappers'
import { createAuth0 } from '@auth0/auth0-vue'
import type { CacheLocation } from '@auth0/auth0-vue'

// Debug environment variables
console.log('Auth0 Configuration:', {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  callbackUrl: import.meta.env.VITE_AUTH0_CALLBACK_URL,
  origin: window.location.origin,
  href: window.location.href
})

const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: import.meta.env.VITE_AUTH0_CALLBACK_URL,
    audience: import.meta.env.VITE_AUTH0_AUDIENCE
  },
  cacheLocation: 'localstorage' as CacheLocation,
  useRefreshTokens: true,
  skipRedirectCallback: window.location.pathname === '/callback'
}

export default boot(async ({ app }) => {
  const auth0 = createAuth0(auth0Config)
  
  try {
    app.use(auth0)
    
    // Wait for initial check
    await auth0.checkSession()
    console.log('autho0-Initial Auth0 state:', {
      isAuthenticated: auth0.isAuthenticated.value,
      isLoading: auth0.isLoading.value,
      user: auth0.user.value
    })
  } catch (error) {
    console.error('Error initializing Auth0:', error)
  }
}) 