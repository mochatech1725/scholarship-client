<template>
  <q-card class="q-pa-md" style="background-color: white;">
    <q-card-section>
      <ScholarshipBanner :name="scholarshipName" />
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div class="row items-center justify-between q-mb-md">
          <div class="text-h6">{{ isEdit ? 'Editing' : 'Adding' }} Recommendation</div>
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
              class="q-mb-md"
            />
          </div>

          <div class="col-12 col-md-6">
            <div class="form-label">Submission Method</div>
            <q-select
              v-model="form.submissionMethod"
              :options="submissionMethodOptions"
              flat
              dense
              class="q-mb-md"
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
              class="q-mb-md"
            />
          </div>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import type { Recommendation, Application, Recommender } from 'src/types'
import ScholarshipBanner from 'components/ScholarshipBanner.vue'

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

const recommenderOptions = computed(() => {
  return props.recommenders.map(recommender => ({
    label: `${recommender.firstName} ${recommender.lastName} (${recommender.emailAddress})`,
    value: recommender._id
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

const onSubmit = () => {
  emit('submit', form.value)
}

const initializeForm = () => {
  if (props.recommendation) {
    const { recommender } = props.recommendation
    form.value = {
      ...props.recommendation
    }
    
    const matchingRecommender = props.recommenders.find(r => 
      r._id === recommender._id
    )
    
    if (matchingRecommender) {
      selectedRecommenderId.value = matchingRecommender._id || null
    } else if (recommender._id) {
      // Fallback: if the recommender has an _id, use it directly
      selectedRecommenderId.value = recommender._id
    } else {
      // If no match found and no _id, set to null
      selectedRecommenderId.value = null
    }
  }
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