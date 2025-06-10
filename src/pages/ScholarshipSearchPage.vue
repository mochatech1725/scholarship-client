<template>
  <q-page padding>
    <div class="text-h5 q-mb-lg">Search Scholarships</div>

    <!-- Filter Section -->
    <div class="q-mb-lg">
      <ScholarshipSearchFilter @search="onSearch" />
    </div>

    <!-- Results Section -->
    <div class="row">
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

const searchResultsRef = ref()

const onSearch = () => {
  searchResultsRef.value?.onSearch()
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