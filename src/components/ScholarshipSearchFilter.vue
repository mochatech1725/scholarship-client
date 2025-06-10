<template>
  <div class="text-h6 q-mb-md">Search Filter</div>

  <q-card class="q-pa-sm">
    <q-card-section class="q-pa-sm">
      <div class="row items-center q-gutter-x-md">
        <q-input
          v-model="searchQuery"
          label="Search"
          clearable
          dense
          class="col-6"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-select
          v-model="filters.theme"
          :options="themeOptions"
          label="Theme"
          clearable
          dense
          class="col-2"
        />

        <q-select
          v-model="filters.targetType"
          :options="targetTypeOptions"
          label="Target Type"
          clearable
          dense
          class="col-2"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { targetTypeOptions } from 'src/types'

const searchQuery = ref('')
const filters = ref({
  theme: null,
  targetType: null
})

const themeOptions = [
  'STEM',
  'Arts',
  'Business',
  'Education',
  'Healthcare',
  'Humanities',
  'Social Sciences',
  'Sports',
  'Technology'
]

const emit = defineEmits(['search'])

// Debounce function
const debounce = <T extends (...args: unknown[]) => void>(fn: T, delay: number): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// Debounced search function
const debouncedSearch = debounce(() => {
  emit('search', {
    query: searchQuery.value,
    ...filters.value
  })
}, 300)

// Watch for changes in search query and filters
watch([searchQuery, () => filters.value], () => {
  debouncedSearch()
}, { deep: true })

// Remove the onSearch function since we're using watchers now
</script> 