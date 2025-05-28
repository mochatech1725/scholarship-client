<template>
  <q-page padding>
    <div class="text-h5 q-mb-lg">Scholarship Search</div>

    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="text-h6">Search Criteria</div>
        <q-form @submit="onSearch" class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="searchCriteria.educationLevel"
                :options="educationLevelOptions"
                label="Education Level"
                :rules="[val => !!val || 'Education level is required']"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="searchCriteria.targetType"
                :options="targetTypeOptions"
                label="Target Type"
                :rules="[val => !!val || 'Target type is required']"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="searchCriteria.areas"
                :options="areaOptions"
                label="Areas of Interest"
                multiple
                use-chips
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model.number="searchCriteria.minAmount"
                label="Minimum Amount"
                type="number"
                prefix="$"
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="searchCriteria.keywords"
                label="Additional Keywords"
                hint="Enter keywords separated by commas"
              />
            </div>
          </div>

          <div class="row justify-end">
            <q-btn
              label="Search"
              type="submit"
              color="primary"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <div v-if="searchResults.length > 0">
      <div class="text-h6 q-mb-md">Search Results</div>
      <div class="row q-col-gutter-md">
        <div
          v-for="scholarship in searchResults"
          :key="scholarship.id"
          class="col-12 col-md-6 col-lg-4"
        >
          <q-card>
            <q-card-section>
              <div class="text-h6">{{ scholarship.name }}</div>
              <div class="text-subtitle2">{{ scholarship.organization }}</div>
            </q-card-section>

            <q-card-section>
              <div class="row q-col-gutter-sm">
                <div class="col-12">
                  <q-chip
                    :color="getTargetTypeColor(scholarship.targetType)"
                    text-color="white"
                    dense
                  >
                    {{ scholarship.targetType }}
                  </q-chip>
                  <q-chip
                    v-for="area in scholarship.areas"
                    :key="area"
                    color="primary"
                    text-color="white"
                    dense
                    class="q-ml-sm"
                  >
                    {{ area }}
                  </q-chip>
                </div>
                <div class="col-12">
                  <div class="text-h6 text-primary">${{ scholarship.amount.toLocaleString() }}</div>
                </div>
                <div class="col-12">
                  <div class="text-caption">Due: {{ new Date(scholarship.dueDate).toLocaleDateString() }}</div>
                </div>
              </div>
            </q-card-section>

            <q-card-section>
              <p class="text-body2">{{ scholarship.description }}</p>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                flat
                color="primary"
                label="View Details"
                :to="`/applications/new?scholarship=${scholarship.id}`"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>

    <div v-else-if="hasSearched" class="text-center q-pa-lg">
      <q-icon name="search_off" size="4rem" color="grey" />
      <div class="text-h6 q-mt-md">No scholarships found</div>
      <div class="text-subtitle2">Try adjusting your search criteria</div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'

interface SearchCriteria {
  educationLevel: string
  targetType: string
  areas: string[]
  minAmount: number
  keywords: string
}

interface Scholarship {
  id: string
  name: string
  organization: string
  targetType: string
  areas: string[]
  amount: number
  dueDate: string
  description: string
}

const $q = useQuasar()
const loading = ref(false)
const hasSearched = ref(false)
const searchResults = ref<Scholarship[]>([])

const educationLevelOptions = [
  'High School Senior',
  'College Freshman',
  'College Sophomore',
  'College Junior',
  'College Senior',
  'Graduate Student'
]

const targetTypeOptions = ['merit', 'need', 'both']

const areaOptions = [
  'STEM',
  'Arts',
  'Business',
  'Education',
  'Healthcare',
  'Humanities',
  'Social Sciences',
  'Sports',
  'Technology'
]

const searchCriteria = ref<SearchCriteria>({
  educationLevel: '',
  targetType: '',
  areas: [],
  minAmount: 0,
  keywords: ''
})

const getTargetTypeColor = (type: string) => {
  switch (type) {
    case 'merit':
      return 'positive'
    case 'need':
      return 'warning'
    case 'both':
      return 'info'
    default:
      return 'grey'
  }
}

const onSearch = async () => {
  loading.value = true
  hasSearched.value = true

  try {
    // TODO: Implement API call to AI-powered search
    // For now, using mock data
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
    searchResults.value = [
      {
        id: '1',
        name: 'STEM Excellence Scholarship',
        organization: 'Tech Foundation',
        targetType: 'merit',
        areas: ['STEM', 'Technology'],
        amount: 10000,
        dueDate: '2024-05-01',
        description: 'Awarded to outstanding students pursuing degrees in STEM fields.'
      },
      {
        id: '2',
        name: 'Arts Achievement Award',
        organization: 'Creative Arts Society',
        targetType: 'both',
        areas: ['Arts'],
        amount: 5000,
        dueDate: '2024-04-15',
        description: 'Supporting talented artists in their pursuit of higher education.'
      }
    ]
  } catch (err) {
    console.error('Failed to search scholarships:', err)
    $q.notify({
      color: 'negative',
      message: 'Failed to search scholarships'
    })
  } finally {
    loading.value = false
  }
}
</script> 