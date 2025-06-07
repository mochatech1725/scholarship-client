<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const auth0 = useAuth0()

onMounted(async () => {
  try {
    // Wait for Auth0 to be initialized
    if (auth0 && !auth0.isLoading.value) {
      await auth0.checkSession()
      console.log('Session checked')
    } else {
      console.log('Waiting for Auth0 to initialize...')
    }
  } catch (error) {
    console.error('Error checking session:', error)
    $q.notify({
      type: 'negative',
      message: 'Error checking authentication session'
    })
  }
})
</script>
