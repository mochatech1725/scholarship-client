<template>
  <q-page class="q-pa-md">
    <q-expansion-item
      group="profile"
      icon="person"
      label="Profile"
      header-class="text-h5"
      default-opened
    >
      <q-form @submit="onSubmit" class="q-gutter-y-sm">
        <div class="row q-col-gutter-xs">
          <div class="col-12 col-md-6">
            <q-input
              v-model="form.firstName"
              label="First Name"
              :rules="rules.firstName"
              outlined
              dense
            />
          </div>

          <div class="col-12 col-md-6">
            <q-input
              v-model="form.lastName"
              label="Last Name"
              :rules="rules.lastName"
              outlined
              dense
            />
          </div>

          <div class="col-12 col-md-6">
            <q-input
              v-model="form.emailAddress"
              label="Email"
              type="email"
              :rules="rules.emailAddress"
              outlined
              dense
            />
          </div>

          <div class="col-12 col-md-6">
            <q-input
              v-model="form.phoneNumber"
              label="Phone Number"
              :rules="rules.phoneNumber"
              outlined
              dense
            />
          </div>
        </div>
      </q-form>
    </q-expansion-item>

    <q-expansion-item
      group="profile"
      icon="search"
      label="Search Preferences"
      header-class="text-h5"
      class="q-mt-md"
    >
      <q-form @submit="onSubmit" class="q-gutter-y-sm">
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-md-6">
            <q-select
              v-model="preferences.educationLevel"
              :options="educationLevelOptions"
              label="Education Level"
              outlined
              dense
            />
          </div>

          <div class="col-12 col-md-6">
            <q-select
              v-model="preferences.targetTypes"
              :options="targetTypeOptions"
              label="Target Types"
              multiple
              outlined
              dense
            />
          </div>

          <div class="col-12 col-md-6">
            <q-select
              v-model="preferences.areas"
              :options="areaOptions"
              label="Areas of Interest"
              multiple
              outlined
              dense
            />
          </div>

          <div class="col-12 col-md-6">
            <q-input
              v-model.number="preferences.minAmount"
              label="Minimum Amount"
              type="number"
              outlined
              dense
            />
          </div>
        </div>
      </q-form>
    </q-expansion-item>

    <div class="row justify-end q-mt-lg">
      <q-btn
        type="submit"
        color="primary"
        :loading="loading"
        label="Save Profile"
        @click="onSubmit"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import type { Profile, SearchPreferences } from 'src/types'
import { educationLevelOptions, targetTypeOptions, areaOptions } from 'src/types'
import { useAuthStore } from 'stores/auth.store'

const $q = useQuasar()
const authStore = useAuthStore()
const loading = ref(false)

const form = ref<Profile>({
  firstName: '',
  lastName: '',
  emailAddress: '',
  phoneNumber: ''
})

const preferences = ref<SearchPreferences>({
  educationLevel: 'College Freshman',
  targetTypes: [],
  areas: [],
  minAmount: 0
})

const rules = {
  firstName: [(val: string) => !!val || 'First name is required'],
  lastName: [(val: string) => !!val || 'Last name is required'],
  emailAddress: [
    (val: string) => !!val || 'Email is required',
    (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Invalid email format'
  ],
  phoneNumber: [(val: string) => !val || /^\d{10}$/.test(val.replace(/\D/g, '')) || 'Invalid phone number']
}

const loadProfile = () => {
  try {
    loading.value = true
    // TODO: Implement API call to get profile data
    // For now, just set basic user info from auth store
    const user = authStore.user
    if (user) {
      form.value.firstName = user.firstName
      form.value.lastName = user.lastName
      form.value.emailAddress = user.emailAddress
      form.value.phoneNumber = user.phoneNumber || ''
    }

    // TODO: Load preferences from API
    preferences.value = {
      educationLevel: 'College Freshman',
      targetTypes: ['Merit', 'Both'],
      areas: ['STEM', 'Technology'],
      minAmount: 1000
    }
  } catch (err) {
    console.error('Failed to load profile:', err)
    $q.notify({
      type: 'negative',
      message: 'Failed to load profile'
    })
  } finally {
    loading.value = false
  }
}

const onSubmit = async () => {
  try {
    loading.value = true
    // TODO: Implement profile and preferences update logic
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    $q.notify({
      type: 'positive',
      message: 'Profile updated successfully'
    })
  } catch (err) {
    console.error('Failed to update profile:', err)
    $q.notify({
      type: 'negative',
      message: 'Failed to update profile'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script> 