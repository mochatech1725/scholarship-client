<template>
  <q-card class="q-pa-md" style="background-color: white;">
    <q-card-section>
      <ScholarshipBanner :name="scholarshipName" />
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div class="row items-center justify-between q-mb-md">
          <div class="text-h6">{{ isEdit ? 'Editing' : 'Adding' }} Recommendation</div>
          <div class="row items-center">
            <div v-if="isFormDirty" class="text-caption text-orange q-mr-md">
              <q-icon name="warning" size="sm" class="q-mr-xs" />
              Unsaved changes
            </div>
            <q-btn
              label="Cancel"
              color="grey-6"
              flat
              @click="handleCancel"
              class="q-mr-sm"
              size="md"
            />
            <q-btn
              label="Save"
              type="submit"
              :style="{ backgroundColor: 'var(--q-button-primary)', color: 'white' }"
              :loading="loading"
              size="md"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12">
            <div class="form-label">Recommender</div>
            <q-select
              v-model="selectedRecommenderId"
              :options="recommenderOptions"
              option-label="label"
              option-value="value"
              flat
              dense
              class="q-mb-md"
              :rules="[val => !!val || 'Recommender is required']"
              @update:model-value="onRecommenderChange"
            />
          </div>

          <div class="col-12 col-md-6">
            <div class="form-label">Due Date</div>
            <q-input
              v-model="form.due_date"
              type="date"
              flat
              dense
              class="q-mb-sm"
            />
          </div>

          <div class="col-12 col-md-6">
            <div class="form-label">Submission Method</div>
            <q-select
              v-model="form.submission_method"
              :options="submissionMethodOptions"
              flat
              dense
              class="q-mb-sm"
            />
          </div>

          <div class="col-12 col-md-6">
            <div class="form-label">Request Date</div>
            <q-input
              v-model="form.request_date"
              type="date"
              flat
              dense
              class="q-mb-md"
            />
          </div>

          <div class="col-12 col-md-6">
            <div class="form-label">Submission Date</div>
            <q-input
              v-model="form.submission_date"
              type="date"
              flat
              dense
              class="q-mb-sm"
            />
          </div>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import type { Recommendation, Application, Recommender } from 'src/types'
import { formatDateForInput } from 'src/utils/helper'
import ScholarshipBanner from 'components/ScholarshipBanner.vue'

const $q = useQuasar()

const props = defineProps<{
  isEdit: boolean
  loading?: boolean
  recommendation: Recommendation | null
  application?: Application | null
  recommenders: Recommender[]
}>()

const emit = defineEmits<{
  (e: 'submit', form: Recommendation): void
  (e: 'cancel'): void
}>()

const selectedRecommenderId = ref<string | null>(null)

const form = ref<Recommendation>({
  recommender: {
    student_id: '',
    first_name: '',
    last_name: '',
    email_address: '',
    phone_number: '',
    relationship: ''
  },
  due_date: '',
  status: 'Pending',
  submission_method: 'DirectEmail',
  request_date: '',
  submission_date: null
})

const originalFormData = ref<Recommendation | null>(null)
const originalSelectedRecommenderId = ref<string | null>(null)
const isInitialized = ref(false)

// Track if form is dirty (has been modified)
const isFormDirty = computed(() => {
  if (!originalFormData.value || !isInitialized.value) return false
  
  // Deep comparison of form data
  const current = JSON.stringify(form.value)
  const original = JSON.stringify(originalFormData.value)
  const currentSelected = selectedRecommenderId.value
  const originalSelected = originalSelectedRecommenderId.value
  
  return current !== original || currentSelected !== originalSelected
})

const recommenderOptions = computed(() => {
  return props.recommenders.map(recommender => ({
    label: `${recommender.first_name} ${recommender.last_name} (${recommender.email_address})`,
    value: `${recommender.first_name} ${recommender.last_name} (${recommender.email_address})`
  }))
})

const scholarshipName = computed(() => {
  return props.application?.scholarship_name || ''
})

const submissionMethodOptions = ['DirectEmail', 'StudentUpload', 'DirectMail'] as const

const onRecommenderChange = (selectedValue: string) => {
  const selectedRecommender = props.recommenders.find(r => r.recommender_id === selectedValue)
  if (selectedRecommender) {
    form.value.recommender = {
      student_id: selectedRecommender.student_id,
      first_name: selectedRecommender.first_name,
      last_name: selectedRecommender.last_name,
      email_address: selectedRecommender.email_address,
      phone_number: selectedRecommender.phone_number,
      relationship: selectedRecommender.relationship
    }
  }
}

const handleCancel = () => {
  if (isFormDirty.value) {
    $q.dialog({
      title: 'Unsaved Changes',
      message: 'You have unsaved changes. Are you sure you want to cancel?',
      cancel: true,
      persistent: true,
      ok: {
        label: 'Discard Changes',
        color: 'negative'
      }
    }).onOk(() => {
      emit('cancel')
    })
  } else {
    emit('cancel')
  }
}

const onSubmit = () => {
  // Reset dirty state after successful submission
  originalFormData.value = { ...form.value }
  originalSelectedRecommenderId.value = selectedRecommenderId.value
  emit('submit', form.value)
}

// Handle ESC key press
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.preventDefault()
    handleCancel()
  }
}

const initializeForm = () => {
  if (props.recommendation) {
    const { recommender } = props.recommendation
    const recommendationData = {
      recommender: recommender,
      due_date: formatDateForInput(props.recommendation.due_date),
      status: props.recommendation.status,
      submission_method: props.recommendation.submission_method,
      request_date: formatDateForInput(props.recommendation.request_date),
      submission_date: props.recommendation.submission_date ? formatDateForInput(props.recommendation.submission_date) : null
    }
    
    // Set the selected recommender value for the dropdown
    const selectedValue = `${recommender.first_name} ${recommender.last_name} (${recommender.email_address})`
    
    // Store original data first
    originalFormData.value = { ...recommendationData }
    originalSelectedRecommenderId.value = selectedValue
    
    // Then set form data
    form.value = recommendationData
    selectedRecommenderId.value = selectedValue
  } else {
    const defaultData: Recommendation = {
      recommender: {
        student_id: '',
        first_name: '',
        last_name: '',
        email_address: '',
        phone_number: '',
        relationship: ''
      },
      due_date: '',
      status: 'Pending' as const,
      submission_method: 'DirectEmail' as const,
      request_date: '',
      submission_date: null
    }
    
    // Store original data first
    originalFormData.value = { ...defaultData }
    originalSelectedRecommenderId.value = selectedRecommenderId.value
    
    // Then set form data
    form.value = defaultData
  }
  isInitialized.value = true
}

onMounted(() => {
  initializeForm()
  
  // Add ESC key listener
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  // No scholarship context logic to clear
})

onUnmounted(() => {
  // Remove ESC key listener
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.q-form {
  max-width: 800px;
  margin: 0 auto;
}
</style> 