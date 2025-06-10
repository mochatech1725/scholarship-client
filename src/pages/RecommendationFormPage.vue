<template>
  <q-page class="q-pa-lg">
    <div class="row q-mb-md items-center justify-between">
      <div class="text-h5">{{ isEdit ? 'Edit Recommendation' : 'New Recommendation' }}</div>
      <q-btn
        flat
        color="primary"
        icon="arrow_back"
        label="Back"
        to="/dashboard/applications"
      />
    </div>

    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <q-form @submit="onSubmit" class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                v-model="selectedRecommender.firstName"
                label="First Name"
                outlined
                dense
                readonly
                class="max-width-300"
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="selectedRecommender.lastName"
                label="Last Name"
                outlined
                dense
                readonly
                class="max-width-300"
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="selectedRecommender.emailAddress"
                label="Email Address"
                outlined
                dense
                readonly
                class="max-width-300"
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="form.dueDate"
                label="Due Date"
                type="date"
                outlined
                dense
                class="max-width-300"
              />
            </div>

            <div class="col-12">
              <q-select
                v-model="form.submissionMethod"
                :options="submissionMethodOptions"
                label="Submission Method"
                outlined
                dense
                class="max-width-300"
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="form.requestDate"
                label="Request Date"
                type="date"
                outlined
                dense
                class="max-width-300"
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="form.submissionDate"
                label="Submission Date"
                type="date"
                outlined
                dense
                class="max-width-300"
              />
            </div>
          </div>

          <div class="row justify-end q-mt-lg">
            <q-btn
              label="Cancel"
              color="grey"
              flat
              to="/dashboard/applications"
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
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useRecommenderStore } from 'src/stores/recommender.store'
import type { Recommender, Recommendation } from 'src/types'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const recommenderStore = useRecommenderStore()
const loading = ref(false)

const isEdit = ref(false)

const recommendationId = computed(() => {
  const id = route.params.recommendationId
  return Array.isArray(id) ? id[0] : id
})

const form = ref<Omit<Recommendation, 'created'>>({
  recommendationId: typeof recommendationId.value === 'string' ? recommendationId.value : '',
  applicationId: '',
  studentId: '', // TODO: Get from auth store
  recommenderId: '',
  dueDate: '',
  status: 'pending',
  submissionMethod: 'DirectEmail',
  requestDate: new Date().toISOString(),
  submissionDate: null
})

const recommenders = ref<Recommender[]>([])
const submissionMethodOptions = ['DirectEmail', 'StudentUpload', 'DirectMail'] as const

const selectedRecommender = ref<Recommender>({
  recommenderId: '',
  firstName: '',
  lastName: '',
  emailAddress: '',
  phoneNumber: '',
  relationship: '',
  created: new Date().toISOString()
})

const loadRecommenders = async () => {
  try {
    recommenders.value = await recommenderStore.getRecommenders()
    if (form.value.recommenderId) {
      const recommender = recommenders.value.find(r => r.recommenderId === form.value.recommenderId)
      if (recommender) {
        selectedRecommender.value = recommender
      }
    }
  } catch (err) {
    console.error('Failed to load recommenders:', err)
    $q.notify({
      type: 'negative',
      message: 'Failed to load recommenders'
    })
  }
}

const loadRecommendation = async () => {
  try {
    // TODO: Implement API call
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay

    const mockRecommendation: Omit<Recommendation, 'created'> = {
      recommendationId: recommendationId.value || '',
      applicationId: form.value.applicationId,
      studentId: 'student-1',
      recommenderId: 'rec-1',
      dueDate: '2024-04-01',
      status: 'pending',
      submissionMethod: 'DirectEmail',
      requestDate: '2024-03-01',
      submissionDate: null
    }

    if (mockRecommendation) {
      form.value = {
        ...mockRecommendation,
        submissionDate: null
      }
    }
  } catch (error) {
    console.error('Error loading recommendation:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to load recommendation'
    })
  }
}

const onSubmit = async () => {
  try {
    loading.value = true
    if (isEdit.value) {
      //const id = route.params.id as string
      // TODO: Implement API call to update recommendation
      $q.notify({
        type: 'positive',
        message: 'Recommendation updated successfully'
      })
    } else {
      // TODO: Implement API call to create recommendation
      $q.notify({
        type: 'positive',
        message: 'Recommendation created successfully'
      })
    }
    await router.push(`/dashboard/applications`)
  } catch (err) {
    console.error('Failed to save recommendation:', err)
    $q.notify({
      type: 'negative',
      message: `Failed to ${isEdit.value ? 'update' : 'create'} recommendation`
    })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadRecommenders()
  if (recommendationId.value) {
    isEdit.value = true
    await loadRecommendation()
  }
})
</script>

<style scoped>
.max-width-300 {
  max-width: 300px;
}
</style> 