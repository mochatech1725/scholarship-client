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
              <q-select
                v-model="form.recommenderId"
                :options="recommenders"
                option-label="displayName"
                option-value="recommenderId"
                label="Recommender"
                :rules="rules.recommenderId"
                outlined
                dense
                class="max-width-300"
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.firstName }} {{ scope.opt.lastName }}</q-item-label>
                      <q-item-label caption>{{ scope.opt.emailAddress }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <div class="col-12">
              <q-input
                v-model="form.dueDate"
                label="Due Date"
                type="date"
                :rules="rules.dueDate"
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
                :rules="rules.submissionMethod"
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
                :rules="rules.requestDate"
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
import { ref, onMounted } from 'vue'
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

// Get and validate route parameters
const recommendationId = Array.isArray(route.params.recommendationId) 
  ? route.params.recommendationId[0] 
  : route.params.recommendationId || ''

const scholarshipId = route.params.scholarshipId

if (!scholarshipId || Array.isArray(scholarshipId)) {
  throw new Error('Invalid scholarship ID')
}

const form = ref<Omit<Recommendation, 'created'>>({
  recommendationId: typeof recommendationId === 'string' ? recommendationId : '',
  scholarshipId: scholarshipId,
  studentId: '', // TODO: Get from auth store
  recommenderId: '',
  dueDate: '',
  status: 'Pending',
  submissionMethod: 'DirectEmail',
  requestDate: new Date().toISOString().split('T')[0] || new Date().toISOString().slice(0, 10)
})

const recommenders = ref<Recommender[]>([])
const submissionMethodOptions = ['DirectEmail', 'StudentUpload', 'DirectMail'] as const
type SubmissionMethod = typeof submissionMethodOptions[number]

const rules = {
  recommenderId: [
    (val: string) => !!val || 'Recommender is required'
  ],
  dueDate: [
    (val: string) => !!val || 'Due date is required'
  ],
  submissionMethod: [
    (val: SubmissionMethod) => !!val || 'Submission method is required'
  ],
  requestDate: [
    (val: string) => !!val || 'Request date is required'
  ]
}

const loadRecommenders = async () => {
  try {
    recommenders.value = await recommenderStore.getRecommenders()
  } catch (err) {
    console.error('Failed to load recommenders:', err)
    $q.notify({
      type: 'negative',
      message: 'Failed to load recommenders'
    })
  }
}

const loadRecommendation = async (id: string) => {
  try {
    // TODO: Implement API call to load recommendation
    // For now, using mock data
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
    
    const mockData = {
      '1': {
        recommendationId: '1',
        scholarshipId,
        studentId: '', // TODO: Get from auth store
        recommenderId: '1',
        dueDate: '2024-04-15',
        status: 'Pending',
        submissionMethod: 'DirectEmail' as const,
        requestDate: new Date().toISOString().split('T')[0],
        created: new Date().toISOString()
      }
    }

    const mockRecommendation = mockData[id as keyof typeof mockData]
    if (mockRecommendation) {
      form.value = {
        recommendationId: mockRecommendation.recommendationId,
        scholarshipId: mockRecommendation.scholarshipId,
        studentId: mockRecommendation.studentId,
        recommenderId: mockRecommendation.recommenderId,
        dueDate: mockRecommendation.dueDate,
        status: mockRecommendation.status,
        submissionMethod: mockRecommendation.submissionMethod,
        requestDate: mockRecommendation.requestDate!
      }
    }
  } catch (err) {
    console.error('Failed to load recommendation:', err)
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
    await router.push(`/dashboard/applications/${scholarshipId}`)
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
  if (recommendationId) {
    isEdit.value = true
    await loadRecommendation(recommendationId)
  }
})
</script>

<style scoped>
.max-width-300 {
  max-width: 300px;
}
</style> 