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
          :to="{ name: 'applicationsList' }"
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
          :to="{ name: 'scholarships' }"
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
          :to="{ name: 'editProfile' }"
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
          :to="{ name: 'login' }"
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
          :to="{ name: 'register' }"
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
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth.store'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const authStore = useAuthStore()
const router = useRouter()

const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

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

// Watch for authentication state changes
watch(
  () => authStore.isAuthenticated,
  async (isAuthenticated) => {
    if (!isAuthenticated && router.currentRoute.value.path !== '/login') {
      await router.push({ name: 'login' })
    } else if (isAuthenticated) {
      console.log('**** authStore.isAuthenticated changed to true')
    }
  }
)
</script>
