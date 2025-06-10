<template>
  <q-page padding>
    <div class="text-h5 q-mb-lg">Profile</div>

    <div class="row q-col-gutter-lg">
      <!-- Personal Information -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Personal Information</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="onUpdateProfile" class="q-gutter-md">
              <q-input
                v-model="profile.firstName"
                label="First Name"
                :rules="[val => !!val || 'First name is required']"
              />

              <q-input
                v-model="profile.lastName"
                label="Last Name"
                :rules="[val => !!val || 'Last name is required']"
              />

              <q-input
                v-model="profile.emailAddress"
                label="Email"
                type="email"
                :rules="[
                  val => !!val || 'Email is required',
                  val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Invalid email format'
                ]"
              />

              <q-input
                v-model="profile.phoneNumber"
                label="Phone Number (Optional)"
                mask="(###) ###-####"
              />

              <div class="row justify-end">
                <q-btn
                  label="Update Profile"
                  type="submit"
                  color="primary"
                  :loading="loading"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <!-- Search Preferences -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Search Preferences</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="onUpdatePreferences" class="q-gutter-md">
              <q-select
                v-model="preferences.educationLevel"
                :options="educationLevelOptions"
                label="Education Level"
                :rules="[val => !!val || 'Education level is required']"
              />

              <q-select
                v-model="preferences.targetTypes"
                :options="targetTypeOptions"
                label="Target Types"
                multiple
                use-chips
                :rules="[val => val.length > 0 || 'At least one target type is required']"
              />

              <q-select
                v-model="preferences.areas"
                :options="areaOptions"
                label="Areas of Interest"
                multiple
                use-chips
              />

              <q-input
                v-model.number="preferences.minAmount"
                label="Minimum Amount"
                type="number"
                prefix="$"
              />

              <div class="row justify-end">
                <q-btn
                  label="Save Preferences"
                  type="submit"
                  color="primary"
                  :loading="loading"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth.store'
import type { Profile, SearchPreferences } from 'src/types'
import { educationLevelOptions, targetTypeOptions, areaOptions } from 'src/types'

const $q = useQuasar()
const authStore = useAuthStore()
const loading = ref(false)

const profile = ref<Profile>({
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

const loadProfile = async () => {
  loading.value = true
  try {
    // TODO: Implement API call
    // For now, using mock data
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
    profile.value = {
      firstName: authStore.user?.firstName || '',
      lastName: authStore.user?.lastName || '',
      emailAddress: authStore.user?.emailAddress || '',
      phoneNumber: authStore.user?.phoneNumber || ''
    }

    preferences.value = {
      educationLevel: 'College Freshman',
      targetTypes: ['Merit', 'Both'],
      areas: ['STEM', 'Technology'],
      minAmount: 1000
    }
  } catch (err) {
    console.error('Failed to load profile:', err)
    $q.notify({
      color: 'negative',
      message: 'Failed to load profile'
    })
  } finally {
    loading.value = false
  }
}

const onUpdateProfile = async () => {
  loading.value = true
  try {
    // TODO: Implement API call
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
    $q.notify({
      color: 'positive',
      message: 'Profile updated successfully'
    })
  } catch (err) {
    console.error('Failed to update profile:', err)
    $q.notify({
      color: 'negative',
      message: 'Failed to update profile'
    })
  } finally {
    loading.value = false
  }
}

const onUpdatePreferences = async () => {
  loading.value = true
  try {
    // TODO: Implement API call
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
    $q.notify({
      color: 'positive',
      message: 'Preferences updated successfully'
    })
  } catch (err) {
    console.error('Failed to update preferences:', err)
    $q.notify({
      color: 'negative',
      message: 'Failed to update preferences'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void loadProfile()
})
</script> 