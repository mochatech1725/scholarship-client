<template>
  <q-page class="q-pa-lg">
    <div class="row q-mb-md items-center justify-between">
      <div class="text-h5">{{ isEdit ? 'Edit Recommendation' : 'New Recommendation' }}</div>
      <q-btn
        flat
        color="primary"
        icon="arrow_back"
        label="Back"
        to="/dashboard/applications"
      />
    </div>

    <div class="row justify-center">
      <div class="col-12 col-md-6 col-lg-4">
        <q-card class="q-pa-md">
          <q-card-section>
            <Recommendation :is-edit="isEdit" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import Recommendation from 'components/Recommendation.vue'

const route = useRoute()
const isEdit = ref(!!route.params.recommendationId)
</script>

<style scoped>
.max-width-300 {
  max-width: 300px;
}
</style> 