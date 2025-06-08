<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
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

        <q-btn-dropdown
          v-if="authStore.isAuthenticated"
          flat
          :label="authStore.user?.firstName"
          icon="person"
        >
          <q-list>
            <q-item clickable v-close-popup @click="onLogout">
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
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
          v-if="authStore.isAuthenticated"
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
          v-if="authStore.isAuthenticated"
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
          v-if="authStore.isAuthenticated"
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

        <q-item
          v-if="!authStore.isAuthenticated"
          clickable
          v-ripple
          to="/login"
          exact
        >
          <q-item-section avatar>
            <q-icon name="login" />
          </q-item-section>
          <q-item-section>
            Login
          </q-item-section>
        </q-item>

        <q-item
          v-if="!authStore.isAuthenticated"
          clickable
          v-ripple
          to="/register"
          exact
        >
          <q-item-section avatar>
            <q-icon name="person_add" />
          </q-item-section>
          <q-item-section>
            Register
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth.store'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const onLogout = async () => {
  try {
    await authStore.logout()
    await router.push('/login')
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
