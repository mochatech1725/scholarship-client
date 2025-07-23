<template>
  <q-page padding>
    <div class="text-h5 q-mb-lg">Search Scholarships</div>

    <div class="row justify-end items-center q-mb-lg q-gutter-md">
      <div class="col-auto">
        <ScholarshipSearchCriteria 
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
        <ScholarshipSearchResults :results="searchResults" />
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
import ScholarshipSearchCriteria from 'components/ScholarshipSearchCriteria.vue'
import ScholarshipSearchResults from 'components/ScholarshipSearchResults.vue'
import { apiService } from 'src/services/api.service'
import type { SearchCriteria } from 'src/types'

// --- Validation function moved from utils/helper.ts ---
/**
 * Validates and trims a SearchCriteria object.
 * - Trims all string fields
 * - Validates startDate and endDate (if present) are valid dates
 * - Validates endDate > startDate (if both present)
 * @param criteria SearchCriteria object
 * @returns { cleaned: SearchCriteria, error?: string, invalidFields?: string[] }
 */
function validateAndCleanSearchCriteria(
  criteria: SearchCriteria
): { cleaned: SearchCriteria; error?: string; invalidFields?: string[] } {
  // Helper to trim or return null
  const trimOrNull = (val: string | null) =>
    typeof val === 'string' ? val.trim() : val;

  // Cleaned object
  const cleaned: SearchCriteria = {
    ...criteria,
    keywords: trimOrNull(criteria.keywords) || '',
    subjectAreas: Array.isArray(criteria.subjectAreas)
      ? criteria.subjectAreas.map((s: string) => (typeof s === 'string' ? s.trim() : s))
      : [],
    academicLevel: trimOrNull(criteria.academicLevel),
    targetType: trimOrNull(criteria.targetType),
    gender: trimOrNull(criteria.gender),
    ethnicity: trimOrNull(criteria.ethnicity),
    geographicRestrictions: trimOrNull(criteria.geographicRestrictions),
    academicGPA: criteria.academicGPA,
    essayRequired: criteria.essayRequired,
    recommendationRequired: criteria.recommendationRequired,
    deadlineRange: (() => {
      if (!criteria.deadlineRange) return {};
      const dr: { startDate?: string; endDate?: string } = {};
      const s = criteria.deadlineRange.startDate !== undefined ? trimOrNull(criteria.deadlineRange.startDate ?? null) ?? undefined : undefined;
      const e = criteria.deadlineRange.endDate !== undefined ? trimOrNull(criteria.deadlineRange.endDate ?? null) ?? undefined : undefined;
      if (s !== undefined) dr.startDate = s;
      if (e !== undefined) dr.endDate = e;
      return dr;
    })(),
    ...((criteria.deadlineWithinDays !== undefined) ? { deadlineWithinDays: criteria.deadlineWithinDays } : {}),
  };

  // Validate dates if present
  const invalidFields: string[] = [];
  let error: string | undefined;
  if (cleaned.deadlineRange) {
    const { startDate, endDate } = cleaned.deadlineRange;
    let start: Date | undefined, end: Date | undefined;
    if (startDate) {
      start = new Date(startDate);
      if (isNaN(start.getTime())) {
        error = 'Invalid start date format.';
        invalidFields.push('deadlineRange.startDate');
      }
    }
    if (endDate) {
      end = new Date(endDate);
      if (isNaN(end.getTime())) {
        error = error ? error + ' Invalid end date format.' : 'Invalid end date format.';
        invalidFields.push('deadlineRange.endDate');
      }
    }
    if (start && end && end <= start) {
      error = 'End date must be after start date.';
      invalidFields.push('deadlineRange.endDate', 'deadlineRange.startDate');
    }
  }
  if (error) {
    return { cleaned, error, invalidFields };
  }
  return { cleaned };
}
// --- End validation function ---

const searchCriteriaRef = ref()
const searching = ref(false)
const hasSearched = ref(false)
const maxSearchResults = ref(25)
const searchResults = ref([])

const defaultSearchCriteria = {
  keywords: '',
  subjectAreas: [] as string[],
  academicLevel: null as string | null,
  targetType: null as string | null,
  gender: null as string | null,
  ethnicity: null as string | null,
  academicGPA: null as number | null,
  geographicRestrictions: null as string | null,
  essayRequired: null as boolean | null,
  recommendationRequired: null as boolean | null,
  deadlineRange: null as { startDate?: string; endDate?: string } | null,
  deadlineWithinDays: null as number | null
}

const hasActiveSearchCriteria = computed(() => {
  return searchCriteriaRef.value?.getActiveFiltersCount() > 0
})

const handleSearch = async () => {
  // Clear previous results and close search criteria
  searchResults.value = []
  searching.value = true
  hasSearched.value = true
  
  // Close the search criteria component
  searchCriteriaRef.value?.close()
  
  try {
    const searchCriteria = searchCriteriaRef.value?.localSearchCriteria || defaultSearchCriteria
    const { cleaned, error, invalidFields } = validateAndCleanSearchCriteria(searchCriteria)
    if (error) {
      const fieldList = invalidFields && invalidFields.length > 0 ? `\nInvalid field(s): ${invalidFields.join(', ')}` : ''
      alert(`${error}${fieldList}`) // Replace with better UI notification if desired
      searching.value = false
      return
    }
    const results = await apiService.findScholarships(cleaned, maxSearchResults.value)
    searchResults.value = results
    searching.value = false
  } catch (error) {
    console.error('Search failed:', error)
    // Handle error - could show notification here
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