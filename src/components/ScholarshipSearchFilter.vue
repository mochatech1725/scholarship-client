<template>
  <q-card class="q-pa-sm">
    <q-card-section class="q-pa-sm">
      <div class="text-subtitle1 q-mb-sm">Filter</div>
      <div class="q-gutter-y-sm">
        <q-input
          v-model="searchQuery"
          label="Search"
          clearable
          dense
          @update:model-value="onSearch"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-select
          v-model="filters.educationLevel"
          :options="educationLevelOptions"
          label="Education Level"
          clearable
          dense
          @update:model-value="onSearch"
        />

        <q-select
          v-model="filters.amount"
          :options="amountOptions"
          label="Minimum Amount"
          clearable
          dense
          @update:model-value="onSearch"
        />

        <q-select
          v-model="filters.deadline"
          :options="deadlineOptions"
          label="Application Deadline"
          clearable
          dense
          @update:model-value="onSearch"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')
const filters = ref({
  educationLevel: null,
  amount: null,
  deadline: null
})

const educationLevelOptions = [
  'High School Senior',
  'College Freshman',
  'College Sophomore',
  'College Junior',
  'College Senior',
  'Graduate Student'
]

const amountOptions = [
  { label: '$1,000+', value: 1000 },
  { label: '$5,000+', value: 5000 },
  { label: '$10,000+', value: 10000 },
  { label: '$25,000+', value: 25000 }
]

const deadlineOptions = [
  { label: 'Next 7 days', value: 7 },
  { label: 'Next 30 days', value: 30 },
  { label: 'Next 90 days', value: 90 }
]

const emit = defineEmits(['search'])

const onSearch = () => {
  emit('search', {
    query: searchQuery.value,
    ...filters.value
  })
}
</script> 