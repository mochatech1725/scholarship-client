<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-md-6">
        <q-input
          v-model="form.scholarshipName"
          label="Scholarship Name"
          :rules="rules.scholarshipName"
          outlined
          dense
        />
      </div>

      <div class="col-12 col-md-6">
        <q-select
          v-model="form.targetType"
          :options="targetTypeOptions"
          label="Target Type"
          :rules="rules.targetType"
          outlined
          dense
        />
      </div>

      <div class="col-12 col-md-6">
        <q-input
          v-model="form.company"
          label="Company"
          :rules="rules.company"
          outlined
          dense
        />
      </div>

      <div class="col-12 col-md-6">
        <q-input
          v-model="form.companyWebsite"
          label="Company Website"
          :rules="rules.companyWebsite"
          outlined
          dense
        />
      </div>

      <div class="col-12 col-md-6">
        <q-input
          v-model="form.platform"
          label="Platform"
          outlined
          dense
        />
      </div>

      <div class="col-12 col-md-6">
        <q-input
          v-model="form.applicationLink"
          label="Application Link"
          :rules="rules.applicationLink"
          outlined
          dense
        />
      </div>

      <div class="col-12 col-md-6">
        <q-input
          v-model.number="form.amount"
          label="Amount"
          type="number"
          :rules="rules.amount"
          outlined
          dense
        />
      </div>

      <div class="col-12 col-md-6">
        <q-checkbox
          v-model="form.renewable"
          label="Renewable"
        />
      </div>

      <div class="col-12 col-md-6">
        <q-input
          v-model="form.theme"
          label="Theme"
          outlined
          dense
        />
      </div>
      
      <div class="col-12 col-md-6">
        <q-input
          v-model="form.requirements"
          label="Requirements"
          outlined
          dense
        />
      </div>

      <div class="col-12 col-md-6">
        <q-input
          v-model="form.documentInfoLink"
          label="Document Info Link"
          outlined
          dense
        />
      </div>

      <div class="col-12 col-md-6">
        <q-input
          v-model="form.currentAction"
          label="Current Action"
          outlined
          dense
        />
      </div>

      <div class="col-12 col-md-6">
        <q-select
          v-model="form.status"
          :options="statusOptions"
          label="Status"
          :rules="rules.status"
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

      <div class="col-12 col-md-6">
        <q-input
          v-model="form.openDate"
          label="Open Date"
          type="date"
          outlined
          dense
        />
      </div>

      <div class="col-12 col-md-6">
        <q-input
          v-model="form.dueDate"
          label="Due Date"
          type="date"
          :rules="rules.dueDate"
          outlined
          dense
        />
      </div>
    </div>

    <!-- Essays Section -->
    <Essays :application-id="form.applicationId" />

    <!-- Recommendations Section -->
    <Recommendations :application-id="form.applicationId" />

    <div class="row justify-end q-mt-md">
      <q-btn
        type="submit"
        color="primary"
        :label="isEdit ? 'Update Application' : 'Create Application'"
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useApplicationStore } from 'stores/application.store'
import { useScholarshipContextStore } from 'stores/scholarship-context.store'
import type { Application } from 'src/types'
import { targetTypeOptions, statusOptions } from 'src/types'
import Essays from 'components/Essays.vue'
import Recommendations from 'components/Recommendations.vue'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const applicationStore = useApplicationStore()
const scholarshipContextStore = useScholarshipContextStore()
const loading = ref(false)
const isEdit = ref(false)

const form = ref<Omit<Application, 'created'>>({
  applicationId: route.params.applicationId as string || crypto.randomUUID(),
  studentId: '', // TODO: Get from auth store
  scholarshipName: '',
  targetType: 'Merit',
  company: '',
  companyWebsite: '',
  platform: '',
  applicationLink: '',
  theme: '',
  amount: 0,
  requirements: '',
  renewable: false,
  documentInfoLink: '',
  currentAction: '',
  status: 'Not Started',
  submissionDate: '',
  openDate: '',
  dueDate: '',
  essays: [],
  recommendations: []
})

const rules = {
  scholarshipName: [
    (val: string) => !!val || 'Scholarship name is required'
  ],
  targetType: [
    (val: string) => !!val || 'Target type is required',
    (val: string) => ['Merit', 'Need', 'Both'].includes(val) || 'Target type must be Merit, Need, or Both'
  ],
  company: [
    (val: string) => !!val || 'Company name is required'
  ],
  companyWebsite: [
    (val: string) => !!val || 'Company website is required',
    (val: string) => /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(val) || 'Please enter a valid website URL'
  ],
  applicationLink: [
    (val: string) => !!val || 'Application link is required',
    (val: string) => /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(val) || 'Please enter a valid URL'
  ],
  amount: [
    (val: number) => !isNaN(val) || 'Amount must be a number',
    (val: number) => val >= 0 || 'Amount must be a positive number'
  ],
  status: [
    (val: string) => !!val || 'Status is required'
  ],
  dueDate: [
    (val: string) => !!val || 'Due date is required'
  ]
}

const loadApplication = async () => {
  try {
    const application = await applicationStore.getApplication(route.params.applicationId as string)
    if (application) {
      form.value = {
        ...application
      }
    }
  } catch (error) {
    console.error('Error loading application:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to load application'
    })
  }
}

const onSubmit = async () => {
  try {
    loading.value = true
    if (isEdit.value) {
      const id = route.params.applicationId as string
      await applicationStore.updateApplication(id, form.value)
      $q.notify({
        type: 'positive',
        message: 'Application updated successfully'
      })
    } else {
      const newApplication: Application = {
        ...form.value,
        created: new Date().toISOString()
      }
      await applicationStore.createApplication(newApplication)
      $q.notify({
        type: 'positive',
        message: 'Application created successfully'
      })
    }
    await router.push({ name: 'applicationsList' })
  } catch (err) {
    console.error('Failed to save application:', err)
    $q.notify({
      type: 'negative',
      message: `Failed to ${isEdit.value ? 'update' : 'create'} application`
    })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (route.params.applicationId) {
    isEdit.value = true
    await loadApplication()
    scholarshipContextStore.setCurrentScholarshipName(form.value.scholarshipName)
  }
})

onBeforeUnmount(() => {
  scholarshipContextStore.clearCurrentScholarshipName()
})
</script> 