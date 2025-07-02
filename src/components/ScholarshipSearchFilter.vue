<template>
  <div class="filters-sidebar">
    <!-- Collapsed State -->
    <div v-if="!isExpanded" class="filters-collapsed" @click="isExpanded = true">
      <span class="filters-text">Search Filters</span>
      <span class="filters-count">{{ activeFiltersCount }}</span>
    </div>

    <!-- Expanded State -->
    <div v-else class="filters-expanded">
      <div class="filters-header">
        <div class="filters-title">Search Filters</div>
        <q-btn
          flat
          round
          dense
          icon="close"
          @click="isExpanded = false"
        />
      </div>

      <div class="filters-content">
        <!-- Populate from Profile Checkbox -->
        <div class="filter-section">
          <q-checkbox
            v-model="populateFromProfile"
            label="Populate from Profile"
            @update:model-value="handlePopulateFromProfile"
            color="primary"
          />
        </div>

        <!-- Clear All Button -->
        <div class="filter-section">
          <div class="row justify-end">
            <q-btn
              flat
              round
              dense
              icon="refresh"
              @click="clearAllFilters"
              size="sm"
              color="grey-6"
              class="reset-btn"
              title="Clear all filters"
            />
          </div>
        </div>

        <!-- Search Query Filter -->
        <div class="filter-section">
          <div class="filter-label">Keywords</div>
          <q-input
            v-model="localFilters.keywords"
            clearable
            outlined
            dense
            placeholder="Search scholarships..."
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <!-- Subject Areas Filter -->
        <div class="filter-section">
          <div class="filter-label">Subject Areas</div>
          <q-select
            v-model="localFilters.subjectAreas"
            :options="subjectAreaOptions"
            multiple
            outlined
            dense
            emit-value
            map-options
            placeholder="All Subject Areas"
          />
        </div>

        <!-- Education Level Filter -->
        <div class="filter-section">
          <div class="filter-label">Education Level</div>
          <q-select
            v-model="localFilters.educationLevel"
            :options="educationLevelOptions"
            clearable
            outlined
            dense
            emit-value
            map-options
            placeholder="All Education Levels"
          />
        </div>

        <!-- Target Type Filter -->
        <div class="filter-section">
          <div class="filter-label">Target Type</div>
          <q-select
            v-model="localFilters.targetType"
            :options="targetTypeOptions"
            clearable
            outlined
            dense
            emit-value
            map-options
            placeholder="All Types"
          />
        </div>

        <!-- Gender Filter -->
        <div class="filter-section">
          <div class="filter-label">Gender</div>
          <q-select
            v-model="localFilters.gender"
            :options="genderOptions"
            clearable
            outlined
            dense
            emit-value
            map-options
            placeholder="All Genders"
          />
        </div>

        <!-- Ethnicity Filter -->
        <div class="filter-section">
          <div class="filter-label">Ethnicity</div>
          <q-select
            v-model="localFilters.ethnicity"
            :options="ethnicityOptions"
            clearable
            outlined
            dense
            emit-value
            map-options
            placeholder="All Ethnicities"
          />
        </div>

        <!-- Academic GPA Filter -->
        <div class="filter-section">
          <div class="filter-label">Minimum GPA</div>
          <q-input
            v-model.number="localFilters.academicGPA"
            type="number"
            step="0.1"
            min="0"
            max="4.0"
            outlined
            dense
            placeholder="Any GPA"
          />
        </div>

        <!-- State Filter -->
        <div class="filter-section">
          <div class="filter-label">State</div>
          <q-select
            v-model="localFilters.state"
            :options="stateOptions"
            clearable
            outlined
            dense
            emit-value
            map-options
            placeholder="All States"
          />
        </div>

        <!-- Essay Required Filter -->
        <div class="filter-section">
          <q-checkbox
            v-model="localFilters.essayRequired"
            label="Essay Required"
            :true-value="true"
            :false-value="null"
            color="primary"
          />
        </div>

        <!-- Recommendation Required Filter -->
        <div class="filter-section">
          <q-checkbox
            v-model="localFilters.recommendationRequired"
            label="Recommendation Required"
            :true-value="true"
            :false-value="null"
            color="primary"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, defineExpose } from 'vue'
import { useUserStore } from 'src/stores/user.store'
import { 
  educationLevelOptions, 
  targetTypeOptions, 
  subjectAreaOptions, 
  genderOptions, 
  ethnicityOptions
} from 'src/types'

// State options for the filter
const stateOptions = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
].map(state => ({ label: state, value: state }))

const isExpanded = ref(false)
const populateFromProfile = ref(false)
const userStore = useUserStore()

