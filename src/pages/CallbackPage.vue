<template>
  <q-page class="flex flex-center">
    <div class="column items-center">
      <q-spinner-dots size="40px" color="primary" />
      <div class="text-h6 q-mt-md">Completing login...</div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { useQuasar } from 'quasar'

const router = useRouter()
const auth0 = useAuth0()
const $q = useQuasar()

onMounted(async () => {
  try {
    console.log('Handling Auth0 callback...')

    const { appState } = await auth0.handleRedirectCallback()
    console.log('Auth0 callback handled, appState:', appState)
    
    await auth0.checkSession()
    console.log('Auth0 session checked, isAuthenticated:', auth0.isAuthenticated.value)
    
    const targetUrl = appState?.target || '/dashboard/applications'
    console.log('Redirecting to:', targetUrl)
    
    if (auth0.isAuthenticated.value) {
      await router.push(targetUrl)
    } else {
      console.error('Not authenticated after callback')
      await router.push('/login')
    }
  } catch (error) {
    console.error('Error handling callback:', error)
    $q.notify({
      type: 'negative',
      message: 'Error completing login'
    })
    await router.push('/login')
  }
})
</script> 