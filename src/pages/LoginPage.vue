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
            class="q-px-md"
          />

          <q-input
            v-model="loginForm.password"
            label="Password"
            :type="isLoginPasswordVisible ? 'text' : 'password'"
            :rules="[val => !!val || 'Password is required']"
            class="q-px-md"
          >
            <template v-slot:append>
              <q-icon
                :name="isLoginPasswordVisible ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isLoginPasswordVisible = !isLoginPasswordVisible"
              />
            </template>
          </q-input>

          <div>
            <q-btn
              label="Login"
              type="submit"
              color="primary"
              class="full-width q-mx-md"
            />
          </div>
        </q-form>
      </q-card-section>

      <!-- Register Form -->
      <q-card-section v-else>
        <q-form @submit="onRegister" class="q-gutter-md">
          <div class="row q-col-gutter-md q-px-md">
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
            class="q-px-md"
          />

          <q-input
            v-model="registerForm.phoneNumber"
            label="Phone Number (Optional)"
            mask="(###) ###-####"
            class="q-px-md"
          />

          <q-input
            v-model="registerForm.password"
            label="Password"
            :type="isRegisterPasswordVisible ? 'text' : 'password'"
            :rules="[
              val => !!val || 'Password is required',
              val => val.length >= 8 || 'Password must be at least 8 characters'
            ]"
            class="q-px-md"
          >
            <template v-slot:append>
              <q-icon
                :name="isRegisterPasswordVisible ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isRegisterPasswordVisible = !isRegisterPasswordVisible"
              />
            </template>
          </q-input>

          <q-input
            v-model="registerForm.confirmPassword"
            label="Confirm Password"
            :type="isConfirmPasswordVisible ? 'text' : 'password'"
            :rules="[
              val => !!val || 'Please confirm your password',
              val => val === registerForm.password || 'Passwords do not match'
            ]"
            class="q-px-md"
          >
            <template v-slot:append>
              <q-icon
                :name="isConfirmPasswordVisible ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isConfirmPasswordVisible = !isConfirmPasswordVisible"
              />
            </template>
          </q-input>

          <div>
            <q-btn
              label="Register"
              type="submit"
              color="primary"
              class="full-width q-mx-md"
            />
          </div>

          <div class="text-center q-mt-sm q-px-md">
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

const router = useRouter()
const authStore = useAuthStore()
const $q = useQuasar()

const isLogin = ref(true)
const isLoginPasswordVisible = ref(false)
const isRegisterPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)

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

    const success = await authStore.register({
      firstName: registerForm.value.firstName,
      lastName: registerForm.value.lastName,
      emailAddress: registerForm.value.emailAddress,
      phoneNumber: registerForm.value.phoneNumber
    })

    if (success) {
      $q.notify({
        color: 'positive',
        message: 'Registration successful'
      })
      await router.push('/applications')
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
      message: 'An error occurred during registration'
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