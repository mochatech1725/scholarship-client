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
import { ref, watch } from 'vue'
import type { Profile } from 'src/types'
import { educationLevelOptions, targetTypeOptions, areaOptions } from 'src/types'

const props = defineProps<{ isEdit?: boolean; profile?: Profile | null }>()

const emit = defineEmits<{ (e: 'submit', profile: Profile): void; (e: 'cancel'): void }>()

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
</style> 