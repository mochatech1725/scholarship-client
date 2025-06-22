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

            <div class="col-12 col-sm-6 col-md-3 col-lg-3">
              <div class="form-label">Due Date From</div>
              <q-input
                v-model="localFilters.dueDateFrom"
                type="date"
                flat
                dense
                class="q-mb-sm"
              />
            </div>

            <div class="col-12 col-sm-6 col-md-3 col-lg-3">
              <div class="form-label">Due Date To</div>
              <q-input
                v-model="localFilters.dueDateTo"
                type="date"
                flat
                dense
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
import { ref, watch } from 'vue'

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

watch(localFilters, (newValue) => {
  emit('update:filters', newValue)
}, { deep: true })

watch(() => props.filters, (newValue) => {
  localFilters.value = { ...newValue }
}, { deep: true })
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