<template>
  <q-page padding>
    <ProfileForm
      :is-edit="isEdit"
      :profile="userStore.user?.profile ?? null"
      :user="userStore.user"
      @submit="handleSubmit"
      @cancel="handleCancel"
      @edit="isEdit = true"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import ProfileForm from 'src/components/ProfileForm.vue'
import { useUserStore } from 'src/stores/user.store'
import { useAuthStore } from 'src/stores/auth.store'
import type { Profile } from 'src/types'

const $q = useQuasar()
const userStore = useUserStore()
const authStore = useAuthStore()
const isEdit = ref(false)

const handleSubmit = async (profile: Profile) => {
  try {
    await userStore.updateProfile(profile)
    $q.notify({
      type: 'positive',
      message: 'Profile updated successfully'
    })
    isEdit.value = false
  } catch (error) {
    console.error('Failed to update profile:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to update profile'
    })
  }
}

const handleCancel = () => {
  isEdit.value = false
}

onMounted(async () => {
  try {
    if (!authStore.isInitialized) {
      await authStore.initialize()
    }
    await userStore.loadUser()
  } catch (error) {
    console.error('Failed to load user:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to load user'
    })
  }
})
</script>

<style scoped>
.profile-cards-container {
  max-width: 600px;
  margin: 0 auto;
}
</style> 