<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="text-white">
      <q-toolbar class="q-px-md">
        <!-- Logo and Title -->
        <div class="header-brand">
          <img src="/favicon.ico" alt="Scholarship Tracker" style="width: 32px; height: 32px; margin-right: 16px;" />
          <q-toolbar-title class="text-white text-weight-bold header-title">
            Scholarship Tracker
          </q-toolbar-title>
        </div>

        <!-- Spacer to push navigation to the right -->
        <q-space />

        <!-- Desktop Navigation -->
        <div class="desktop-nav q-gutter-md">
          <q-btn
            flat
            :to="{ name: 'applicationsList' }"
            :class="{ 'text-primary': $route.name === 'applicationsList' }"
            label="Applications"
          />
          <q-btn
            flat
            :to="{ name: 'recommendersList' }"
            :class="{ 'text-primary': $route.name === 'recommendersList' }"
            label="Recommenders"
          />
          <q-btn
            flat
            :to="{ name: 'scholarshipSearch' }"
            :class="{ 'text-primary': $route.name === 'scholarshipSearch' }"
            label="Search"
          />
          <q-btn
            flat
            :to="{ name: 'editProfile' }"
            :class="{ 'text-primary': $route.name === 'editProfile' }"
            label="Profile"
          />
        </div>

        <!-- User Menu and Mobile Menu -->
        <q-space />
        
        <!-- Logout Button -->
        <q-btn
          v-if="authStore.isAuthenticated"
          flat
          round
          icon="logout"
          @click="onLogout"
          class="q-mr-sm"
          color="white"
        />

        <!-- Mobile Menu Button -->
        <q-btn
          flat
          round
          icon="menu"
          @click="mobileMenu = !mobileMenu"
          class="mobile-menu-btn"
        />
      </q-toolbar>

      <!-- Mobile Navigation Drawer -->
      <q-slide-transition>
        <div v-show="mobileMenu" class="mobile-nav bg-white">
          <q-list class="q-pa-md">
            <q-item
              clickable
              :to="{ name: 'applicationsList' }"
              @click="mobileMenu = false"
              :class="{ 'text-primary': $route.name === 'applicationsList' }"
            >
              <q-item-section avatar>
                <q-icon name="description" />
              </q-item-section>
              <q-item-section>Applications</q-item-section>
            </q-item>
            
            <q-item
              clickable
              :to="{ name: 'recommendersList' }"
              @click="mobileMenu = false"
              :class="{ 'text-primary': $route.name === 'recommendersList' }"
            >
              <q-item-section avatar>
                <q-icon name="assignment" />
              </q-item-section>
              <q-item-section>Recommenders</q-item-section>
            </q-item>
            
            <q-item
              clickable
              :to="{ name: 'scholarshipSearch' }"
              @click="mobileMenu = false"
              :class="{ 'text-primary': $route.name === 'scholarshipSearch' }"
            >
              <q-item-section avatar>
                <q-icon name="search" />
              </q-item-section>
              <q-item-section>Search</q-item-section>
            </q-item>
            
            <q-item
              clickable
              :to="{ name: 'editProfile' }"
              @click="mobileMenu = false"
              :class="{ 'text-primary': $route.name === 'editProfile' }"
            >
              <q-item-section avatar>
                <q-icon name="person" />
              </q-item-section>
              <q-item-section>Profile</q-item-section>
            </q-item>
            
            <q-separator class="q-my-md" />
            
            <q-item clickable @click="onLogout">
              <q-item-section avatar>
                <q-icon name="logout" />
              </q-item-section>
              <q-item-section>Logout</q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-slide-transition>
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
const mobileMenu = ref(false)

onMounted(() => {
  isReady.value = true

  if (route.path.includes('/applications')) {
    mobileMenu.value = false
  } else if (route.path.includes('/scholarship')) {
    mobileMenu.value = false
  } else if (route.path.includes('/recommenders')) {
    mobileMenu.value = false
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