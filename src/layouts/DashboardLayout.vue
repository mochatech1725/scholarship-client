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
              <q-item clickable v-close-popup @click="logout">
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth.store'
import { useQuasar } from 'quasar'

const router = useRouter()
const authStore = useAuthStore()
const $q = useQuasar()

const logout = async () => {
  try {
    await authStore.logout()
    await router.push('/login')
  } catch (err) {
    console.error('Logout failed:', err)
    $q.notify({
      color: 'negative',
      message: 'Logout failed'
    })
  }
}
</script> 