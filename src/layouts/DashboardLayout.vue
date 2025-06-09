<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>

        <q-toolbar-title>
          Scholarship Application Tracker
        </q-toolbar-title>
        <q-btn flat round dense icon="person" class="q-ml-sm">
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup to="/dashboard/profile">
                <q-item-section>Profile</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="onLogout">
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>

      <q-tabs
        v-model="activeTab"
        class="bg-primary text-white"
        align="left"
        narrow-indicator
      >
        <q-route-tab
          to="/dashboard/applications"
          name="applications"
          icon="description"
          label="Applications"
        />
        <q-route-tab
          to="/dashboard/scholarships"
          name="scholarships"
          icon="search"
          label="Scholarship Search"
        />
      </q-tabs>
    </q-header>



    <q-page-container>
      <router-view v-if="isReady" />
      <div v-else class="flex flex-center" style="height: 100vh">
        <q-spinner-dots size="40px" color="primary" />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from 'stores/auth.store'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'

const authStore = useAuthStore()
const $q = useQuasar()
const route = useRoute()
const isReady = ref(false)
const activeTab = ref('applications')

const onLogout = async () => {
  try {
    await authStore.logout()
    window.location.href = '/login'
    $q.notify({
      color: 'positive',
      message: 'Logged out successfully'
    })
  } catch (err) {
    console.error('Logout failed:', err)
    $q.notify({
      color: 'negative',
      message: 'Logout failed'
    })
  }
}

// Watch for authentication state changes
// watch(
//   () => authStore.isAuthenticated,
//   async (isAuthenticated) => {
//     console.log('DashboardLayout - Authentication state changed:', { isAuthenticated })
//     if (!isAuthenticated) {
//       try {
//         await router.push('/login')
//       } catch (err) {
//         console.error('Failed to redirect to login:', err)
//       }
//     }
//   }
// )

// Initialize auth store
onMounted(async () => {
  try {
    await authStore.initialize()
    isReady.value = true
    // Set active tab based on current route
    if (route.path.includes('/scholarships')) {
      activeTab.value = 'scholarships'
    } else {
      activeTab.value = 'applications'
    }
  } catch (err) {
    console.error('Failed to initialize auth store:', err)
    $q.notify({
      color: 'negative',
      message: 'Failed to initialize authentication'
    })
  }
})
</script> 