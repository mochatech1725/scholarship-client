<template>
  <q-form @submit="onSubmit" class="q-gutter-sm">
    <q-expansion-item
      group="profile"
      icon="person"
      label="Profile"
      header-class="text-h5"
      default-opened
    >
      <div class="row q-col-gutter-sm">
        <div class="col-12 col-md-6">
          <q-input
            v-model="form.firstName"
            label="First Name"
            :rules="[val => !!val || 'First name is required']"
            outlined
            dense
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-model="form.lastName"
            label="Last Name"
            :rules="[val => !!val || 'Last name is required']"
            outlined
            dense
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-model="form.emailAddress"
            label="Email Address"
            type="email"
            :rules="[
              val => !!val || 'Email is required',
              val => isValidEmail(val) || 'Invalid email format'
            ]"
            outlined
            dense
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-model="form.phoneNumber"
            label="Phone Number"
            outlined
            dense
          />
        </div>
      </div>
    </q-expansion-item>

    <q-expansion-item
      group="profile"
      icon="search"
      label="Search Preferences"
      header-class="text-h5"
    >
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
    </q-expansion-item>

    <div class="row justify-end q-mt-sm">
      <q-btn
        label="Cancel"
        color="grey"
        flat
        class="q-mr-sm"
        @click="$emit('cancel')"
        dense
      />
      <q-btn
        label="Save"
        type="submit"
        color="primary"
        dense
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Profile, SearchPreferences } from 'src/types'
import { useUserStore } from 'stores/user.store'
import { useAuthStore } from 'stores/auth.store'
import { educationLevelOptions, targetTypeOptions, areaOptions } from 'src/types'

defineProps<{
  isEdit?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', form: Profile, preferences: SearchPreferences): void
  (e: 'cancel'): void
}>()

const userStore = useUserStore()
const authStore = useAuthStore()
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

const isValidEmail = (email: string) => {
  const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
  return emailPattern.test(email)
}

const onSubmit = () => {
  emit('submit', form.value, preferences.value)
}

onMounted(async () => {
  try {
    if (!authStore.isInitialized) {
      await authStore.initialize()
    }
    const user = authStore.user
    if (user) {
      form.value = {
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        phoneNumber: user.phoneNumber || ''
      }
    }
    const profile = await userStore.loadProfile()
    if (profile) {
      form.value = profile
    }
    const loadedPreferences = await userStore.loadPreferences()
    if (loadedPreferences) {
      preferences.value = loadedPreferences
    }
  } catch (error) {
    console.error('Failed to load user data:', error)
  }
})
</script>

<style scoped>
.q-form {
  max-width: 800px;
  margin: 0 auto;
}
</style> 