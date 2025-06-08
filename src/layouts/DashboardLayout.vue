<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
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
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label header>Navigation</q-item-label>

        <q-item
          clickable
          v-ripple
          to="/dashboard/applications"
          exact
        >
          <q-item-section avatar>
            <q-icon name="description" />
          </q-item-section>
          <q-item-section>
            Applications
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/dashboard/scholarships"
          exact
        >
          <q-item-section avatar>
            <q-icon name="search" />
          </q-item-section>
          <q-item-section>
            Scholarship Search
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/dashboard/profile"
          exact
        >
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>
            Profile
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

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

const authStore = useAuthStore()
const $q = useQuasar()
const isReady = ref(false)
const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

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
  } catch (err) {
    console.error('Failed to initialize auth store:', err)
    $q.notify({
      color: 'negative',
      message: 'Failed to initialize authentication'
    })
  }
})
</script> 