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

    </q-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Scholarship } from 'src/types'
import mockRecommendations from 'src/mocks/mockScholarshipRecommendationsData.json'

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
    name: 'url',
    label: 'Website',
    field: (row: Scholarship) => row.url,
    align: 'left' as const
  }
]

const onSearch = () => {
  // TODO: Implement actual search logic
  // For now, using mock data
  searchResults.value = [

  ]
}

onMounted(() => {
  // TODO: Implement actual API call
  // For now, using mock data
  recommendedScholarships.value = mockRecommendations.map(item => ({
    name: item.name,
    organization: item.organization,
    description: item.description,
    amount: item.amount,
    targetType: item.targetType,
    requirements: item.requirements,
    ethnicity: 'Any',
    gender: 'Any',
    educationLevel: 'Any',
    educationYear: 'Any',
    area: item.theme,
    academicGPA: 3.0,
    essay: false,
    recommendation: false,
    url: item.url,
    isActive: item.isActive
  })) as Scholarship[]
})

defineExpose({
  onSearch
})
</script> 