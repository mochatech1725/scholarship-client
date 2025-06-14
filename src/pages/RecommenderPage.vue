<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="q-pa-md">
          <q-card-section>
            <RecommenderForm 
            :is-edit="isEdit" 
            :recommender="recommender"
            @cancel="handleCancel" />
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
import RecommenderForm from 'src/components/RecommenderForm.vue'
import { useRecommenderStore } from 'src/stores/recommender.store'
import type { Recommender } from 'src/types'

const $q = useQuasar()
const recommenderStore = useRecommenderStore()

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const isEdit = ref(route.params.recommenderId !== undefined)
const recommender = ref<Recommender | null>(null)

const handleCancel = () => {
  router.back()
}


const loadData = async () => {
  if (isEdit.value) {
    try {
      loading.value = true
      if (route.params.recommenderId) {
        recommender.value = await recommenderStore.getRecommenderById(route.params.recommenderId as string)
      }
    } catch (err) {
      console.error('Failed to load recommender:', err)
      $q.notify({
        type: 'negative',
        message: 'Failed to load recommender'
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