<template>
  <q-page padding>
    <div class="row justify-between items-center q-mb-md">
      <h4 class="q-mb-none">User Profile</h4>
      <q-btn
        v-if="!isEdit"
        label="Edit"
        color="primary"
        @click="isEdit = true"
        dense
      />
    </div>

    <ProfileForm
      v-if="isEdit"
      :is-edit="isEdit"
      :profile="userStore.user?.profile ?? null"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
    <div v-else>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-h6">Personal Information</div>
              <div class="q-mt-sm">
                <div class="row q-col-gutter-sm">
                  <div class="col-12">
                    <div class="text-subtitle2">First Name</div>
                    <div>{{ userStore.user?.firstName }}</div>
                  </div>
                  <div class="col-12">
                    <div class="text-subtitle2">Last Name</div>
                    <div>{{ userStore.user?.lastName }}</div>
                  </div>
                  <div class="col-12">
                    <div class="text-subtitle2">Email</div>
                    <div>{{ userStore.user?.emailAddress }}</div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-6">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-h6">Search Preferences</div>
              <div class="q-mt-sm">
                <div class="row q-col-gutter-sm">
                  <div class="col-12">
                    <div class="text-subtitle2">Education Level</div>
                    <div>{{ userStore.user?.profile.userPreferences.searchPreferences.educationLevel }}</div>
                  </div>
                  <div class="col-12">
                    <div class="text-subtitle2">Target Types</div>
                    <div>{{ userStore.user?.profile.userPreferences.searchPreferences.targetTypes.join(', ') }}</div>
                  </div>
                  <div class="col-12">
                    <div class="text-subtitle2">Areas of Interest</div>
                    <div>{{ userStore.user?.profile.userPreferences.searchPreferences.areas.join(', ') }}</div>
                  </div>
                  <div class="col-12">
                    <div class="text-subtitle2">Minimum Amount</div>
                    <div>${{ userStore.user?.profile.userPreferences.searchPreferences.minAmount }}</div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
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