<template>
  <q-page padding>
    <div class="text-h5 q-mb-lg">Search Scholarships</div>

    <div class="row justify-end items-center q-mb-lg q-gutter-md">
      <div class="col-auto">
        <ScholarshipSearchFilter 
          ref="searchCriteriaRef"
          :search-criteria="defaultSearchCriteria"
        />
      </div>
      <div class="col-auto">
        <div class="row items-center q-gutter-sm">
          <div class="col-auto">
            <div class="max-results-label">Max Results:</div>
          </div>
          <div class="col-auto">
            <q-input
              v-model.number="maxSearchResults"
              type="number"
              :min="1"
              :max="50"
              :step="5"
              outlined
              dense
              style="width: 80px"
              class="max-results-input"
            />
          </div>
        </div>
      </div>
      <div class="col-auto">
        <q-btn
          label="Search"
          color="primary"
          size="md"
          @click="handleSearch"
          :loading="searching"
          :disable="!hasActiveSearchCriteria"
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

    <!-- Empty State -->
    <div v-else class="row">
      <div class="col-12">
        <q-card>
          <q-card-section class="text-center q-pa-xl">
            <q-icon name="search" size="48px" color="grey-4" class="q-mb-md" />
            <div class="text-h6 text-grey-6">No search performed yet</div>
            <div class="text-caption text-grey-5 q-mt-sm">
              Use the filters above and click "Search" to find scholarships
            </div>
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
const searchCriteriaRef = ref()
const searching = ref(false)
const hasSearched = ref(false)
const maxSearchResults = ref(25)

const defaultSearchCriteria = {
  keywords: '',
  subjectAreas: [] as string[],
  educationLevel: null as string | null,
  targetType: null as string | null,
  gender: null as string | null,
  ethnicity: null as string | null,
  academicGPA: null as number | null,
  state: null as string | null,
  essayRequired: null as boolean | null,
  recommendationRequired: null as boolean | null,
  deadlineRange: null as { startDate?: string; endDate?: string } | null,
  deadlineWithinDays: null as number | null
}

const hasActiveSearchCriteria = computed(() => {
  return searchCriteriaRef.value?.getActiveFiltersCount() > 0
})

const handleSearch = async () => {
  searching.value = true
  hasSearched.value = true
  try {
    const searchCriteria = searchCriteriaRef.value?.localsearchCriteria || defaultSearchCriteria
    const results = await apiService.findScholarships(searchCriteria, maxSearchResults.value)
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

.max-results-label {
  font-weight: 500;
  font-size: 0.875rem;
  color: #333;
}
</style> 