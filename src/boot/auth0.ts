import { boot } from 'quasar/wrappers'
import { createAuth0 } from '@auth0/auth0-vue'

// console.log('Environment Variables:', {
//   domain: import.meta.env.VITE_AUTH0_DOMAIN,
//   clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
//   callbackUrl: import.meta.env.VITE_AUTH0_CALLBACK_URL,
//   origin: window.location.origin,
//   href: window.location.href
// })

const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: import.meta.env.VITE_AUTH0_CALLBACK_URL
  }
}

export default boot(({ app }) => {
  app.use(createAuth0(auth0Config))
}) 