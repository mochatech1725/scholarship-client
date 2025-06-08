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
import { useAuth0 } from '@auth0/auth0-vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth.store'

const auth0 = useAuth0()
const $q = useQuasar()
const authStore = useAuthStore()

const handleCallback = async () => {
  try {
    console.log('Starting callback handling...')
    
    // Handle the redirect callback
    const { appState } = await auth0.handleRedirectCallback()
    console.log('Redirect callback handled, appState:', appState)
    
    // Force a session check
    await auth0.checkSession()
    console.log('Session checked')

    // Wait for Auth0 to finish loading
    while (auth0.isLoading.value) {
      console.log('Waiting for Auth0 to finish loading...')
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // Wait for authentication state to be properly set
    let attempts = 0
    const maxAttempts = 20
    while (!auth0.isAuthenticated.value && attempts < maxAttempts) {
      console.log('Waiting for authentication state...', {
        attempt: attempts + 1,
        isAuthenticated: auth0.isAuthenticated.value,
        isLoading: auth0.isLoading.value,
        user: auth0.user.value
      })
      await new Promise(resolve => setTimeout(resolve, 250))
      attempts++
    }

    // Initialize auth store
    await authStore.initialize()
    
    // Get the target URL
    const targetUrl = appState?.target || '/dashboard/applications'
    console.log('Target URL:', targetUrl)
    
    // Force a hard navigation to the target URL
    window.location.href = targetUrl
  } catch (error) {
    console.error('Error in callback handling:', error)
    $q.notify({
      type: 'negative',
      message: 'Error completing login'
    })
    window.location.href = '/login'
  }
}

onMounted(async () => {
  console.log('Callback page mounted')
  await handleCallback()
})
</script> 