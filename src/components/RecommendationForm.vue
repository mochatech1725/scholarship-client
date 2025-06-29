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
              v-model="form.dueDate"
              type="date"
              flat
              dense
              class="q-mb-sm"
            />
          </div>

          <div class="col-12 col-md-6">
            <div class="form-label">Submission Method</div>
            <q-select
              v-model="form.submissionMethod"
              :options="submissionMethodOptions"
              flat
              dense
              class="q-mb-sm"
            />
          </div>

          <div class="col-12 col-md-6">
            <div class="form-label">Request Date</div>
            <q-input
              v-model="form.requestDate"
              type="date"
              flat
              dense
              class="q-mb-md"
            />
          </div>

          <div class="col-12 col-md-6">
            <div class="form-label">Submission Date</div>
            <q-input
              v-model="form.submissionDate"
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
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
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
    studentId: '',
    firstName: '',
    lastName: '',
    emailAddress: '',
    phoneNumber: '',
    relationship: ''
  },
  dueDate: '',
  status: 'Pending',
  submissionMethod: 'DirectEmail',
  requestDate: '',
  submissionDate: null
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
    label: `${recommender.firstName} ${recommender.lastName} (${recommender.emailAddress})`,
    value: `${recommender.firstName} ${recommender.lastName} (${recommender.emailAddress})`
  }))
})

const scholarshipName = computed(() => {
  return props.application?.scholarshipName || ''
})

const submissionMethodOptions = ['DirectEmail', 'StudentUpload', 'DirectMail'] as const

const onRecommenderChange = (selectedValue: string) => {
  const selectedRecommender = props.recommenders.find(r => r._id === selectedValue)
  if (selectedRecommender) {
    form.value.recommender = {
      studentId: selectedRecommender.studentId,
      firstName: selectedRecommender.firstName,
      lastName: selectedRecommender.lastName,
      emailAddress: selectedRecommender.emailAddress,
      phoneNumber: selectedRecommender.phoneNumber,
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

const initializeForm = () => {
  if (props.recommendation) {
    const { recommender } = props.recommendation
    const recommendationData = {
      recommender: recommender,
      dueDate: formatDateForInput(props.recommendation.dueDate),
      status: props.recommendation.status,
      submissionMethod: props.recommendation.submissionMethod,
      requestDate: formatDateForInput(props.recommendation.requestDate),
      submissionDate: props.recommendation.submissionDate ? formatDateForInput(props.recommendation.submissionDate) : null
    }
    
    // Set the selected recommender value for the dropdown
    const selectedValue = `${recommender.firstName} ${recommender.lastName} (${recommender.emailAddress})`
    
    // Store original data first
    originalFormData.value = { ...recommendationData }
    originalSelectedRecommenderId.value = selectedValue
    
    // Then set form data
    form.value = recommendationData
    selectedRecommenderId.value = selectedValue
  } else {
    const defaultData: Recommendation = {
      recommender: {
        studentId: '',
        firstName: '',
        lastName: '',
        emailAddress: '',
        phoneNumber: '',
        relationship: ''
      },
      dueDate: '',
      status: 'Pending' as const,
      submissionMethod: 'DirectEmail' as const,
      requestDate: '',
      submissionDate: null
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
})

onBeforeUnmount(() => {
  // No scholarship context logic to clear
})
</script>

<style scoped>
.q-form {
  max-width: 800px;
  margin: 0 auto;
}
</style> 