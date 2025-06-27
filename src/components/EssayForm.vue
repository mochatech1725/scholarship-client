<template>
  <q-card class="q-pa-md" style="background-color: white;">
    <q-card-section>
      <ScholarshipBanner :name="scholarshipName" />
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div class="row items-center justify-between q-mb-md">
          <div class="text-h6">{{ props.essay ? 'Editing' : 'Adding' }} Essay</div>
          <div>
            <q-btn
              label="Cancel"
              color="grey-6"
              flat
              @click="$emit('cancel')"
              class="q-mr-sm"
              size="md"
            />
            <q-btn
              :label="props.essay ? 'Update' : 'Create'"
              type="submit"
              :style="{ backgroundColor: 'var(--q-button-primary)', color: 'white' }"
              size="md"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="form-label">Theme</div>
            <q-input
              v-model="form.theme"
              :rules="[val => !!val || 'Theme is required']"
              flat
              dense
              hide-bottom-space
              class="q-mb-sm"
            />
          </div>
          <div class="col-12 col-md-6">
            <div class="form-label">Units</div>
            <q-select
              v-model="form.units"
              :options="unitOptions"
              flat
              dense
              class="q-mb-sm"
            />
          </div>
          <div class="col-12">
            <div class="form-label">Essay Link</div>
            <q-input
              v-model="form.essayLink"
              :rules="[val => !!val || 'Essay link is required']"
              flat
              dense
              hide-bottom-space
              class="q-mb-sm"
            />
          </div>
          <div class="col-12">
            <div class="form-label">Count</div>
            <q-input
              v-model.number="form.count"
              type="number"
              :rules="[val => !!val || 'Count is required']"
              flat
              dense
              hide-bottom-space
              class="q-mb-sm"
            />
          </div>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Essay, Application } from 'src/types'
import ScholarshipBanner from 'components/ScholarshipBanner.vue'

const props = defineProps<{
  application?: Application | null
  essay?: Essay | null
}>()

const emit = defineEmits<{
  (e: 'submit', form: Essay): void
  (e: 'cancel'): void
}>()

const scholarshipName = computed(() => {
  return props.application?.scholarshipName || ''
})

const unitOptions = ['words', 'characters', 'pages', 'sentences']

const form = ref<Essay>({
  essayLink: '',
  count: 0,
  units: '',
  theme: ''
})

const initializeForm = () => {
  if (props.essay) {
    form.value = {
      essayLink: props.essay.essayLink,
      count: props.essay.count,
      units: props.essay.units,
      theme: props.essay.theme
    }
  }
}

onMounted(() => {
  initializeForm()
})

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