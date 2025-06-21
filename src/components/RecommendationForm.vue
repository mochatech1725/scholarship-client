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
import { useRecommenderStore } from 'src/stores/recommender.store'
import type { Recommendation, Application, Recommender } from 'src/types'
import ScholarshipBanner from 'components/ScholarshipBanner.vue'

const props = defineProps<{
  isEdit: boolean
  loading?: boolean
  recommendation: Recommendation | null
  application?: Application | null
}>()

const emit = defineEmits<{
  (e: 'submit', form: Recommendation): void
  (e: 'cancel'): void
}>()

const recommenderStore = useRecommenderStore()
const recommenders = ref<Recommender[]>([])
const selectedRecommenderId = ref<string | null>(null)

const form = ref<Recommendation>({
  recommender: {
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
  return recommenders.value.map(recommender => ({
    label: `${recommender.firstName} ${recommender.lastName} (${recommender.emailAddress})`,
    value: `${recommender.firstName} ${recommender.lastName} (${recommender.emailAddress})`
  }))
})

const scholarshipName = computed(() => {
  return props.application?.scholarshipName || ''
})

const submissionMethodOptions = ['DirectEmail', 'StudentUpload', 'DirectMail'] as const

const loadRecommenders = async () => {
  try {
    recommenders.value = await recommenderStore.getRecommenders()
  } catch (error) {
    console.error('Failed to load recommenders:', error)
  }
}

const onRecommenderChange = (selectedValue: string) => {
  const selectedRecommender = recommenders.value.find(r => 
    `${r.firstName} ${r.lastName} (${r.emailAddress})` === selectedValue
  )
  if (selectedRecommender) {
    form.value.recommender = {
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
    form.value = {
      recommender: props.recommendation.recommender,
      dueDate: props.recommendation.dueDate,
      status: props.recommendation.status,
      submissionMethod: props.recommendation.submissionMethod,
      requestDate: props.recommendation.requestDate,
      submissionDate: props.recommendation.submissionDate
    }
    
    // Set the selected recommender value for the dropdown
    const matchingRecommender = recommenders.value.find(r => 
      r.firstName === props.recommendation?.recommender.firstName &&
      r.lastName === props.recommendation?.recommender.lastName &&
      r.emailAddress === props.recommendation?.recommender.emailAddress
    )
    if (matchingRecommender) {
      selectedRecommenderId.value = `${matchingRecommender.firstName} ${matchingRecommender.lastName} (${matchingRecommender.emailAddress})`
    }
  }
}

onMounted(async () => {
  await loadRecommenders()
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