const props = defineProps<{
  searchCriteria: {
    keywords: string
    subjectAreas: string[]
    educationLevel: string | null
    targetType: string | null
    gender: string | null
    ethnicity: string | null
    academicGPA: number | null
    state: string | null
    essayRequired: boolean | null
    recommendationRequired: boolean | null
    deadlineRange?: {
      startDate?: string
      endDate?: string
    } | null
    deadlineWithinDays?: number | null
  }
}>()

const emit = defineEmits<{
  'update:searchCriteria': [value: typeof props.searchCriteria]
}>()

const localFilters = ref({ ...props.searchCriteria })

const activeFiltersCount = computed(() => {
  let count = 0
  if (localFilters.value.keywords) count++
  if (localFilters.value.subjectAreas && localFilters.value.subjectAreas.length > 0) count++
  if (localFilters.value.educationLevel) count++
  if (localFilters.value.targetType) count++
  if (localFilters.value.gender) count++
  if (localFilters.value.ethnicity) count++
  if (localFilters.value.academicGPA !== null && localFilters.value.academicGPA > 0) count++
  if (localFilters.value.state) count++
  if (localFilters.value.essayRequired === true) count++
  if (localFilters.value.recommendationRequired === true) count++
  
  // Debug logging
  console.log('Active filters count:', count, 'Filters:', localFilters.value)
  
  return count
})

// Watch for changes in props
watch(() => props.searchCriteria, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true, immediate: true })

// Watch for changes in local filters
watch(localFilters, (newValue) => {
  emit('update:searchCriteria', newValue)
}, { deep: true })

const handlePopulateFromProfile = (checked: boolean) => {
  if (checked && userStore.user?.profile?.userPreferences?.searchPreferences) {
    const profilePrefs = userStore.user.profile.userPreferences.searchPreferences
    
    // Populate filters from profile
    localFilters.value = {
      ...localFilters.value,
      subjectAreas: profilePrefs.subjectAreas || [],
      educationLevel: profilePrefs.educationLevel || null,
      targetType: profilePrefs.targetType || null,
      gender: profilePrefs.gender || null,
      ethnicity: profilePrefs.ethnicity || null,
      academicGPA: profilePrefs.academicGPA || null,
      state: null, // State is not in profile preferences, so keep as null
      essayRequired: profilePrefs.essayRequired,
      recommendationRequired: profilePrefs.recommendationRequired
    }
  } else if (!checked) {
    // Clear all filters when unchecked
    clearAllFilters()
  }
}

const clearAllFilters = () => {
  localFilters.value = {
    keywords: '',
    subjectAreas: [],
    educationLevel: null,
    targetType: null,
    gender: null,
    ethnicity: null,
    academicGPA: null,
    state: null,
    essayRequired: null,
    recommendationRequired: null,
    deadlineRange: null,
    deadlineWithinDays: null
  }
  populateFromProfile.value = false
}

// Expose methods and computed properties to parent components
defineExpose({
  activeFiltersCount,
  getActiveFiltersCount: () => activeFiltersCount.value,
  localFilters
})
</script>

<style scoped>
.filters-sidebar {
  position: relative;
  display: flex;
  justify-content: flex-end;
}

.filters-collapsed {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

.filters-collapsed:hover {
  background: #f5f5f5;
}

.filters-text {
  font-weight: 500;
  font-size: 0.875rem;
  color: #333;
}

.filters-count {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  border-radius: 50%;
  padding: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  min-width: 18px;
  height: 18px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 4px rgba(30, 64, 175, 0.3);
  transition: all 0.2s ease;
}

.filters-count:hover {
  transform: scale(1.1);
  box-shadow: 0 3px 6px rgba(30, 64, 175, 0.4);
  border-color: rgba(255, 255, 255, 0.5);
}

.filters-expanded {
  position: absolute;
  top: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 280px;
  max-width: 320px;
  z-index: 1000;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
}

.filters-title {
  font-weight: 600;
  font-size: 1rem;
  color: #333;
}

.filters-content {
  padding: 12px;
}

.filter-section {
  margin-bottom: 12px;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.filter-label {
  font-weight: 500;
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 6px;
}

@media (max-width: 768px) {
  .filters-expanded {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    max-width: 90vw;
    max-height: 80vh;
    overflow-y: auto;
  }
}

.reset-btn {
  background-color: #f5f5f5;
  transition: all 0.2s ease;
}

.reset-btn:hover {
  background-color: #e0e0e0;
  transform: scale(1.1);
  color: #666;
}

/* Make dropdowns more compact */
:deep(.q-select) {
  .q-field__control {
    min-height: 36px;
  }
  
  .q-field__control-container {
    padding-top: 4px;
    padding-bottom: 4px;
  }
}

:deep(.q-input) {
  .q-field__control {
    min-height: 36px;
  }
  
  .q-field__control-container {
    padding-top: 4px;
    padding-bottom: 4px;
  }
}
</style> 