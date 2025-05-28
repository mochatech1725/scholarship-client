<template>
  <q-page class="flex flex-center">
    <q-card class="register-card">
      <q-card-section>
        <div class="text-h6">Create Account</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="firstName"
            label="First Name"
            :rules="[val => !!val || 'First name is required']"
          />

          <q-input
            v-model="lastName"
            label="Last Name"
            :rules="[val => !!val || 'Last name is required']"
          />

          <q-input
            v-model="email"
            label="Email"
            type="email"
            :rules="[
              val => !!val || 'Email is required',
              val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Invalid email format'
            ]"
          />

          <q-input
            v-model="phoneNumber"
            label="Phone Number"
            mask="(###) ###-####"
            :rules="[val => !!val || 'Phone number is required']"
          />

          <q-input
            v-model="password"
            label="Password"
            type="password"
            :rules="[
              val => !!val || 'Password is required',
              val => val.length >= 8 || 'Password must be at least 8 characters'
            ]"
          />

          <q-input
            v-model="confirmPassword"
            label="Confirm Password"
            type="password"
            :rules="[
              val => !!val || 'Please confirm your password',
              val => val === password || 'Passwords do not match'
            ]"
          />

          <div>
            <q-btn label="Register" type="submit" color="primary" class="full-width" />
          </div>

          <div class="text-center q-mt-sm">
            <router-link to="/login" class="text-primary">Already have an account? Login</router-link>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth.store'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phoneNumber = ref('')
const password = ref('')
const confirmPassword = ref('')

const onSubmit = async () => {
  try {
    const success = await authStore.register({
      firstName: firstName.value,
      lastName: lastName.value,
      emailAddress: email.value,
      phoneNumber: phoneNumber.value
    })

    if (success) {
      $q.notify({
        color: 'positive',
        message: 'Registration successful'
      })
      await router.push('/')
    } else {
      $q.notify({
        color: 'negative',
        message: 'Registration failed'
      })
    }
  } catch (err) {
    console.error('Registration error:', err)
    $q.notify({
      color: 'negative',
      message: 'An error occurred'
    })
  }
}
</script>

<style scoped>
.register-card {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}
</style> 