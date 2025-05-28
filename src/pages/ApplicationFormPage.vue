<template>
  <q-page padding>
    <div class="row q-mb-md items-center justify-between">
      <div class="text-h5">{{ isEdit ? 'Edit Application' : 'New Application' }}</div>
      <q-btn
        flat
        color="primary"
        icon="arrow_back"
        label="Back"
        to="/applications"
      />
    </div>

    <q-form @submit="onSubmit" class="q-gutter-md">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-input
            v-model="form.scholarshipName"
            label="Scholarship Name"
            :rules="[val => !!val || 'Scholarship name is required']"
          />
        </div>

        <div class="col-12 col-md-6">
          <q-input
            v-model="form.company"
            label="Organization"
            :rules="[val => !!val || 'Organization is required']"
          />
        </div>

        <div class="col-12 col-md-6">
          <q-input
            v-model="form.companyWebsite"
            label="Organization Website"
            type="url"
          />
        </div>

        <div class="col-12 col-md-6">
          <q-input
            v-model="form.applicationLink"
            label="Application Link"
            type="url"
          />
        </div>

        <div class="col-12 col-md-6">
          <q-input
            v-model.number="form.amount"
            label="Amount"
            type="number"
            prefix="$"
            :rules="[val => val > 0 || 'Amount must be greater than 0']"
          />
        </div>

        <div class="col-12 col-md-6">
          <q-select
            v-model="form.targetType"
            :options="targetTypeOptions"
            label="Target Type"
            :rules="[val => !!val || 'Target type is required']"
          />
        </div>

        <div class="col-12 col-md-6">
          <q-input
            v-model="form.theme"
            label="Theme"
          />
        </div>

        <div class="col-12 col-md-6">
          <q-toggle
            v-model="form.renewable"
            label="Renewable"
          />
        </div>

        <div class="col-12 col-md-6">
          <q-input
            v-model="form.openDate"
            label="Open Date"
            type="date"
            :rules="[val => !!val || 'Open date is required']"
          />
        </div>

        <div class="col-12 col-md-6">
          <q-input
            v-model="form.dueDate"
            label="Due Date"
            type="date"
            :rules="[val => !!val || 'Due date is required']"
          />
        </div>

        <div class="col-12 col-md-6">
          <q-select
            v-model="form.status"
            :options="statusOptions"
            label="Status"
            :rules="[val => !!val || 'Status is required']"
          />
        </div>

        <div class="col-12 col-md-6">
          <q-input
            v-model="form.currentAction"
            label="Current Action"
          />
        </div>

        <div class="col-12">
          <q-input
            v-model="form.documentInfoLink"
            label="Document Information Link"
            type="url"
          />
        </div>
      </div>

      <!-- Essays Section -->
      <div class="text-h6 q-mt-lg">Essays</div>
      <div v-for="(essay, index) in form.essays" :key="index" class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-md-4">
          <q-input
            v-model="essay.count"
            label="Count"
            type="number"
          />
        </div>
        <div class="col-12 col-md-4">
          <q-input
            v-model="essay.units"
            label="Units"
          />
        </div>
        <div class="col-12 col-md-3">
          <q-input
            v-model="essay.theme"
            label="Theme"
          />
        </div>
        <div class="col-12 col-md-1">
          <q-btn
            flat
            round
            color="negative"
            icon="delete"
            @click="removeEssay(index)"
          />
        </div>
      </div>
      <q-btn
        flat
        color="primary"
        icon="add"
        label="Add Essay"
        @click="addEssay"
      />

      <!-- Recommendations Section -->
      <div class="text-h6 q-mt-lg">Recommendations</div>
      <div v-for="(recommendation, index) in form.recommendations" :key="index" class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-md-3">
          <q-input
            v-model="recommendation.recommender.firstName"
            label="Recommender First Name"
          />
        </div>
        <div class="col-12 col-md-3">
          <q-input
            v-model="recommendation.recommender.lastName"
            label="Recommender Last Name"
          />
        </div>
        <div class="col-12 col-md-2">
          <q-input
            v-model="recommendation.relationship"
            label="Relationship"
          />
        </div>
        <div class="col-12 col-md-2">
          <q-input
            v-model="recommendation.dueDate"
            label="Due Date"
            type="date"
          />
        </div>
        <div class="col-12 col-md-1">
          <q-btn
            flat
            round
            color="negative"
            icon="delete"
            @click="removeRecommendation(index)"
          />
        </div>
      </div>
      <q-btn
        flat
        color="primary"
        icon="add"
        label="Add Recommendation"
        @click="addRecommendation"
      />

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
        />
      </div>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

