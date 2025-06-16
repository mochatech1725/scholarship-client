<template>
  <ScholarshipBanner :name="scholarshipName" />
  <q-form @submit="onSubmit" class="q-gutter-md">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6">{{ isEdit ? 'Edit' : 'Add' }} Application</div>
      <div>
        <q-btn
          label="Cancel"
          color="grey"
          flat
          @click="$emit('cancel')"
          class="q-mr-sm"
        />
        <q-btn
          type="submit"
          color="primary"
          :label="isEdit ? 'Update Application' : 'Create Application'"
        />
      </div>
    </div>

    <q-tabs
      v-model="activeTab"
      class="text-primary"
      active-color="primary"
      indicator-color="primary"
      align="left"
      narrow-indicator
    >
      <q-tab name="general" label="General" />
      <q-tab name="essays" label="Essays" />
      <q-tab name="recommendations" label="Recommendations" />
    </q-tabs>

    <q-tab-panels v-model="activeTab" animated>
      <q-tab-panel name="general">
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
      </q-tab-panel>

      <q-tab-panel name="essays">
        <Essays :application="application" />
      </q-tab-panel>

      <q-tab-panel name="recommendations">
        <Recommendations :application="application" />
      </q-tab-panel>
    </q-tab-panels>
  </q-form>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useApplicationStore } from 'stores/application.store'
// import { useUserStore } from 'stores/user.store'
// import { useAuthStore } from 'stores/auth.store'
import type { Application } from 'src/types'
import { targetTypeOptions, statusOptions } from 'src/types'
import Essays from 'components/Essays.vue'
import Recommendations from 'components/Recommendations.vue'
import ScholarshipBanner from 'components/ScholarshipBanner.vue'

const $q = useQuasar()
const applicationStore = useApplicationStore()
// const userStore = useUserStore()
// const authStore = useAuthStore()
const loading = ref(false)
const activeTab = ref('general')

const props = defineProps<{
  isEdit: boolean
  application: Application | null
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'submit'): void
}>()

const form = ref<Omit<Application, 'created'>>({
  applicationId: crypto.randomUUID(),
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

const initializeForm = () => {
  if (props.application) {
    const applicationData = { ...props.application }
    form.value = applicationData
  } else {
    // Reset form for new application
    form.value = {
      applicationId: '',
      studentId: '',
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
    }
  }
}

// Watch for changes in props.application
watch(() => props.application, (newApplication) => {
  if (newApplication) {
    // Update form with application data, excluding the created field
    const { ...applicationData } = newApplication
    form.value = applicationData
  }
}, { immediate: true })

const scholarshipName = computed(() => {
  return props.application?.scholarshipName || form.value.scholarshipName || ''
})

const onSubmit = async () => {
  try {
    loading.value = true
    if (props.isEdit) {
      await applicationStore.updateApplication(form.value.applicationId, form.value)
      $q.notify({
        color: 'positive',
        message: 'Application updated successfully'
      })
    } else {
      const newApplication: Omit<Application, 'applicationId'> = {
        ...form.value,
        created: new Date().toISOString()
      }
      await applicationStore.createApplication(newApplication)
      $q.notify({
        color: 'positive',
        message: 'Application created successfully'
      })
    }
    emit('submit')
  } catch (error) {
    console.error('Error submitting application:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to submit application'
    })
  } finally {
    loading.value = false
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