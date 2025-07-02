<template>
  <div>
    <!-- Search Results -->
    <div class="text-h6 q-mb-md">Search Results</div>
    <q-table
      :rows="results"
      :columns="scholarshipColumns"
      row-key="title"
      flat
      bordered
      :pagination="{ rowsPerPage: 0 }"
    >
      <template v-slot:body-cell-amount="props">
        <q-td :props="props">
          {{ props.row.amount ? `${props.row.amount}` : 'Amount varies' }}
        </q-td>
      </template>

      <template v-slot:no-data>
        <div class="text-center q-pa-lg">
          <q-icon name="search_off" size="4rem" color="grey-4" />
          <div class="text-h6 q-mt-md text-grey-6">No scholarships found</div>
          <div class="text-body2 text-grey-5 q-mt-sm">Try adjusting your search filters</div>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">


// Import the interface from types
import type { ScholarshipResult } from 'src/types'

defineProps<{
  results: ScholarshipResult[]
}>()

const scholarshipColumns = [
  {
    name: 'title',
    label: 'Scholarship Name',
    field: (row: ScholarshipResult) => row.title.length > 50 ? row.title.substring(0, 50) + '...' : row.title,
    align: 'left' as const
  },
  {
    name: 'amount',
    label: 'Amount',
    field: (row: ScholarshipResult) => row.amount,
    align: 'right' as const
  },
  {
    name: 'deadline',
    label: 'Deadline',
    field: (row: ScholarshipResult) => row.deadline,
    align: 'center' as const
  },
  {
    name: 'eligibility',
    label: 'Eligibility',
    field: (row: ScholarshipResult) => row.eligibility,
    align: 'left' as const
  },
  {
    name: 'renewable',
    label: 'Renewable',
    field: (row: ScholarshipResult) => row.renewable ? 'Yes' : 'No',
    align: 'center' as const
  },
  {
    name: 'url',
    label: 'Website',
    field: (row: ScholarshipResult) => row.url,
    align: 'left' as const
  },
  {
    name: 'geographicRestrictions',
    label: 'Geographic Restrictions',
    field: (row: ScholarshipResult) => row.geographicRestrictions,
    align: 'left' as const
  }
]

</script> 