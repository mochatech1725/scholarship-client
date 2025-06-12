<template>
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
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useRecommenderStore } from 'src/stores/recommender.store'
import { mockService } from 'src/services/mock.service'
import type { Recommender, Recommendation } from 'src/types'

const props = defineProps<{
  isEdit: boolean
}>()

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const recommenderStore = useRecommenderStore()
const loading = ref(false)

const recommendationId = computed(() => {
  const id = route.params.recommendationId
  return Array.isArray(id) ? id[0] : id
})

const form = ref<Omit<Recommendation, 'created'>>({
  recommendationId: recommendationId.value || '',
  applicationId: '',
  studentId: '', // TODO: Get from auth store
  recommenderId: '',
  dueDate: '',
  status: 'Pending',
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
    if (!recommendationId.value) {
      throw new Error('Recommendation ID is required')
    }
    const recommendation = await mockService.getRecommendation(recommendationId.value)
    if (recommendation) {
      form.value = {
        ...recommendation,
        submissionDate: recommendation.submissionDate || null
      }

      if (form.value.recommenderId) {
        const recommender = recommenders.value.find(r => r.recommenderId === form.value.recommenderId)
        if (recommender) {
          selectedRecommender.value = recommender
        }
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
    if (props.isEdit) {
      if (!recommendationId.value) {
        throw new Error('Recommendation ID is required')
      }
      await mockService.updateRecommendation(recommendationId.value, form.value)
      $q.notify({
        type: 'positive',
        message: 'Recommendation updated successfully'
      })
    } else {
      await mockService.createRecommendation(form.value)
      $q.notify({
        type: 'positive',
        message: 'Recommendation created successfully'
      })
    }
    await router.push({ name: 'applicationsList' })
  } catch (err) {
    console.error('Failed to save recommendation:', err)
    $q.notify({
      type: 'negative',
      message: `Failed to ${props.isEdit ? 'update' : 'create'} recommendation`
    })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadRecommenders()
  if (props.isEdit) {
    await loadRecommendation()
  }
})
</script>

<style scoped>
.max-width-300 {
  max-width: 300px;
}
</style> 