<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="q-pa-md">
          <q-card-section>
            <RecommendationForm 
              :is-edit="isEdit" 
              :loading="loading"
              :recommendation="recommendation"
              @submit="handleSubmit"
              @cancel="handleCancel" 
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import RecommendationForm from 'src/components/RecommendationForm.vue'
import { useRecommendationStore } from 'src/stores/recommendation.store'
import type { Recommendation } from 'src/types'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const recommendationStore = useRecommendationStore()

const loading = ref(false)
const isEdit = ref(route.params.recommendationId !== undefined)
const recommendation = ref<Recommendation | null>(null)

const handleSubmit = async (form: Omit<Recommendation, 'created'>) => {
  try {
    if (isEdit.value) {
      await recommendationStore.updateRecommendation(route.params.recommendationId as string, form)
      $q.notify({
        type: 'positive',
        message: 'Recommendation updated successfully'
      })
    } else {
      const newRecommendation: Omit<Recommendation, 'recommendationId'> = {
        ...form,
        created: new Date().toISOString()
      }
      await recommendationStore.createRecommendation(newRecommendation)
      $q.notify({
        type: 'positive',
        message: 'Recommendation created successfully'
      })
    }
    router.back()
  } catch (err) {
    console.error('Failed to save recommendation:', err)
    $q.notify({
      type: 'negative',
      message: 'Failed to save recommendation'
    })
  } 
}

const handleCancel = () => {
  router.back()
}

const loadData = async () => {
  if (isEdit.value) {
    try {
      loading.value = true
      if (route.params.recommendationId) {
        recommendation.value = await recommendationStore.getRecommendation(route.params.recommendationId as string)
      }
    } catch (err) {
      console.error('Failed to load essay:', err)
      $q.notify({
        type: 'negative',
        message: 'Failed to load essay'
      })
    } finally {
      loading.value = false
    }
  }
}

onMounted(async () => {
  await loadData()
})

</script> 