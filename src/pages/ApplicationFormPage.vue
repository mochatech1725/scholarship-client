<template>
  <q-page padding class="q-px-xl">
    <div class="row q-mb-lg items-center justify-between">
      <div>
        <div class="text-h5">{{ isEdit ? 'Edit Application' : 'New Application' }}</div>
      </div>
      <q-btn
        flat
        color="primary"
        icon="arrow_back"
        label="Back"
        to="/dashboard/applications"
      />
    </div>

    <q-form @submit="onSubmit" class="q-gutter-lg">
      <!-- Basic Information Section -->
      <q-card class="q-pa-md">
        <q-card-section>
          <div class="text-h6 q-mb-md">Basic Information</div>
          <div class="row q-col-gutter-md">
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
                label="Organization"
                outlined
                dense
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.companyWebsite"
                label="Organization Website"
                outlined
                type="url"
                dense
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.applicationLink"
                label="Application Link"
                outlined
                type="url"
                dense
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model.number="form.amount"
                label="Amount"
                :rules="rules.amount"
                outlined
                type="number"
                step="0.01"
                prefix="$"
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
                v-model="form.theme"
                label="Theme"
                outlined
                dense
              />
            </div>

            <div class="col-12 col-md-4">
              <q-input
                v-model="form.openDate"
                label="Open Date"
                outlined
                type="date"
                dense
              />
            </div>

            <div class="col-12 col-md-4">
              <q-input
                v-model="form.dueDate"
                label="Due Date"
                :rules="rules.dueDate"
                outlined
                type="date"
                dense
              />
            </div>

            <div class="col-12 col-md-4">
              <q-input
                v-model="form.submissionDate"
                label="Submission Date"
                outlined
                type="date"
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
                v-model="form.currentAction"
                label="Current Action"
                outlined
                dense
              />
            </div>

            <div class="col-12">
              <q-toggle
                v-model="form.renewable"
                label="Renewable"
                dense
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="form.requirements"
                label="Requirements"
                outlined
                type="textarea"
                autogrow
                dense
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Essays Section -->
      <q-card class="q-pa-md">
        <q-card-section>
          <div class="row items-center justify-between q-mb-md">
            <div class="text-h6">Essays</div>
            <q-btn
              flat
              color="primary"
              icon="add"
              label="Add Essay"
              :to="`/dashboard/essay-form/${form.applicationId}`"
            />
          </div>

          <q-table
            :rows="availableEssays"
            :columns="essayColumns"
            row-key="id"
            flat
            bordered
            dense
          >
            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="q-gutter-sm">
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="edit"
                  :to="props.row.essayId ? `/dashboard/essay-form/${props.row.essayId}` : '#'"
                  dense
                />
                <q-btn
                  flat
                  round
                  color="negative"
                  icon="delete"
                  @click="confirmDeleteEssay(props.row)"
                  dense
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>

      <!-- Recommendations Section -->
      <q-card class="q-pa-md">
        <q-card-section>
          <div class="row items-center justify-between q-mb-md">
            <div class="text-h6">Recommendations</div>
            <q-btn
              flat
              color="primary"
              icon="add"
              label="Add Recommendation"
              to="/dashboard/recommendation-form"
            />
          </div>

          <q-table
            :rows="form.recommendations"
            :columns="recommendationColumns"
            row-key="recommendationId"
            flat
            bordered
            dense
          >
            <template v-slot:body-cell-recommender="props">
              <q-td :props="props">
                {{ props.row.recommender?.firstName }} {{ props.row.recommender?.lastName }}
              </q-td>
            </template>
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-chip
                  :color="getStatusColor(props.row.status)"
                  text-color="white"
                  dense
                >
                  {{ props.row.status }}
                </q-chip>
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="q-gutter-sm">
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="edit"
                  :to="`/dashboard/recommendation-form/${props.row.recommendationId}`"
                  dense
                />
                <q-btn
                  flat
                  round
                  color="negative"
                  icon="delete"
                  @click="confirmDeleteRecommendation(props.row)"
                  dense
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>

      <div class="row justify-end q-mt-md">
        <q-btn
          type="submit"
          color="primary"
          :label="isEdit ? 'Update Application' : 'Create Application'"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useApplicationStore } from 'stores/application.store'
