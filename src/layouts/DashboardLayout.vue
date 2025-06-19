<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Scholarship Application Tracker
        </q-toolbar-title>

        <q-btn-dropdown
          v-if="authStore.isAuthenticated"
          flat
          :label="authStore.user?.firstName"
          icon="person"
        >
          <q-list>
            <q-item clickable v-close-popup :to="{ name: 'editProfile' }">
              <q-item-section>Profile</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="onLogout">
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>

      <q-tabs
        v-model="activeTab"
        class="bg-primary text-white"
        align="left"
        narrow-indicator
        mobile-arrows
        dense
      >
        <q-route-tab
          :to="{ name: 'applicationsList' }"
          name="applications"
          icon="description"
          label="Applications"
        />
        <q-route-tab
          :to="{ name: 'recommendersList' }"
          name="recommenders"
          icon="assignment"
          label="Recommenders"
        />

        <q-route-tab
          :to="{ name: 'scholarshipSearch' }"
          name="scholarshipSearch"
          icon="search"
          label="Scholarship Search"
        />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view v-if="isReady" />
      <div v-else class="flex flex-center" style="height: 100vh">
        <q-spinner-dots color="primary" size="40px" />
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

onMounted(async () => {
  try {
    await authStore.initialize()
    isReady.value = true

    // Set active tab based on current route
    if (route.path.includes('/applications')) {
      activeTab.value = 'applications'
    } else if (route.path.includes('/scholarship')) {
      activeTab.value = 'scholarshipSearch'
    } else if (route.path.includes('/recommenders')) {
      activeTab.value = 'recommenders'
    } 
  } catch (err) {
    console.error('Failed to initialize auth store:', err)
    $q.notify({
      color: 'negative',
      message: 'Failed to initialize application'
    })
  }
})

const onLogout = async () => {
  try {
    await authStore.logout()
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
</script> 