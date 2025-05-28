<template>
  <q-page padding>
    <div class="text-h5 q-mb-lg">Scholarships</div>

    <!-- Search Section -->
    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="text-h6 q-mb-md">Search Scholarships</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6 col-md-3">
            <q-input
              v-model="searchQuery"
              label="Search"
              clearable
              @update:model-value="onSearch"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-select
              v-model="filters.educationLevel"
              :options="educationLevelOptions"
              label="Education Level"
              clearable
              @update:model-value="onSearch"
            />
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-select
              v-model="filters.amount"
              :options="amountOptions"
              label="Minimum Amount"
              clearable
              @update:model-value="onSearch"
            />
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-select
              v-model="filters.deadline"
              :options="deadlineOptions"
              label="Application Deadline"
              clearable
              @update:model-value="onSearch"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Recommended Scholarships -->
    <div class="text-h6 q-mb-md">Recommended for You</div>
    <div class="row q-col-gutter-md q-mb-xl">
      <div v-for="scholarship in recommendedScholarships" :key="scholarship.id" class="col-12 col-md-6 col-lg-4">
        <q-card class="scholarship-card">
          <q-card-section>
            <div class="text-h6">{{ scholarship.name }}</div>
            <div class="text-subtitle2">{{ scholarship.organization }}</div>
          </q-card-section>

          <q-card-section>
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <div class="text-caption">Amount</div>
                <div class="text-weight-medium">${{ scholarship.amount.toLocaleString() }}</div>
              </div>
              <div class="col-6">
                <div class="text-caption">Deadline</div>
                <div class="text-weight-medium">{{ formatDate(scholarship.deadline) }}</div>
              </div>
            </div>
          </q-card-section>

          <q-card-section>
            <div class="text-caption">Description</div>
            <p class="q-mt-sm">{{ scholarship.description }}</p>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat color="primary" label="View Details" :to="`/scholarships/${scholarship.id}`" />
            <q-btn flat color="primary" label="Apply" @click="applyForScholarship(scholarship)" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Search Results -->
    <div v-if="searchResults.length > 0" class="text-h6 q-mb-md">Search Results</div>
    <div class="row q-col-gutter-md">
      <div v-for="scholarship in searchResults" :key="scholarship.id" class="col-12 col-md-6 col-lg-4">
        <q-card class="scholarship-card">
          <q-card-section>
            <div class="text-h6">{{ scholarship.name }}</div>
            <div class="text-subtitle2">{{ scholarship.organization }}</div>
          </q-card-section>

          <q-card-section>
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <div class="text-caption">Amount</div>
                <div class="text-weight-medium">${{ scholarship.amount.toLocaleString() }}</div>
              </div>
              <div class="col-6">
                <div class="text-caption">Deadline</div>
                <div class="text-weight-medium">{{ formatDate(scholarship.deadline) }}</div>
              </div>
            </div>
          </q-card-section>

          <q-card-section>
            <div class="text-caption">Description</div>
            <p class="q-mt-sm">{{ scholarship.description }}</p>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat color="primary" label="View Details" :to="`/scholarships/${scholarship.id}`" />
            <q-btn flat color="primary" label="Apply" @click="applyForScholarship(scholarship)" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

interface Scholarship {
  id: string
  name: string
  organization: string
  amount: number
  deadline: string
  description: string
  educationLevel: string
  requirements: string[]
}

const $q = useQuasar()
const searchQuery = ref('')
const searchResults = ref<Scholarship[]>([])
const recommendedScholarships = ref<Scholarship[]>([])

const filters = ref({
  educationLevel: null,
  amount: null,
  deadline: null
})

const educationLevelOptions = [
  'High School Senior',
  'College Freshman',
  'College Sophomore',
  'College Junior',
  'College Senior',
  'Graduate Student'
]

const amountOptions = [
  { label: '$1,000+', value: 1000 },
  { label: '$5,000+', value: 5000 },
  { label: '$10,000+', value: 10000 },
  { label: '$25,000+', value: 25000 }
]

const deadlineOptions = [
  { label: 'Next 7 days', value: 7 },
  { label: 'Next 30 days', value: 30 },
  { label: 'Next 90 days', value: 90 }
]

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const onSearch = () => {
  // TODO: Implement actual search logic
  // For now, using mock data
  searchResults.value = [
    {
      id: '1',
      name: 'STEM Excellence Scholarship',
      organization: 'Tech Foundation',
      amount: 10000,
      deadline: '2024-05-01',
      description: 'Awarded to outstanding students pursuing degrees in STEM fields.',
      educationLevel: 'College Freshman',
      requirements: ['3.5+ GPA', 'STEM Major', 'Essay']
    },
    {
      id: '2',
      name: 'Arts Achievement Award',
      organization: 'Creative Arts Society',
      amount: 5000,
      deadline: '2024-04-15',
      description: 'Supporting talented students in the arts and humanities.',
      educationLevel: 'High School Senior',
      requirements: ['Portfolio', 'Essay', 'Letters of Recommendation']
    }
  ]
}

const applyForScholarship = (scholarship: Scholarship) => {
  $q.dialog({
    title: 'Apply for Scholarship',
    message: `Would you like to apply for the ${scholarship.name}?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    // TODO: Implement application logic
    $q.notify({
      color: 'positive',
      message: 'Application started successfully'
    })
  })
}

onMounted(() => {
  // TODO: Implement actual API call
  // For now, using mock data
  recommendedScholarships.value = [
    {
      id: '3',
      name: 'Future Leaders Scholarship',
      organization: 'Leadership Foundation',
      amount: 15000,
      deadline: '2024-06-01',
      description: 'Supporting the next generation of leaders in business and technology.',
      educationLevel: 'College Junior',
      requirements: ['3.0+ GPA', 'Leadership Experience', 'Essay']
    },
    {
      id: '4',
      name: 'Community Service Award',
      organization: 'Service Foundation',
      amount: 8000,
      deadline: '2024-07-15',
      description: 'Recognizing students who have made significant contributions to their communities.',
      educationLevel: 'College Sophomore',
      requirements: ['Community Service Hours', 'Essay', 'Letters of Recommendation']
    }
  ]
})
</script>

<style lang="scss" scoped>
.scholarship-card {
  height: 100%;
  display: flex;
  flex-direction: column;

  .q-card-section {
    flex: 1;
  }
}
</style> 