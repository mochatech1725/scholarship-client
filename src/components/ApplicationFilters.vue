<template>
  <div class="application-filters" :class="{ expanded: isExpanded }">
    <q-card class="q-pa-sm">
      <div class="row items-center justify-between q-mb-sm">
        <div class="text-h6">Filters</div>
        <q-btn
          flat
          round
          :icon="isExpanded ? 'expand_less' : 'expand_more'"
          @click="isExpanded = !isExpanded"
        />
      </div>

      <q-slide-transition>
        <div v-show="isExpanded" class="filter-content">
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-sm-6 col-md-2 col-lg-2">
              <div class="form-label">Status</div>
              <q-select
                v-model="localFilters.status"
                :options="statusOptions"
                clearable
                flat
                dense
                class="q-mb-sm"
              />
            </div>

            <div class="col-12 col-sm-6 col-md-3 col-lg-3">
              <div class="form-label">Company Name</div>
              <q-input
                v-model="localFilters.company"
                clearable
                flat
                dense
                class="q-mb-sm"
              />
            </div>

            <div class="col-12 col-sm-6 col-md-4 col-lg-4">
              <div class="form-label">Due Date Range</div>
              <q-input
                :model-value="dateRangeDisplay"
                flat
                dense
                readonly
                class="q-mb-sm"
                placeholder="Select date range"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date
                        v-model="dateRange"
                        range
                        mask="MM/DD/YYYY"
                        today-btn
                        @update:model-value="onDateRangeChange"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <div class="col-12 col-sm-6 col-md-3 col-lg-3">
              <div class="form-label">&nbsp;</div>
              <q-btn
                label="Clear All"
                color="grey-6"
                flat
                dense
                @click="clearAllFilters"
                class="q-mb-sm"
              />
            </div>
          </div>
        </div>
      </q-slide-transition>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { formatDate } from 'src/utils/helper'

const isExpanded = ref(true)

const props = defineProps<{
  filters: {
    status: string | null
    company: string
    dueDateFrom: string | null
    dueDateTo: string | null
  }
  statusOptions: string[]
}>()

const emit = defineEmits<{
  'update:filters': [value: typeof props.filters]
}>()

const localFilters = ref({ ...props.filters })

// Date range picker
const dateRange = ref<{ from: string; to: string } | null>(null)

const dateRangeDisplay = computed(() => {
  if (!dateRange.value?.from && !dateRange.value?.to) return ''
  
  if (dateRange.value?.from && dateRange.value?.to) {
    return `${formatDate(dateRange.value.from)} to ${formatDate(dateRange.value.to)}`
  }
  if (dateRange.value?.from) return `From ${formatDate(dateRange.value.from)}`
  if (dateRange.value?.to) return `To ${formatDate(dateRange.value.to)}`
  return ''
})

const onDateRangeChange = (newRange: { from: string; to: string } | null) => {
  dateRange.value = newRange
  localFilters.value.dueDateFrom = newRange?.from || null
  localFilters.value.dueDateTo = newRange?.to || null
}

// Initialize date range from filters
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
  if (newFilters.dueDateFrom || newFilters.dueDateTo) {
    dateRange.value = {
      from: newFilters.dueDateFrom || '',
      to: newFilters.dueDateTo || ''
    }
  } else {
    dateRange.value = null
  }
}, { deep: true, immediate: true })

watch(localFilters, (newValue) => {
  emit('update:filters', newValue)
}, { deep: true })

const clearAllFilters = () => {
  localFilters.value = {
    status: null,
    company: '',
    dueDateFrom: null,
    dueDateTo: null
  }
  dateRange.value = null
}
</script>

<style scoped>
.application-filters {
  width: 100%;
  margin-bottom: 16px;
}

.filter-content {
  min-width: 100%;
}
</style> 