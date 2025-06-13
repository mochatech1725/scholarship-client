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
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useRecommenderStore } from 'src/stores/recommender.store'
import type { Recommender, Recommendation } from 'src/types'

defineProps<{
  isEdit: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', form: Omit<Recommendation, 'created'>): void
  (e: 'cancel'): void
}>()

const route = useRoute()
const $q = useQuasar()
const recommenderStore = useRecommenderStore()

const recommendationId = computed(() => {
  const id = route.params.recommendationId
  return Array.isArray(id) ? id[0] : id
})

const form = ref<Omit<Recommendation, 'created'>>({
  recommendationId: recommendationId.value || '',
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

const onSubmit = () => {
  form.value.recommender = {
    recommenderId: selectedRecommender.value.recommenderId,
    firstName: selectedRecommender.value.firstName,
    lastName: selectedRecommender.value.lastName,
    emailAddress: selectedRecommender.value.emailAddress,
    phoneNumber: selectedRecommender.value.phoneNumber,
    relationship: selectedRecommender.value.relationship,
    created: selectedRecommender.value.created
  }
  form.value.recommenderId = selectedRecommender.value.recommenderId
  emit('submit', form.value)
}

onMounted(async () => {
  await loadRecommenders()
})
</script>

<style scoped>
.max-width-300 {
  max-width: 300px;
}
</style> 