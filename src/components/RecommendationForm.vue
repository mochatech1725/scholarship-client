<template>
  <div style="background-color: #f5f3fa; padding: 16px;">
    <q-card class="q-pa-md" style="background-color: white;">
      <q-card-section>
        <ScholarshipBanner :name="scholarshipName" />
        <q-form @submit="onSubmit" class="q-gutter-md">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-h6">{{ isEdit ? 'Edit' : 'Add' }} Recommendation</div>
            <div>
              <q-btn
                label="Cancel"
                color="grey-7"
                outline
                @click="$emit('cancel')"
                class="q-mr-sm"
                size="md"
              />
              <q-btn
                label="Save"
                type="submit"
                color="primary"
                :loading="loading"
                size="md"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="text-caption q-mb-xs" style="color: var(--q-primary); font-weight: 600;">First Name</div>
              <q-input
                v-model="recommender.firstName"
                outlined
                dense
                readonly
              />
            </div>

            <div class="col-12 col-md-6">
              <div class="text-caption q-mb-xs" style="color: var(--q-primary); font-weight: 600;">Last Name</div>
              <q-input
                v-model="recommender.lastName"
                outlined
                dense
                readonly
              />
            </div>

            <div class="col-12 col-md-6">
              <div class="text-caption q-mb-xs" style="color: var(--q-primary); font-weight: 600;">Email Address</div>
              <q-input
                v-model="recommender.emailAddress"
                outlined
                dense
                readonly
              />
            </div>

            <div class="col-12 col-md-6">
              <div class="text-caption q-mb-xs" style="color: var(--q-primary); font-weight: 600;">Due Date</div>
              <q-input
                v-model="form.dueDate"
                type="date"
                outlined
                dense
              />
            </div>

            <div class="col-12 col-md-6">
              <div class="text-caption q-mb-xs" style="color: var(--q-primary); font-weight: 600;">Submission Method</div>
              <q-select
                v-model="form.submissionMethod"
                :options="submissionMethodOptions"
                outlined
                dense
              />
            </div>

            <div class="col-12 col-md-6">
              <div class="text-caption q-mb-xs" style="color: var(--q-primary); font-weight: 600;">Request Date</div>
              <q-input
                v-model="form.requestDate"
                type="date"
                outlined
                dense
              />
            </div>

            <div class="col-12 col-md-6">
              <div class="text-caption q-mb-xs" style="color: var(--q-primary); font-weight: 600;">Submission Date</div>
              <q-input
                v-model="form.submissionDate"
                type="date"
                outlined
                dense
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import type { Recommendation, Application } from 'src/types'
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

const recommender = computed(() => {
  if (props.recommendation?.recommender) {
    return props.recommendation.recommender
  }
  return form.value.recommender
})

const scholarshipName = computed(() => {
  return props.application?.scholarshipName || ''
})

const submissionMethodOptions = ['DirectEmail', 'StudentUpload', 'DirectMail'] as const

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