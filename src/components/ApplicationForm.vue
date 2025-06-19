<template>
  <q-card class="q-pa-md" style="background-color: #f5f3fa;">
    <q-card-section>
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

        <!-- General Information Section -->
        <q-expansion-item
          icon="info"
          label="General Information"
          header-class="text-primary"
          default-opened
        >
          <q-card class="q-pa-md" style="background-color: white;">
            <q-card-section>
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
                    outlined
                    dense
                  />
                </div>

                <div class="col-12 col-md-6">
                  <q-input
                    v-model.number="form.amount"
                    label="Amount"
                    type="number"
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
                    outlined
                    dense
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <!-- Essays Section -->
        <q-expansion-item
          icon="description"
          label="Essays"
          header-class="text-primary"
          class="q-mt-md"
        >
          <Essays :application="application" />
        </q-expansion-item>

        <!-- Recommendations Section -->
        <q-expansion-item
          icon="assignment"
          label="Recommendations"
          header-class="text-primary"
          class="q-mt-md"
        >
          <Recommendations :application="application" />
        </q-expansion-item>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useApplicationStore } from 'stores/application.store'
import { ObjectId } from 'bson'
import type { Application } from 'src/types'
import { targetTypeOptions, statusOptions } from 'src/types'
import Essays from 'components/Essays.vue'
import Recommendations from 'components/Recommendations.vue'
import ScholarshipBanner from 'components/ScholarshipBanner.vue'

const $q = useQuasar()
const applicationStore = useApplicationStore()
const loading = ref(false)

const props = defineProps<{
  isEdit: boolean
  application: Application | null
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'submit'): void
}>()

// Single source of truth for default form data
const getDefaultFormData = (): Application => ({
  applicationId: new ObjectId().toString(),
  studentId: '', // TODO: Get from auth store
  scholarshipName: '',
  targetType: 'Both' as const,
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
  status: 'Not Started' as const,
  submissionDate: '',
  openDate: '',
  dueDate: '',
  essays: [],
  recommendations: []
})

const form = ref<Application>(getDefaultFormData())

const rules = {
  scholarshipName: [
    (val: string) => !!val || 'Scholarship name is required'
  ],

  company: [
    (val: string) => !!val || 'Company name is required'
  ],
}

const initializeForm = () => {
  if (props.application) {
    const applicationData = { ...props.application }
    form.value = applicationData
  } else {
    // Reset form for new application with new ObjectId
    form.value = getDefaultFormData()
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

// Utility function to omit a property from an object
function omitKey<T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K> {
  const clone = { ...obj };
  delete clone[key];
  return clone;
}

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
      // For new applications, let the server handle ID generation
      const applicationData = omitKey(form.value, 'applicationId');
      const newApplication: Omit<Application, 'applicationId'> = {
        ...applicationData
      };
      
      // Create the application first
      await applicationStore.createApplication(newApplication);
 
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