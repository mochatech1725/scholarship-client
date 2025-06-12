<template>
  <q-page padding>
    <div class="text-h5 q-mb-lg">Recommenders</div>

    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-table
          :rows="recommenders"
          :columns="columns"
          row-key="recommenderId"
          flat
          bordered
          dense
          :pagination="{ rowsPerPage: 0 }"
          :loading="loading"
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-xs">
              <q-btn
                flat
                round
                color="primary"
                icon="edit"
                :to="{ name: 'recommenderEdit', params: { recommenderId: props.row.recommenderId } }"
                dense
                size="sm"
              />
              <q-btn
                flat
                round
                color="negative"
                icon="delete"
                @click="confirmDelete(props.row)"
                dense
                size="sm"
              />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

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
import type { Recommender } from 'src/types'
import { useRecommenderStore } from 'src/stores/recommender.store'

const $q = useQuasar()
const recommenderStore = useRecommenderStore()
const recommenders = ref<Recommender[]>([])
const loading = ref(false)

const columns = [
  {
    name: 'name',
    label: 'Name',
    field: (row: Recommender) => `${row.firstName} ${row.lastName}`,
    align: 'left' as const,
    style: 'width: 150px'
  },
  {
    name: 'email',
    label: 'Email',
    field: 'emailAddress',
    align: 'left' as const,
    style: 'width: 200px'
  },
  {
    name: 'phone',
    label: 'Phone',
    field: 'phoneNumber',
    align: 'left' as const,
    style: 'width: 120px'
  },
  {
    name: 'relationship',
    label: 'Relationship',
    field: 'relationship',
    align: 'left' as const,
    style: 'width: 150px'
  },
  {
    name: 'actions',
    label: '',
    field: 'actions',
    align: 'center' as const,
    style: 'width: 80px'
  }
]

const showDeleteDialog = ref(false)
const recommenderToDelete = ref<Recommender | null>(null)

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
  recommenderToDelete.value = recommender
  showDeleteDialog.value = true
}

const deleteRecommender = () => {
  if (recommenderToDelete.value) {
    // TODO: Implement actual delete logic
    recommenders.value = recommenders.value.filter(r => r.recommenderId !== recommenderToDelete.value?.recommenderId)
    $q.notify({
      type: 'positive',
      message: 'Recommender deleted successfully'
    })
  }
}

onMounted(() => {
  void loadRecommenders()
})
</script> 