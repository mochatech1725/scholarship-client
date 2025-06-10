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

          <q-expansion-item
            group="essays"
            icon="list"
            label="Available Essays"
            header-class="text-primary"
          >
            <q-card>
              <q-card-section>
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
                        icon="add"
                        :to="`/dashboard/essay-form/${form.applicationId}`"
                        dense
                      />
                    </q-td>
                  </template>
                </q-table>
              </q-card-section>
            </q-card>
          </q-expansion-item>
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
import type { Application, Recommendation, Recommender } from 'src/types'

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
  targetType: 'merit',
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
  status: 'not_started',
  submissionDate: '',
  openDate: '',
  dueDate: '',
  essays: [],
  recommendations: []
})

const targetTypeOptions = ['merit', 'need', 'both']
const statusOptions = ['Not Started', 'In Progress', 'Submitted', 'Accepted', 'Rejected']
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

const availableEssays = ref<Array<{
  essayId?: string;
  applicationId: string;
  studentId: string;
  essayLink: string;
  count: string;
  units: string;
  theme: string;
  created: string;
}>>([])

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
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Simulate loading an application
    const mockApplication: Application = {
      applicationId: route.params.id as string,
      studentId: 'student-1',
      scholarshipName: 'Test Scholarship',
      targetType: 'merit',
      company: 'Test Company',
      companyWebsite: 'https://testcompany.com',
      applicationLink: 'https://testcompany.com/apply',
      amount: 5000,
      platform: 'Common App',
      theme: 'Leadership',
      openDate: '2024-01-01',
      dueDate: '2024-05-01',
      submissionDate: '2024-04-15',
      status: 'in_progress',
      currentAction: 'Waiting for recommendations',
      renewable: true,
      requirements: 'Test requirements',
      documentInfoLink: 'https://testcompany.com/docs',
      created: new Date().toISOString(),
      recommendations: [
        {
          recommendationId: 'rec-1',
          applicationId: route.params.id as string,
          studentId: 'student-1',
          recommenderId: 'rec-1',
          recommender: {
            recommenderId: 'rec-1',
            firstName: 'John',
            lastName: 'Smith',
            emailAddress: 'john.smith@school.edu',
            phoneNumber: '555-0123',
            relationship: 'Academic Advisor',
            created: new Date().toISOString()
          },
          status: 'pending',
          requestDate: '2024-03-01',
          dueDate: '2024-04-01',
          submissionMethod: 'DirectEmail',
          submissionDate: null,
          created: new Date().toISOString()
        },
        {
          recommendationId: 'rec-2',
          applicationId: route.params.id as string,
          studentId: 'student-1',
          recommenderId: 'rec-2',
          recommender: {
            recommenderId: 'rec-2',
            firstName: 'Sarah',
            lastName: 'Johnson',
            emailAddress: 'sarah.johnson@company.com',
            phoneNumber: '555-0124',
            relationship: 'Work Supervisor',
            created: new Date().toISOString()
          },
          status: 'submitted',
          requestDate: '2024-03-01',
          dueDate: '2024-04-01',
          submissionMethod: 'DirectEmail',
          submissionDate: '2024-03-15',
          created: new Date().toISOString()
        },
        {
          recommendationId: 'rec-3',
          applicationId: route.params.id as string,
          studentId: 'student-1',
          recommenderId: 'rec-3',
          recommender: {
            recommenderId: 'rec-3',
            firstName: 'Michael',
            lastName: 'Brown',
            emailAddress: 'michael.brown@school.edu',
            phoneNumber: '555-0125',
            relationship: 'Research Advisor',
            created: new Date().toISOString()
          },
          status: 'declined',
          requestDate: '2024-03-01',
          dueDate: '2024-04-01',
          submissionMethod: 'DirectEmail',
          submissionDate: null,
          created: new Date().toISOString()
        }
      ],
      essays: []
    }

    form.value = {
      ...mockApplication
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
      const id = route.params.id as string
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

onMounted(async () => {
  if (route.params.scholarshipId) {
    isEdit.value = true
    await loadApplication()
    console.log('Setting scholarship name:', form.value.scholarshipName)
    scholarshipContextStore.setCurrentScholarshipName(form.value.scholarshipName)
  }
  await loadRecommenders()
  await loadEssays()
})

onBeforeUnmount(() => {
  console.log('Clearing scholarship name')
  scholarshipContextStore.clearCurrentScholarshipName()
})
</script> 