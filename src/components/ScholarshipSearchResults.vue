<template>
  <div>
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

    <!-- No Results Message -->
    <div v-else class="text-center q-pa-lg">
      <q-icon name="search_off" size="4rem" color="grey-4" />
      <div class="text-h6 q-mt-md text-grey-6">No scholarships found</div>
      <div class="text-body2 text-grey-5 q-mt-sm">Try adjusting your search filters</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Scholarship } from 'src/types'

const searchResults = ref<Scholarship[]>([])

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

const setResults = (results: Scholarship[]) => {
  searchResults.value = results
}

defineExpose({
  setResults
})
</script> 