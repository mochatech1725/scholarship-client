<template>
  <div class="application-filters" :class="{ expanded: isExpanded }">
    <q-card class="q-pa-md">
      <div class="row items-center justify-between q-mb-md">
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
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-3">
              <div class="text-caption q-mb-xs" style="color: var(--q-primary); font-weight: 600;">Status</div>
              <q-select
                v-model="localFilters.status"
                :options="statusOptions"
                clearable
                outlined
                dense
              />
            </div>

            <div class="col-12 col-md-3">
              <div class="text-caption q-mb-xs" style="color: var(--q-primary); font-weight: 600;">Company Name</div>
              <q-input
                v-model="localFilters.company"
                clearable
                outlined
                dense
              />
            </div>

            <div class="col-12 col-md-3">
              <div class="text-caption q-mb-xs" style="color: var(--q-primary); font-weight: 600;">Due Date</div>
              <q-input
                v-model="localFilters.dueDate"
                type="date"
                outlined
                dense
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
  width: 100%;
  margin-bottom: 16px;
}

.filter-content {
  min-width: 100%;
}
</style> 