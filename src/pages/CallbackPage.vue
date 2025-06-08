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
import { useAuthStore } from 'stores/auth.store'
import { useRouter } from 'vue-router'

const auth0 = useAuth0()
const authStore = useAuthStore()
const router = useRouter()

const handleCallback = async () => {
  try {
    const success = await authStore.handleCallback()
    if (success) {
      const { appState } = await auth0.handleRedirectCallback()
      const target = appState?.target || '/dashboard/applications'
      await router.push(target)
    } else {
      await router.push('/login')
    }
  } catch (err) {
    console.error('Callback handling failed:', err)
    await router.push('/login')
  }
}

onMounted(async () => {
  await handleCallback()
})
</script> 