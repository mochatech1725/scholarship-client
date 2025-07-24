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
    subject_areas: Array.isArray(criteria.subject_areas)
      ? criteria.subject_areas.map((s: string) => (typeof s === 'string' ? s.trim() : s))
      : [],
    academic_level: trimOrNull(criteria.academic_level),
    target_type: trimOrNull(criteria.target_type),
    gender: trimOrNull(criteria.gender),
    ethnicity: trimOrNull(criteria.ethnicity),
    geographic_restrictions: trimOrNull(criteria.geographic_restrictions),
    academic_gpa: criteria.academic_gpa,
    essay_required: criteria.essay_required,
    recommendation_required: criteria.recommendation_required,
    deadline_range: (() => {
      if (!criteria.deadline_range) return {};
      const dr: { start_date?: string; end_date?: string } = {};
      const s = criteria.deadline_range.start_date !== undefined ? trimOrNull(criteria.deadline_range.start_date ?? null) ?? undefined : undefined;
      const e = criteria.deadline_range.end_date !== undefined ? trimOrNull(criteria.deadline_range.end_date ?? null) ?? undefined : undefined;
      if (s !== undefined) dr.start_date = s;
      if (e !== undefined) dr.end_date = e;
      return dr;
    })(),
    ...((criteria.deadline_within_days !== undefined) ? { deadline_within_days: criteria.deadline_within_days } : {}),
  };

  // Validate dates if present
  const invalidFields: string[] = [];
  let error: string | undefined;
  if (cleaned.deadline_range) {
    const { start_date, end_date } = cleaned.deadline_range;
    let start: Date | undefined, end: Date | undefined;
    if (start_date) {
      start = new Date(start_date);
      if (isNaN(start.getTime())) {
        error = 'Invalid start date format.';
        invalidFields.push('deadline_range.start_date');
      }
    }
    if (end_date) {
      end = new Date(end_date);
      if (isNaN(end.getTime())) {
        error = error ? error + ' Invalid end date format.' : 'Invalid end date format.';
        invalidFields.push('deadline_range.end_date');
      }
    }
    if (start && end && end <= start) {
      error = 'End date must be after start date.';
      invalidFields.push('deadline_range.end_date', 'deadline_range.start_date');
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
  subject_areas: [] as string[],
  academic_level: null as string | null,
  target_type: null as string | null,
  gender: null as string | null,
  ethnicity: null as string | null,
  academic_gpa: null as number | null,
  geographic_restrictions: null as string | null,
  essay_required: null as boolean | null,
  recommendation_required: null as boolean | null,
  deadline_range: null as { start_date?: string; end_date?: string } | null,
  deadline_within_days: null as number | null
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