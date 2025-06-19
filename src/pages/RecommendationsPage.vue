<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <Recommendations :application="application" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Application } from 'src/types'
import Recommendations from 'src/components/Recommendations.vue'

const props = defineProps<{
  application: Application | null
}>()

const application = computed(() => props.application)
</script> 