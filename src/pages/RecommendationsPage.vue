<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <Recommendations 
          :application="application" 
          :recommenders="recommenders"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Application, Recommender } from 'src/types'
import { useRecommenderStore } from 'src/stores/recommender.store'
import Recommendations from 'src/components/Recommendations.vue'

const props = defineProps<{
  application: Application | null
}>()

const application = computed(() => props.application)
const recommenderStore = useRecommenderStore()
const recommenders = ref<Recommender[]>([])

const loadRecommenders = async () => {
  try {
    const auth_user_id = props.application?.student_id || '' // Default fallback
    recommenders.value = await recommenderStore.getRecommendersByUserId(auth_user_id)
  } catch (error) {
    console.error('Failed to load recommenders:', error)
  }
}

onMounted(async () => {
  await loadRecommenders()
})
</script> 