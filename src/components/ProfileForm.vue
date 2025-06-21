<template>
  <q-card class="q-pa-md profile-form-card" style="background-color: white;">
    <q-card-section>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="form-label">Education Level</div>
            <q-select
              v-model="form.userPreferences.searchPreferences.educationLevel"
              :options="educationLevelOptions"
              flat
              dense
              class="q-mb-md"
            />
          </div>
          <div class="col-12 col-md-6">
            <div class="form-label">Target Types</div>
            <q-select
              v-model="form.userPreferences.searchPreferences.targetTypes"
              :options="targetTypeOptions"
              multiple
              flat
              dense
              class="q-mb-md"
            />
          </div>
          <div class="col-12 col-md-6">
            <div class="form-label">Areas of Interest</div>
            <q-select
              v-model="form.userPreferences.searchPreferences.areas"
              :options="areaOptions"
              multiple
              flat
              dense
              class="q-mb-md"
            />
          </div>
          <div class="col-12 col-md-6">
            <div class="form-label">Minimum Amount</div>
            <q-input
              v-model.number="form.userPreferences.searchPreferences.minAmount"
              type="number"
              flat
              dense
              class="q-mb-md"
            />
          </div>
        </div>

        <div class="row justify-end q-mt-md">
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
            :style="{ backgroundColor: 'var(--q-button-primary)', color: 'white' }"
            dense
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Profile } from 'src/types'
import { educationLevelOptions, targetTypeOptions, areaOptions } from 'src/types'

const props = defineProps<{ isEdit?: boolean; profile?: Profile | null }>()

const emit = defineEmits<{ (e: 'submit', profile: Profile): void; (e: 'cancel'): void }>()

const form = ref<Profile>({
  userPreferences: {
    searchPreferences: {
      educationLevel: 'College Freshman',
      targetTypes: [],
      areas: [],
      minAmount: 0
    }
  }
})

watch(
  () => [!!props.profile, props.profile],
  ([hasProfile, newProfile]) => {
    if (hasProfile && newProfile) {
      form.value = JSON.parse(JSON.stringify(newProfile))
    }
  },
  { immediate: true }
)

const onSubmit = () => {
  emit('submit', form.value)
}
</script>

<style scoped>
.q-form {
  max-width: 800px;
  margin: 0 auto;
}

.profile-form-card {
  max-width: 500px;
  margin: 0 auto;
}
</style> 