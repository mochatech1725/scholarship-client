<template>
  <q-page padding>
    <div class="text-h5 q-mb-lg">Search Scholarships</div>

    <!-- Search Button -->
    <div class="row justify-end q-mb-lg">
      <q-btn
        label="Search"
        color="primary"
        size="md"
        @click="handleSearch"
        :loading="searching"
        icon="search"
      />
    </div>

    <!-- Filter Section -->
    <div class="q-mb-lg">
      <ScholarshipSearchFilter 
        v-model:filters="filters"
      />
    </div>

    <!-- Results Section -->
    <div v-if="hasSearched" class="row">
      <div class="col-12">
        <ScholarshipSearchResults ref="searchResultsRef" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ScholarshipSearchFilter from 'components/ScholarshipSearchFilter.vue'
import ScholarshipSearchResults from 'components/ScholarshipSearchResults.vue'
import { apiService } from 'src/services/api.service'

const searchResultsRef = ref()
const searching = ref(false)
const hasSearched = ref(false)

const filters = ref({
  searchQuery: '',
  educationLevel: null as string | null,
  educationYear: null as string | null,
  targetType: null as string | null,
  subjectAreas: [] as string[],
  gender: null as string | null,
  ethnicity: null as string | null,
  academicGPA: null as number | null,
  essayRequired: null as boolean | null,
  recommendationRequired: null as boolean | null
})

const handleSearch = async () => {
  searching.value = true
  hasSearched.value = true
  try {
    const results = await apiService.findScholarships(filters.value)
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