import { useRecommenderStore } from 'stores/recommender.store'
import { useEssayStore } from 'stores/essay.store'
import { useScholarshipContextStore } from 'stores/scholarship-context.store'
import type { Application, Recommendation, Recommender, Essay } from 'src/types'
import { targetTypeOptions, statusOptions } from 'src/types'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const applicationStore = useApplicationStore()
const recommenderStore = useRecommenderStore()
const essayStore = useEssayStore()
const scholarshipContextStore = useScholarshipContextStore()
const loading = ref(false)
const isEdit = ref(false)

const form = ref<Omit<Application, 'created'>>({
  applicationId: '',
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

const recommenders = ref<Recommender[]>([])

const essayColumns = [
  { name: 'theme', label: 'Theme', field: 'theme', sortable: true, align: 'left' as const },
  { name: 'count', label: 'Count', field: 'count', sortable: true, align: 'left' as const },
  { name: 'units', label: 'Units', field: 'units', sortable: true, align: 'left' as const },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' as const }
]

const recommendationColumns = [
  {
    name: 'recommender',
    label: 'Recommender',
    field: (row: Recommendation) => {
      if (!row.recommender) return 'Loading...'
      return `${row.recommender.firstName} ${row.recommender.lastName} (${row.recommender.emailAddress})`
    },
    align: 'left' as const
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'left' as const
  },
  {
    name: 'dueDate',
    label: 'Due Date',
    field: 'dueDate',
    align: 'left' as const,
    format: (val: string) => new Date(val).toLocaleDateString()
  },
  {
    name: 'submissionDate',
    label: 'Submitted',
    field: 'submissionDate',
    align: 'left' as const,
    format: (val: string | null) => val ? new Date(val).toLocaleDateString() : '-'
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'right' as const
  }
]

const availableEssays = ref<Essay[]>([])

const rules = {
  scholarshipName: [
    (val: string) => !!val || 'Scholarship name is required'
  ],
  targetType: [
    (val: string) => !!val || 'Target type is required',
    (val: string) => ['merit', 'need', 'both'].includes(val) || 'Target type must be merit, need, or both'
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

const loadEssays = async () => {
  try {
    const essays = await essayStore.getEssaysByApplication(form.value.applicationId)
    form.value.essays = essays
    availableEssays.value = essays
  } catch (err) {
    console.error('Failed to load essays:', err)
    $q.notify({
      type: 'negative',
      message: 'Failed to load essays'
    })
  }
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

const loadApplication = async () => {
  try {
    const application = await applicationStore.getApplication(route.params.id as string)
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
    await router.push('/applications')
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

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'warning'
    case 'submitted':
      return 'positive'
    case 'declined':
      return 'negative'
    default:
      return 'grey'
  }
}

const confirmDeleteRecommendation = (recommendation: Recommendation) => {
  // Implement the confirmation logic here
  console.log('Confirming deletion of recommendation:', recommendation)
}

const confirmDeleteEssay = (essay: Essay) => {
  if (!essay.essayId) {
    $q.notify({
      color: 'negative',
      message: 'Cannot delete essay: No essay ID found'
    })
    return
  }

  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure you want to delete this essay?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    void (async () => {
      try {
        await essayStore.deleteEssay(essay.essayId!)
        await loadEssays()
        $q.notify({
          color: 'positive',
          message: 'Essay deleted successfully'
        })
      } catch (err) {
        console.error('Failed to delete essay:', err)
        $q.notify({
          color: 'negative',
          message: 'Failed to delete essay'
        })
      }
    })()
  })
}

onMounted(async () => {
  if (route.params.applicationId) {
    isEdit.value = true
    await loadApplication()
    scholarshipContextStore.setCurrentScholarshipName(form.value.scholarshipName)
  }
  await loadRecommenders()
  await loadEssays()
})

onBeforeUnmount(() => {
  scholarshipContextStore.clearCurrentScholarshipName()
})
</script> 