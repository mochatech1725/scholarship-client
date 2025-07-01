<template>
  <q-page padding>
    <div class="text-h5 q-mb-lg">Search Scholarships</div>

    <!-- Search Button and Filter Section -->
    <div class="row justify-end items-center q-mb-lg q-gutter-md">
      <div class="col-auto">
        <ScholarshipSearchFilter 
          ref="filterRef"
          :filters="defaultFilters"
        />
      </div>
      <div class="col-auto">
        <q-btn
          label="Search"
          color="primary"
          size="md"
          @click="handleSearch"
          :loading="searching"
          :disable="!hasActiveFilters"
          icon="search"
        />
      </div>
    </div>

    <!-- Results Section -->
    <div v-if="hasSearched && !searching" class="row">
      <div class="col-12">
        <ScholarshipSearchResults ref="searchResultsRef" />
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="searching" class="row">
      <div class="col-12">
        <q-card>
          <q-card-section class="text-center q-pa-xl">
            <q-spinner-dots size="60px" color="primary" class="q-mb-md" />
            <div class="text-h6 text-grey-7 q-mb-sm">Searching for scholarships...</div>
            <div class="text-caption text-grey-5">This might take a while</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Empty State Table -->
    <div v-else class="row">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">Scholarship Results</div>
            <q-table
              :rows="[]"
              :columns="tableColumns"
              row-key="name"
              flat
              bordered
              class="empty-table"
            >
              <template v-slot:no-data>
                <div class="full-width row flex-center q-pa-md">
                  <div class="text-center">
                    <q-icon name="search" size="48px" color="grey-4" class="q-mb-md" />
                    <div class="text-h6 text-grey-6">No search performed yet</div>
                    <div class="text-caption text-grey-5 q-mt-sm">
                      Use the filters above and click "Search" to find scholarships
                    </div>
                  </div>
                </div>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ScholarshipSearchFilter from 'components/ScholarshipSearchFilter.vue'
import ScholarshipSearchResults from 'components/ScholarshipSearchResults.vue'
import { apiService } from 'src/services/api.service'

const searchResultsRef = ref()
const filterRef = ref()
const searching = ref(false)
const hasSearched = ref(false)

const tableColumns = [
  { name: 'name', label: 'Scholarship Name', field: 'name', align: 'left' as const },
  { name: 'organization', label: 'Organization', field: 'organization', align: 'left' as const },
  { name: 'amount', label: 'Amount', field: 'amount', align: 'right' as const },
  { name: 'deadline', label: 'Deadline', field: 'deadline', align: 'center' as const },
  { name: 'targetType', label: 'Type', field: 'targetType', align: 'center' as const }
]

const defaultFilters = {
  searchQuery: '',
  subjectAreas: [] as string[],
  educationLevel: null as string | null,
  educationYear: null as string | null,
  targetType: null as string | null,
  gender: null as string | null,
  ethnicity: null as string | null,
  academicGPA: null as number | null,
  essayRequired: null as boolean | null,
  recommendationRequired: null as boolean | null,
  deadlineRange: null as { startDate?: string; endDate?: string } | null,
  deadlineWithinDays: null as number | null
}

const hasActiveFilters = computed(() => {
  return filterRef.value?.getActiveFiltersCount() > 0
})

const handleSearch = async () => {
  searching.value = true
  hasSearched.value = true
  try {
    const filters = filterRef.value?.localFilters || defaultFilters
    const results = await apiService.findScholarships(filters)
    searchResultsRef.value?.setResults(results)
  } catch (error) {
    console.error('Search failed:', error)
    // Handle error - could show notification here
  } finally {
    searching.value = false
  }
}
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