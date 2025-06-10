<template>
  <div v-if="show" class="scholarship-banner q-px-xl q-py-sm bg-grey-2">
    <div class="text-subtitle1 text-grey-8">
      Current Scholarship: {{ scholarshipContextStore.currentScholarshipName }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useScholarshipContextStore } from 'stores/scholarship-context.store'

const route = useRoute()
const scholarshipContextStore = useScholarshipContextStore()

const show = computed(() => {
  return route.name === 'applicationEdit' || 
         route.name === 'applicationCreate' ||
         route.name === 'essayEdit' ||
         route.name === 'essayCreate' ||
         route.name === 'recommendationEdit' ||
         route.name === 'recommendationCreate'
})
</script>

<style scoped>
.scholarship-banner {
  border-bottom: 1px solid #e0e0e0;
}
</style> 