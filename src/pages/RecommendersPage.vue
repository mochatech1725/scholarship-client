<template>
  <q-page padding>
    <div class="row q-mb-md items-center justify-between">
      <div class="text-h5">Recommenders</div>
      <q-btn
        color="primary"
        icon="add"
        label="Add Recommender"
        :to="{ name: 'recommenderCreate' }"
      />
    </div>

    <q-table
      :rows="recommenders"
      :columns="columns"
      row-key="recommenderId"
      :loading="loading"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn-group flat>
            <q-btn
              flat
              round
              color="primary"
              icon="edit"
              :to="{ name: 'recommenderEdit', params: { recommenderId: props.row.recommenderId } }"
            />
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              @click="confirmDelete(props.row)"
            />
          </q-btn-group>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">Are you sure you want to delete this recommender?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="deleteRecommender" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRecommenderStore } from 'src/stores/recommender.store'
import type { Recommender } from 'src/types'

const $q = useQuasar()
const recommenderStore = useRecommenderStore()
const loading = ref(false)
const recommenders = ref<Recommender[]>([])
const showDeleteDialog = ref(false)
const selectedRecommender = ref<Recommender | null>(null)

const columns = [
  {
    name: 'name',
    label: 'Name',
    field: (row: Recommender) => `${row.firstName} ${row.lastName}`,
    align: 'left' as const
  },
  {
    name: 'relationship',
    label: 'Relationship',
    field: 'relationship',
    align: 'left' as const
  },
  {
    name: 'created',
    label: 'Created',
    field: 'created',
    align: 'left' as const,
    format: (val: string) => new Date(val).toLocaleDateString()
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'center' as const
  }
]

const loadRecommenders = async () => {
  try {
    loading.value = true
    recommenders.value = await recommenderStore.getRecommenders()
  } catch (err) {
    console.error('Failed to load recommenders:', err)
    $q.notify({
      type: 'negative',
      message: 'Failed to load recommenders'
    })
  } finally {
    loading.value = false
  }
}

const confirmDelete = (recommender: Recommender) => {
  selectedRecommender.value = recommender
  showDeleteDialog.value = true
}

const deleteRecommender = async () => {
  if (!selectedRecommender.value) return

  try {
    await recommenderStore.deleteRecommender(selectedRecommender.value.recommenderId!)
    $q.notify({
      type: 'positive',
      message: 'Recommender deleted successfully'
    })
    await loadRecommenders()
  } catch (err) {
    console.error('Failed to delete recommender:', err)
    $q.notify({
      type: 'negative',
      message: 'Failed to delete recommender'
    })
  }
}

onMounted(() => {
  void loadRecommenders()
})
</script> 