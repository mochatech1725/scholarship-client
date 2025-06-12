<template>
  <q-form @submit="onSubmit" class="q-gutter-sm">
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-md-6">
        <q-select
          v-model="form.userPreferences.searchPreferences.educationLevel"
          :options="educationLevelOptions"
          label="Education Level"
          outlined
          dense
        />
      </div>
      <div class="col-12 col-md-6">
        <q-select
          v-model="form.userPreferences.searchPreferences.targetTypes"
          :options="targetTypeOptions"
          label="Target Types"
          multiple
          outlined
          dense
        />
      </div>
      <div class="col-12 col-md-6">
        <q-select
          v-model="form.userPreferences.searchPreferences.areas"
          :options="areaOptions"
          label="Areas of Interest"
          multiple
          outlined
          dense
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model.number="form.userPreferences.searchPreferences.minAmount"
          label="Minimum Amount"
          type="number"
          outlined
          dense
        />
      </div>
    </div>

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
import type { Profile } from 'src/types'
import { useUserStore } from 'src/stores/user.store'
import { useAuthStore } from 'src/stores/auth.store'
import { educationLevelOptions, targetTypeOptions, areaOptions } from 'src/types'

defineProps<{
  isEdit?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', form: Profile): void
  (e: 'cancel'): void
}>()

const userStore = useUserStore()
const authStore = useAuthStore()
const form = ref<Profile>({
  userId: '',
  userPreferences: {
    searchPreferences: {
      educationLevel: 'College Freshman',
      targetTypes: [],
      areas: [],
      minAmount: 0
    }
  }
})

const onSubmit = () => {
  emit('submit', form.value)
}

onMounted(async () => {
  try {
    if (!authStore.isInitialized) {
      await authStore.initialize()
    }
    const user = authStore.user
    if (user) {
      form.value.userId = user.userId
    }
    const profile = await userStore.loadProfile()
    if (profile) {
      form.value = profile
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