interface Essay {
  count: string
  units: string
  theme: string
}

interface Recommender {
  firstName: string
  lastName: string
  relationship: string
}

interface Recommendation {
  recommender: Recommender
  relationship: string
  dueDate: string
}

interface ApplicationForm {
  scholarshipName: string
  company: string
  companyWebsite: string
  applicationLink: string
  amount: number
  targetType: string
  theme: string
  renewable: boolean
  openDate: string
  dueDate: string
  status: string
  currentAction: string
  documentInfoLink: string
  essays: Essay[]
  recommendations: Recommendation[]
}

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const isEdit = ref(false)
const form = ref<ApplicationForm>({
  scholarshipName: '',
  company: '',
  companyWebsite: '',
  applicationLink: '',
  amount: 0,
  targetType: '',
  theme: '',
  renewable: false,
  openDate: '',
  dueDate: '',
  status: '',
  currentAction: '',
  documentInfoLink: '',
  essays: [],
  recommendations: []
})

const targetTypeOptions = ['merit', 'need', 'both']
const statusOptions = ['Not Started', 'In Progress', 'Submitted', 'Rejected']

const addEssay = () => {
  form.value.essays.push({
    count: '',
    units: '',
    theme: ''
  })
}

const removeEssay = (index: number) => {
  form.value.essays.splice(index, 1)
}

const addRecommendation = () => {
  form.value.recommendations.push({
    recommender: {
      firstName: '',
      lastName: '',
      relationship: ''
    },
    relationship: '',
    dueDate: ''
  })
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
        scholarshipName: 'Academic Excellence Scholarship',
        company: 'University Foundation',
        companyWebsite: 'https://example.com/scholarship1',
        applicationLink: 'https://example.com/apply1',
        amount: 5000,
        targetType: 'merit',
        theme: 'Academic',
        renewable: true,
        openDate: '2024-01-01',
        dueDate: '2024-05-01',
        status: 'Not Started',
        currentAction: 'Review Requirements',
        documentInfoLink: 'https://example.com/docs1',
        essays: [
          { count: '1', units: '500', theme: 'Academic Goals' }
        ],
        recommendations: [
          {
            recommender: {
              firstName: 'John',
              lastName: 'Smith',
              relationship: 'Professor'
            },
            relationship: 'Academic',
            dueDate: '2024-04-15'
          }
        ]
      },
      '2': {
        scholarshipName: 'STEM Innovation Award',
        company: 'Tech Foundation',
        companyWebsite: 'https://example.com/scholarship2',
        applicationLink: 'https://example.com/apply2',
        amount: 10000,
        targetType: 'merit',
        theme: 'STEM',
        renewable: false,
        openDate: '2024-02-01',
        dueDate: '2024-06-01',
        status: 'In Progress',
        currentAction: 'Submit Essays',
        documentInfoLink: 'https://example.com/docs2',
        essays: [
          { count: '1', units: '750', theme: 'Research Interests' }
        ],
        recommendations: [
          {
            recommender: {
              firstName: 'Jane',
              lastName: 'Doe',
              relationship: 'Research Advisor'
            },
            relationship: 'Academic',
            dueDate: '2024-05-15'
          },
          {
            recommender: {
              firstName: 'Mike',
              lastName: 'Johnson',
              relationship: 'Industry Mentor'
            },
            relationship: 'Professional',
            dueDate: '2024-05-15'
          }
        ]
      }
    }

    form.value = mockData[id as keyof typeof mockData] || mockData['1']
  } catch (err) {
    console.error('Failed to load application:', err)
    $q.notify({
      color: 'negative',
      message: 'Failed to load application'
    })
  }
}

const onSubmit = async () => {
  try {
    // TODO: Implement API call
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
    
    $q.notify({
      color: 'positive',
      message: `Application ${isEdit.value ? 'updated' : 'created'} successfully`
    })
    await router.push('/applications')
  } catch (err) {
    console.error('Failed to save application:', err)
    $q.notify({
      color: 'negative',
      message: `Failed to ${isEdit.value ? 'update' : 'create'} application`
    })
  }
}

onMounted(() => {
  const { id } = route.params
  if (id && id !== 'new') {
    isEdit.value = true
    void loadApplication(id as string)
  }
})
</script> 