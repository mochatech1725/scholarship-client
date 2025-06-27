<template>
  <q-card class="q-pa-md" style="background-color: white;">
    <q-card-section>
      <ScholarshipBanner :name="scholarshipName" />
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div class="row items-center justify-between q-mb-md">
          <div class="text-h6">{{ isEdit ? 'Edit' : 'Add' }} Application</div>
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
              type="submit"
              :style="{ backgroundColor: 'var(--q-button-primary)', color: 'white' }"
              :label="isEdit ? 'Update Application' : 'Create Application'"
              size="md"
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
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <div class="form-label">Scholarship Name</div>
                  <q-input
                    v-model="form.scholarshipName"
                    :rules="rules.scholarshipName"
                    flat
                    dense
                    hide-bottom-space
                    class="q-mb-sm"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <div class="form-label">Target Type</div>
                  <q-select
                    v-model="form.targetType"
                    :options="targetTypeOptions"
                    flat
                    dense
                    class="q-mb-sm"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <div class="form-label">Company</div>
                  <q-input
                    v-model="form.company"
                    :rules="rules.company"
                    flat
                    dense
                    hide-bottom-space
                    class="q-mb-sm"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <div class="form-label">Company Website</div>
                  <q-input
                    v-model="form.companyWebsite"
                    flat
                    dense
                    class="q-mb-sm"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <div class="form-label">Platform</div>
                  <q-input
                    v-model="form.platform"
                    flat
                    dense
                    class="q-mb-sm"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <div class="form-label">Application Link</div>
                  <q-input
                    v-model="form.applicationLink"
                    flat
                    dense
                    class="q-mb-sm"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <div class="form-label">Amount</div>
                  <q-input
                    v-model.number="form.amount"
                    type="number"
                    flat
                    dense
                    class="q-mb-sm"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <q-checkbox
                    v-model="form.renewable"
                    label="Renewable"
                    class="q-mb-sm"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <div class="form-label">Renewable Terms</div>
                  <q-input
                    v-model="form.renewableTerms"
                    flat
                    dense
                    class="q-mb-sm"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <div class="form-label">Theme</div>
                  <q-input
                    v-model="form.theme"
                    flat
                    dense
                    class="q-mb-sm"
                  />
                </div>
                
                <div class="col-12 col-md-6">
                  <div class="form-label">Requirements</div>
                  <q-input
                    v-model="form.requirements"
                    flat
                    dense
                    class="q-mb-sm"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <div class="form-label">Document Info Link</div>
                  <q-input
                    v-model="form.documentInfoLink"
                    flat
                    dense
                    class="q-mb-sm"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <div class="form-label">Current Action</div>
                  <q-input
                    v-model="form.currentAction"
                    flat
                    dense
                    class="q-mb-sm"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <div class="form-label">Status</div>
                  <q-select
                    v-model="form.status"
                    :options="statusOptions"
                    flat
                    dense
                    class="q-mb-sm"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <div class="form-label">Submission Date</div>
                  <q-input
                    v-model="form.submissionDate"
                    type="date"
                    flat
                    dense
                    class="q-mb-sm"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <div class="form-label">Open Date</div>
                  <q-input
                    v-model="form.openDate"
                    type="date"
                    flat
                    dense
                    class="q-mb-sm"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <div class="form-label">Due Date</div>
                  <q-input
                    v-model="form.dueDate"
                    type="date"
                    flat
                    dense
                    class="q-mb-sm"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>


        <!-- Recommendations Section -->
        <q-expansion-item
          icon="assignment"
          label="Recommendations"
          header-class="text-primary"
          class="q-mt-md"
        >
          <Recommendations :application="application" :recommenders="recommenders" />
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

      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useApplicationStore } from 'stores/application.store'
import type { Application, Recommender } from 'src/types'
import { targetTypeOptions, statusOptions } from 'src/types'
import Essays from 'components/Essays.vue'
import Recommendations from 'components/Recommendations.vue'
import ScholarshipBanner from 'components/ScholarshipBanner.vue'
import { useRecommenderStore } from 'src/stores/recommender.store'


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
const recommenderStore = useRecommenderStore()
const recommenders = ref<Recommender[]>([])

// Single source of truth for default form data
const getDefaultFormData = (): Omit<Application, '_id'> => ({
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
  renewableTerms: '',
  documentInfoLink: '',
  currentAction: '',
  status: 'Not Started' as const,
  submissionDate: '',
  openDate: '',
  dueDate: '',
  essays: [],
  recommendations: []
})

const form = ref<Application>(getDefaultFormData() as Application)

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

const onSubmit = async () => {
  try {
    loading.value = true
    if (props.isEdit && form.value._id) {
      await applicationStore.updateApplication(form.value._id, form.value)
      $q.notify({
        color: 'positive',
        message: 'Application updated successfully'
      })
    } else {
      // For new applications, let the server handle ID generation
      const newApplication: Omit<Application, '_id'> = {
        ...form.value
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


const loadRecommenders = async () => {
  try {
    // Get userId from application or use a default
    const userId = props.application?.studentId || 'user-1' // Default fallback
    recommenders.value = await recommenderStore.getRecommendersByUserId(userId)
  } catch (error) {
    console.error('Failed to load recommenders:', error)
  }
}

onMounted(async () => {
  await loadRecommenders()
  initializeForm()
})

</script>

<style scoped>
.q-form {
  max-width: 800px;
  margin: 0 auto;
}
</style> 