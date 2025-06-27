<template>
  <div class="application-filters" :class="{ expanded: isExpanded }">
    <q-card class="q-pa-sm">
      <q-card-section class="q-pb-none">
        <div class="row items-center justify-between">
          <div class="text-h6">Filters</div>
          <q-btn
            flat
            round
            :icon="isExpanded ? 'expand_less' : 'expand_more'"
            @click="isExpanded = !isExpanded"
          />
        </div>
      </q-card-section>

      <q-slide-transition>
        <q-card-section v-show="isExpanded" class="q-pt-sm">
          <div class="row items-end q-gutter-sm">
            <div class="col-auto">
              <div class="form-label text-caption">Status</div>
              <q-select
                v-model="localFilters.status"
                :options="statusOptions"
                clearable
                flat
                dense
                emit-value
                map-options
                style="min-width: 160px"
              />
            </div>

            <div class="col-auto">
              <div class="form-label text-caption">Company</div>
              <q-input
                v-model="localFilters.company"
                clearable
                flat
                dense
                style="min-width: 220px"
              />
            </div>

            <div class="col">
              <div class="form-label text-caption">Due Date Range</div>
              <q-input
                :model-value="dateRangeDisplay"
                flat
                dense
                readonly
                placeholder="Select date range"
                style="min-width: 200px"
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

            <div class="col-auto">
              <q-btn
                label="Clear All"
                color="grey-6"
                flat
                dense
                @click="clearAllFilters"
              />
            </div>
          </div>
        </q-card-section>
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

@media (max-width: 768px) {
  .application-filters .row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .application-filters .col-auto {
    width: 100%;
    margin-bottom: 8px;
  }
  
  .application-filters .col {
    width: 100%;
    margin-bottom: 8px;
  }
}

.form-label {
  margin-bottom: 2px;
  font-weight: 500;
}
</style> 