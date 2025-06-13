<template>
  <div class="application-filters" :class="{ expanded: isExpanded }">
    <q-card class="q-pa-md">
      <div class="row items-center justify-between q-mb-md">
        <div class="text-h6">Filters</div>
        <q-btn
          flat
          round
          :icon="isExpanded ? 'chevron_left' : 'chevron_right'"
          @click="isExpanded = !isExpanded"
        />
      </div>

      <q-slide-transition>
        <div v-show="isExpanded" class="filter-content">
          <div class="q-gutter-y-md">
            <q-select
              v-model="localFilters.status"
              :options="statusOptions"
              label="Status"
              clearable
              outlined
              dense
            />

            <q-input
              v-model="localFilters.company"
              label="Company Name"
              clearable
              outlined
              dense
            />

            <q-input
              v-model="localFilters.dueDate"
              label="Due Date"
              type="date"
              outlined
              dense
            />
          </div>
        </div>
      </q-slide-transition>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const isExpanded = ref(true)

const props = defineProps<{
  filters: {
    status: string | null
    company: string
    dueDate: string | null
  }
  statusOptions: string[]
}>()

const emit = defineEmits<{
  'update:filters': [value: typeof props.filters]
}>()

const localFilters = ref({ ...props.filters })

watch(localFilters, (newValue) => {
  emit('update:filters', newValue)
}, { deep: true })

watch(() => props.filters, (newValue) => {
  localFilters.value = { ...newValue }
}, { deep: true })
</script>

<style scoped>
.application-filters {
  width: 300px;
  position: sticky;
  top: 20px;
  transition: width 0.3s ease;
}

.application-filters:not(.expanded) {
  width: 120px;
}

.filter-content {
  min-width: 280px;
}
</style> 