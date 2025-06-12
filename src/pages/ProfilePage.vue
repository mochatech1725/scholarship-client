<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="q-pa-md">
          <q-card-section>
            <ProfileForm @submit="onSubmit" @cancel="handleCancel" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useUserStore } from 'stores/user.store'
import type { Profile, SearchPreferences } from 'src/types'
import ProfileForm from 'src/components/ProfileForm.vue'

const router = useRouter()
const $q = useQuasar()
const userStore = useUserStore()

const handleCancel = () => {
  router.back()
}

const onSubmit = async (form: Profile, preferences: SearchPreferences) => {
  try {
    await userStore.updateProfile(form)
    await userStore.updatePreferences(preferences)
    $q.notify({
      color: 'positive',
      message: 'Profile updated successfully'
    })
    await router.push('/')
  } catch (error) {
    console.error('Failed to update profile:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to update profile'
    })
  }
}
</script> 