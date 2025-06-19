<template>
  <div v-if="props.name" class="scholarship-banner q-px-xl q-py-sm bg-grey-2">
    <div class="text-subtitle1 text-grey-8">
      <span class="text-primary">Current Scholarship</span>: {{ props.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
}>()
</script>

<style scoped>
.scholarship-banner {
  border-bottom: 1px solid #e0e0e0;
}
</style> 