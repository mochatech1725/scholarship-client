<template>
  <q-page class="q-pa-lg">
    <div class="row q-mb-md items-center justify-between">
      <div class="text-h5">{{ isEdit ? 'Edit Recommender' : 'New Recommender' }}</div>
      <q-btn
        flat
        color="primary"
        icon="arrow_back"
        label="Back"
        :to="{ name: 'recommendersList' }"
      />
    </div>

    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <q-card class="q-pa-md">
          <q-card-section>
            <RecommenderForm
          :initial-data="formData"
          :loading="loading"
          @submit="onSubmit"
          @cancel="onCancel"
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
import { useRecommenderStore } from 'src/stores/recommender.store'
import type { Recommender } from 'src/types'
import RecommenderForm from 'src/components/RecommenderForm.vue'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const recommenderStore = useRecommenderStore()
const loading = ref(false)
const isEdit = ref(false)
const formData = ref<Omit<Recommender, 'recommenderId' | 'created'> & { emailAddress: string; phoneNumber: string }>({
  firstName: '',
  lastName: '',
  relationship: '',
  emailAddress: '',
  phoneNumber: ''
})

const loadRecommender = async (id: string) => {
  try {
    const recommenders = await recommenderStore.getRecommenders()
    const recommender = recommenders.find(r => r.recommenderId === id)
    if (recommender) {
      formData.value = {
        firstName: recommender.firstName,
        lastName: recommender.lastName,
        relationship: recommender.relationship,
        emailAddress: recommender.emailAddress,
        phoneNumber: recommender.phoneNumber
      }
    }
  } catch (err) {
    console.error('Failed to load recommender:', err)
    $q.notify({
      type: 'negative',
      message: 'Failed to load recommender'
    })
  }
}

const onSubmit = async (form: Omit<Recommender, 'recommenderId' | 'created'> & { emailAddress: string; phoneNumber: string }) => {
  try {
    loading.value = true
    if (isEdit.value) {
      const id = route.params.recommenderId as string
      await recommenderStore.updateRecommender(id, form)
      $q.notify({
        type: 'positive',
        message: 'Recommender updated successfully'
      })
    } else {
      await recommenderStore.createRecommender(form)
      $q.notify({
        type: 'positive',
        message: 'Recommender created successfully'
      })
    }
    await router.push({ name: 'recommendersList' })
  } catch {
    $q.notify({
      type: 'negative',
      message: `Failed to ${isEdit.value ? 'update' : 'create'} recommender`
    })
  } finally {
    loading.value = false
  }
}

const onCancel = async () => {
  await router.push({ name: 'recommendersList' })
}

onMounted(async () => {
  const { recommenderId } = route.params
  if (recommenderId && recommenderId !== 'new') {
    isEdit.value = true
    await loadRecommender(recommenderId as string)
  }
})
</script>

<style scoped>
.max-width-300 {
  max-width: 300px;
}
</style> 