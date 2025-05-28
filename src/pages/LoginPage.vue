<template>
  <q-page class="flex flex-center">
    <q-card class="auth-card">
      <q-card-section class="text-center">
        <div class="text-h5 q-mb-md">Scholarship Tracker</div>
        <q-btn-toggle
          v-model="isLogin"
          spread
          no-caps
          rounded
          unelevated
          toggle-color="primary"
          color="grey-3"
          text-color="grey-8"
          class="full-width"
          :options="[
            { label: 'Login', value: true },
            { label: 'Register', value: false }
          ]"
        />
      </q-card-section>

      <!-- Login Form -->
      <q-card-section v-if="isLogin">
        <q-form @submit="onLogin" class="q-gutter-md">
          <q-input
            v-model="loginForm.emailAddress"
            label="Email"
            type="email"
            :rules="[val => !!val || 'Email is required', isValidEmail]"
          />

          <q-input
            v-model="loginForm.password"
            label="Password"
            type="password"
            :rules="[val => !!val || 'Password is required']"
          />

          <div>
            <q-btn
              label="Login"
              type="submit"
              color="primary"
              class="full-width"
            />
          </div>
        </q-form>
      </q-card-section>

      <!-- Register Form -->
      <q-card-section v-else>
        <q-form @submit="onRegister" class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                v-model="registerForm.firstName"
                label="First Name"
                :rules="[val => !!val || 'First name is required']"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="registerForm.lastName"
                label="Last Name"
                :rules="[val => !!val || 'Last name is required']"
              />
            </div>
          </div>

          <q-input
            v-model="registerForm.emailAddress"
            label="Email"
            type="email"
            :rules="[val => !!val || 'Email is required', isValidEmail]"
          />

          <q-input
            v-model="registerForm.phoneNumber"
            label="Phone Number"
            mask="(###) ###-####"
            :rules="[val => !!val || 'Phone number is required']"
          />

          <q-input
            v-model="registerForm.password"
            label="Password"
            type="password"
            :rules="[
              val => !!val || 'Password is required',
              val => val.length >= 8 || 'Password must be at least 8 characters'
            ]"
          />

          <q-input
            v-model="registerForm.confirmPassword"
            label="Confirm Password"
            type="password"
            :rules="[
              val => !!val || 'Please confirm your password',
              val => val === registerForm.password || 'Passwords do not match'
            ]"
          />

          <div>
            <q-btn
              label="Register"
              type="submit"
              color="primary"
              class="full-width"
            />
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

const isLogin = ref(true)

const loginForm = ref({
  emailAddress: '',
  password: ''
})

const registerForm = ref({
  firstName: '',
  lastName: '',
  emailAddress: '',
  phoneNumber: '',
  password: '',
  confirmPassword: ''
})

const isValidEmail = (val: string) => {
  const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
  return emailPattern.test(val) || 'Invalid email'
}

const onLogin = async () => {
  try {
    const success = await authStore.login(loginForm.value.emailAddress, loginForm.value.password)
    if (success) {
      $q.notify({
        color: 'positive',
        message: 'Login successful'
      })
      await router.push('/applications')
    } else {
      $q.notify({
        color: 'negative',
        message: 'Invalid credentials'
      })
    }
  } catch (err) {
    console.error('Login failed:', err)
    $q.notify({
      color: 'negative',
      message: 'Login failed'
    })
  }
}

const onRegister = async () => {
  try {
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
      $q.notify({
        color: 'negative',
        message: 'Passwords do not match'
      })
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...userData } = registerForm.value
    const success = await authStore.register(userData)
    if (success) {
      $q.notify({
        color: 'positive',
        message: 'Registration successful'
      })
      await router.push('/')
    }
  } catch (err) {
    console.error('Registration failed:', err)
    $q.notify({
      color: 'negative',
      message: 'Registration failed'
    })
  }
}
</script>

<style lang="scss" scoped>
.auth-card {
  width: 100%;
  max-width: 500px;
  margin: 1rem;
}
</style> 