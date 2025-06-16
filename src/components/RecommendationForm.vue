<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-input
          v-model="recommender.firstName"
          label="First Name"
          outlined
          dense
          readonly
        />
      </div>

      <div class="col-12 col-md-6">
        <q-input
          v-model="recommender.lastName"
          label="Last Name"
          outlined
          dense
          readonly
        />
      </div>

      <div class="col-12 col-md-6">
        <q-input
          v-model="recommender.emailAddress"
          label="Email Address"
          outlined
          dense
          readonly
        />
      </div>

      <div class="col-12 col-md-6">
        <q-input
          v-model="form.dueDate"
          label="Due Date"
          type="date"
          outlined
          dense
        />
      </div>

      <div class="col-12 col-md-6">
        <q-select
          v-model="form.submissionMethod"
          :options="submissionMethodOptions"
          label="Submission Method"
          outlined
          dense
        />
      </div>

      <div class="col-12 col-md-6">
        <q-input
          v-model="form.requestDate"
          label="Request Date"
          type="date"
          outlined
          dense
        />
      </div>

      <div class="col-12 col-md-6">
        <q-input
          v-model="form.submissionDate"
          label="Submission Date"
          type="date"
          outlined
          dense
        />
      </div>
    </div>

    <div class="row justify-end q-mt-md">
      <q-btn
        label="Cancel"
        color="grey"
        flat
        @click="$emit('cancel')"
        class="q-mr-sm"
      />
      <q-btn
        label="Save"
        type="submit"
        color="primary"
        :loading="loading"
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, defineEmits, defineProps } from 'vue'
import type { Recommendation } from 'src/types'

const props = defineProps<{
  isEdit: boolean
  loading?: boolean
  recommendation: Recommendation | null
}>()

const emit = defineEmits<{
  (e: 'submit', form: Omit<Recommendation, 'created'>): void
  (e: 'cancel'): void
}>()

const form = ref<Omit<Recommendation, 'created'>>({
  recommendationId: '',
  applicationId: '',
  studentId: '', // TODO: Get from auth store
  recommenderId: '',
  recommender: {
    recommenderId: '',
    firstName: '',
    lastName: '',
    emailAddress: '',
    phoneNumber: '',
    relationship: '',
    created: new Date().toISOString()
  },
  dueDate: '',
  status: 'Pending',
  submissionMethod: 'DirectEmail',
  requestDate: new Date().toISOString(),
  submissionDate: null
})

const recommender = computed(() => {
  if (props.recommendation?.recommender) {
    return props.recommendation.recommender
  }
  return form.value.recommender
})

const submissionMethodOptions = ['DirectEmail', 'StudentUpload', 'DirectMail'] as const

const onSubmit = () => {
  // form.value.recommender = {
  //   recommenderId: selectedRecommender.value.recommenderId,
  //   firstName: selectedRecommender.value.firstName,
  //   lastName: selectedRecommender.value.lastName,
  //   emailAddress: selectedRecommender.value.emailAddress,
  //   phoneNumber: selectedRecommender.value.phoneNumber,
  //   relationship: selectedRecommender.value.relationship,
  //   created: selectedRecommender.value.created
  // }
  // form.value.recommenderId = selectedRecommender.value.recommenderId
  
  emit('submit', form.value)
}

const initializeForm = () => {
  if (props.recommendation) {
    form.value = {
      recommendationId: props.recommendation.recommendationId,
      applicationId: props.recommendation.applicationId,
      studentId: props.recommendation.studentId,
      recommenderId: props.recommendation.recommenderId,
      recommender: props.recommendation.recommender,
      dueDate: props.recommendation.dueDate,
      status: props.recommendation.status,
      submissionMethod: props.recommendation.submissionMethod,
      requestDate: props.recommendation.requestDate,
      submissionDate: props.recommendation.submissionDate
    }
  }
}

onMounted(() => {
  initializeForm()
})
</script>

<style scoped>
.q-form {
  max-width: 800px;
  margin: 0 auto;
}
</style> 