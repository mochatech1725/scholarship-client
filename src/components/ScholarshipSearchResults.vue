<template>
  <div>
    <!-- Recommended Scholarships -->
    <div class="text-h6 q-mb-md">Recommended for You</div>
    <q-table
      :rows="recommendedScholarships"
      :columns="scholarshipColumns"
      row-key="id"
      flat
      bordered
      :pagination="{ rowsPerPage: 0 }"
      class="q-mb-xl"
    >
      <template v-slot:body-cell-amount="props">
        <q-td :props="props">
          ${{ props.row.amount.toLocaleString() }}
        </q-td>
      </template>

      <template v-slot:body-cell-deadline="props">
        <q-td :props="props">
          {{ formatDate(props.row.deadline) }}
        </q-td>
      </template>
    </q-table>

    <!-- Search Results -->
    <div v-if="searchResults.length > 0" class="text-h6 q-mb-md">Search Results</div>
    <q-table
      v-if="searchResults.length > 0"
      :rows="searchResults"
      :columns="scholarshipColumns"
      row-key="id"
      flat
      bordered
      :pagination="{ rowsPerPage: 0 }"
    >
      <template v-slot:body-cell-amount="props">
        <q-td :props="props">
          ${{ props.row.amount.toLocaleString() }}
        </q-td>
      </template>

      <template v-slot:body-cell-deadline="props">
        <q-td :props="props">
          {{ formatDate(props.row.deadline) }}
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

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

const searchResults = ref<Scholarship[]>([])
const recommendedScholarships = ref<Scholarship[]>([])

const scholarshipColumns = [
  {
    name: 'name',
    label: 'Scholarship',
    field: (row: Scholarship) => row.name,
    align: 'left' as const
  },
  {
    name: 'organization',
    label: 'Organization',
    field: (row: Scholarship) => row.organization,
    align: 'left' as const
  },
  {
    name: 'amount',
    label: 'Amount',
    field: (row: Scholarship) => row.amount,
    align: 'right' as const
  },
  {
    name: 'deadline',
    label: 'Deadline',
    field: (row: Scholarship) => row.deadline,
    align: 'left' as const
  },
  {
    name: 'educationLevel',
    label: 'Education Level',
    field: (row: Scholarship) => row.educationLevel,
    align: 'left' as const
  }
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

defineExpose({
  onSearch
})
</script> 