<template>
  <q-page class="flex flex-center">
    <q-card class="register-card">
      <q-card-section>
        <div class="text-h6">Create Account</div>
      </q-card-section>

      <q-card-section>
        <div class="text-center q-mb-md">
          <q-btn
            color="primary"
            label="Sign Up with Auth0"
            @click="onSignUp"
            class="full-width"
          />
        </div>

        <div class="text-center q-mt-sm">
          <router-link to="/login" class="text-primary">Already have an account? Login</router-link>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useAuth0 } from '@auth0/auth0-vue'

const $q = useQuasar()
const auth0 = useAuth0()

const onSignUp = () => {
  try {
    void auth0.loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup'
      }
    })
  } catch (err) {
    console.error('Sign up failed:', err)
    $q.notify({
      color: 'negative',
      message: 'Sign up failed'
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