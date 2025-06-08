<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth.store'

const $q = useQuasar()
const authStore = useAuthStore()

onMounted(async () => {
  try {
    console.log('App mounted - Initializing auth store')
    await authStore.initialize()
    
    // Log initial state
    // console.log('App mounted - Auth state:', {
    //   isAuthenticated: auth0.isAuthenticated.value,
    //   isLoading: auth0.isLoading.value,
    //   user: auth0.user.value,
    //   storeInitialized: authStore.isInitialized
    // })
  } catch (error) {
    console.error('Error initializing auth:', error)
    $q.notify({
      type: 'negative',
      message: 'Error initializing authentication'
    })
  }
})
</script>
