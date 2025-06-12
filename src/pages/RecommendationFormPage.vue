<template>
  <q-page class="q-pa-lg">
    <div class="row q-mb-md items-center justify-between">
      <div class="text-h5">{{ isEdit ? 'Edit Recommendation' : 'New Recommendation' }}</div>
      <q-btn
        flat
        color="primary"
        icon="arrow_back"
        label="Back"
        to="{ name: 'applicationsList' }"
      />
    </div>

    <div class="row justify-center">
      <div class="col-12 col-md-6 col-lg-4">
        <q-card class="q-pa-md">
          <q-card-section>
            <RecommendationForm :is-edit="isEdit" @cancel="handleCancel" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RecommendationForm from 'src/components/RecommendationForm.vue'

const route = useRoute()
const router = useRouter()
const isEdit = ref(route.params.id !== undefined)

const handleCancel = () => {
  router.back()
}
</script>

<style scoped>
.max-width-300 {
  max-width: 300px;
}
</style> 