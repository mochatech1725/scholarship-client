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
    // Handle the callback
    const { appState } = await auth0.handleRedirectCallback()
    
    const targetUrl = appState?.targetUrl || '/applications'
    
    // Redirect to the target URL
    await router.push(targetUrl)
  } catch (error) {
    console.error('Error handling callback:', error)
    $q.notify({
      type: 'negative',
      message: 'Error completing login'
    })
    // Redirect to login page on error
    await router.push('/login')
  }
})
</script> 