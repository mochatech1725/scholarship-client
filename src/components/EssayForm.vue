<template>
  <ScholarshipBanner :name="scholarshipName" />
  <q-form @submit="onSubmit" class="q-gutter-sm">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6">{{ props.essay ? 'Edit' : 'Add' }} Essay</div>
      <div>
        <q-btn
          label="Cancel"
          color="grey"
          flat
          class="q-mr-sm"
          @click="$emit('cancel')"
          dense
        />
        <q-btn
          :label="props.essay ? 'Update' : 'Create'"
          type="submit"
          color="primary"
          dense
        />
      </div>
    </div>

    <div class="row q-col-gutter-sm">
      <div class="col-12 col-md-6">
        <q-input
          v-model="form.theme"
          label="Theme"
          :rules="[val => !!val || 'Theme is required']"
          outlined
          dense
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="form.units"
          label="Units"
          :rules="[val => !!val || 'Units is required']"
          outlined
          dense
        />
      </div>
      <div class="col-12">
        <q-input
          v-model="form.essayLink"
          label="Essay Link"
          :rules="[val => !!val || 'Essay link is required']"
          outlined
          dense
        />
      </div>
      <div class="col-12">
        <q-input
          v-model.number="form.count"
          label="Count"
          type="number"
          :rules="[val => !!val || 'Count is required']"
          outlined
          dense
        />
      </div>
    </div>
  </q-form>
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
  (e: 'submit', form: Omit<Essay, 'essayId' | 'created'>): void
  (e: 'cancel'): void
}>()

const scholarshipName = computed(() => {
  return props.application?.scholarshipName || ''
})

const form = ref<Omit<Essay, 'essayId' | 'created'>>({
  applicationId: '',
  studentId: '',
  essayLink: '',
  count: 0,
  units: '',
  theme: ''
})

const initializeForm = () => {
  if (props.application) {
    form.value.applicationId = props.application.applicationId
    form.value.studentId = props.application.studentId
  }
  
  if (props.essay) {
    form.value = {
      applicationId: props.essay.applicationId,
      studentId: props.essay.studentId,
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