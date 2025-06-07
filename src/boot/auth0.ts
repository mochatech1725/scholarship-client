import { boot } from 'quasar/wrappers'
import { createAuth0 } from '@auth0/auth0-vue'

// Debug environment variables
console.log('Auth0 Domain:', import.meta.env.VITE_AUTH0_DOMAIN)
console.log('Auth0 Client ID:', import.meta.env.VITE_AUTH0_CLIENT_ID)
console.log('Auth0 Callback URL:', import.meta.env.VITE_AUTH0_CALLBACK_URL)

const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: import.meta.env.VITE_AUTH0_CALLBACK_URL,
    screen_hint: "signup",
  }
}

console.log('Auth0 Config:', auth0Config)

export default boot(({ app }) => {
  app.use(createAuth0(auth0Config))
}) 