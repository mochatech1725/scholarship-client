<template>
  <q-page padding class="q-px-xl">
    <div class="row q-mb-lg items-center justify-between">
      <div class="text-h5">{{ isEdit ? 'Edit Application' : 'New Application' }}</div>
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
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="form.targetType"
                :options="targetTypeOptions"
                label="Target Type"
                outlined
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.company"
                label="Organization"
                outlined
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.companyWebsite"
                label="Organization Website"
                outlined
                type="url"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.applicationLink"
                label="Application Link"
                outlined
                type="url"
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
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.platform"
                label="Platform"
                outlined
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.theme"
                label="Theme"
                outlined
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Dates and Status Section -->
      <q-card class="q-pa-md">
        <q-card-section>
          <div class="text-h6 q-mb-md">Dates and Status</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input
                v-model="form.openDate"
                label="Open Date"
                outlined
                type="date"
              />
            </div>

            <div class="col-12 col-md-4">
              <q-input
                v-model="form.dueDate"
                label="Due Date"
                :rules="rules.dueDate"
                outlined
                type="date"
              />
            </div>

            <div class="col-12 col-md-4">
              <q-input
                v-model="form.submissionDate"
                label="Submission Date"
                outlined
                type="date"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="form.status"
                :options="statusOptions"
                label="Status"
                :rules="rules.status"
                outlined
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.currentAction"
                label="Current Action"
                outlined
              />
            </div>

            <div class="col-12">
              <q-toggle
                v-model="form.renewable"
                label="Renewable"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Requirements Section -->
      <q-card class="q-pa-md">
        <q-card-section>
          <div class="text-h6 q-mb-md">Requirements</div>
          <q-input
            v-model="form.requirements"
            label="Requirements"
            outlined
            type="textarea"
            autogrow
          />
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
              :to="`/dashboard/essay-form/${form.scholarshipId}`"
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
                >
                  <template v-slot:body-cell-actions="props">
                    <q-td :props="props" class="q-gutter-sm">
                      <q-btn
                        flat
                        round
                        color="primary"
                        icon="add"
                        :to="`/dashboard/essay-form/${form.scholarshipId}`"
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
              to="/dashboard/recommender-form"
            />
          </div>

          <q-expansion-item
            group="recommendations"
            icon="person"
            label="Current Recommendations"
            header-class="text-primary"
          >
            <q-card>
              <q-card-section>
                <div class="row q-col-gutter-md">
                  <div v-for="(recommendation, index) in form.recommendations" :key="index" class="col-12">
                    <q-card flat bordered class="q-pa-sm">
                      <div class="row q-col-gutter-sm items-center">
                        <div class="col-12 col-md-4">
                          <q-select
                            v-model="recommendation.recommenderId"
                            :options="recommenders"
                            option-label="firstName"
                            option-value="recommenderId"
                            label="Recommender"
                            outlined
                            dense
                          >
                            <template v-slot:option="scope">
                              <q-item v-bind="scope.itemProps">
                                <q-item-section>
                                  <q-item-label>{{ scope.opt.firstName }} {{ scope.opt.lastName }}</q-item-label>
                                  <q-item-label caption>{{ scope.opt.relationship }}</q-item-label>
                                </q-item-section>
                              </q-item>
                            </template>
                          </q-select>
                        </div>
                        <div class="col-12 col-md-3">
                          <q-input
                            v-model="recommendation.relationship"
                            label="Relationship"
                            outlined
                            dense
                          />
                        </div>
                        <div class="col-12 col-md-3">
                          <q-input
                            v-model="recommendation.dueDate"
                            label="Due Date"
                            type="date"
                            outlined
                            dense
                          />
                        </div>
                        <div class="col-12 col-md-2">
                          <q-btn
                            flat
                            round
                            color="negative"
                            icon="delete"
                            @click="removeRecommendation(index)"
                            dense
                          />
                        </div>
                      </div>
                    </q-card>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            group="recommendations"
            icon="list"
            label="Available Recommenders"
            header-class="text-primary"
          >
            <q-card>
              <q-card-section>
                <q-table
                  :rows="recommenders"
                  :columns="recommenderColumns"
                  row-key="recommenderId"
                  flat
                  bordered
                >
                  <template v-slot:body-cell-actions="props">
                    <q-td :props="props" class="q-gutter-sm">
                      <q-btn
                        flat
                        round
                        color="primary"
                        icon="add"
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

      <div class="row justify-end q-mt-lg">
        <q-btn
          label="Cancel"
          color="grey"
          flat
          to="/applications"
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
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useApplicationStore } from 'src/stores/application.store'
import { useRecommenderStore } from 'src/stores/recommender.store'
import { useEssayStore } from 'src/stores/essay.store'
import type { Recommender, Application } from 'src/types'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const applicationStore = useApplicationStore()
const recommenderStore = useRecommenderStore()
const essayStore = useEssayStore()
const loading = ref(false)

const isEdit = ref(false)
const form = ref<Application>({
  studentId: '',
  scholarshipId: '',
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
  status: '',
  submissionDate: '',
  openDate: '',
  dueDate: '',
  created: new Date().toISOString(),
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

const recommenderColumns = [
  { name: 'firstName', label: 'First Name', field: 'firstName', sortable: true, align: 'left' as const },
  { name: 'lastName', label: 'Last Name', field: 'lastName', sortable: true, align: 'left' as const },
  { name: 'relationship', label: 'Relationship', field: 'relationship', sortable: true, align: 'left' as const },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' as const }
]

const availableEssays = ref<Array<{
  essayId?: string;
  scholarshipId: string;
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
    const essays = await essayStore.getEssaysByScholarship(form.value.scholarshipId)
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

const removeRecommendation = (index: number) => {
  form.value.recommendations.splice(index, 1)
}

const loadApplication = async (id: string) => {
  try {
    // TODO: Implement API call
    // For now, using mock data
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
    
    // Use the id to determine which mock data to return
    const mockData = {
      '1': {
        scholarshipId: '1',
        scholarshipName: 'Academic Excellence Scholarship',
        targetType: 'merit' as const,
        company: 'University Foundation',
        companyWebsite: 'https://example.com/scholarship1',
        platform: 'University Portal',
        applicationLink: 'https://example.com/apply1',
        theme: 'Academic',
        amount: 5000,
        requirements: 'Minimum 3.5 GPA, Full-time student',
        renewable: true,
        documentInfoLink: 'https://example.com/docs1',
        currentAction: 'Review Requirements',
        status: 'Not Started',
        submissionDate: '2024-04-15',
        openDate: '2024-01-01',
        dueDate: '2024-05-01',
        created: new Date().toISOString(),
        essays: [
          {
            essayId: '1',
            scholarshipId: '1',
            studentId: '',
            count: '1',
            units: '500',
            theme: 'Academic Goals',
            essayLink: 'https://example.com/essay1',
            created: new Date().toISOString()
          }
        ],
        recommendations: [
          {
            recommendationId: '1',
            scholarshipId: '1',
            studentId: '',
            recommenderId: '1',
            relationship: 'Academic',
            dueDate: '2024-04-15',
            created: new Date().toISOString()
          }
        ]
      }
    }

    const mockApplication = mockData[id as keyof typeof mockData] || mockData['1']
    form.value = {
      ...form.value,
      ...mockApplication
    }
  } catch (err) {
    console.error('Failed to load application:', err)
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
      await applicationStore.createApplication(form.value)
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

onMounted(async () => {
  if (route.params.id) {
    isEdit.value = true
    await loadApplication(route.params.id as string)
  }
  await loadRecommenders()
  await loadEssays()
})
</script> 