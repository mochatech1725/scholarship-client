<template>
  <q-page padding>
    <div class="text-h5 q-mb-lg">Recommenders</div>

    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-table
          :rows="recommenders"
          :columns="columns"
          row-key="id"
          flat
          bordered
          :pagination="{ rowsPerPage: 0 }"
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip
                :color="getStatusColor(props.row.status)"
                text-color="white"
                dense
                class="q-ml-sm"
              >
                {{ props.row.status }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-sm">
              <q-btn
                flat
                round
                color="primary"
                icon="edit"
                :to="`/recommenders/${props.row.id}/edit`"
                dense
              />
              <q-btn
                flat
                round
                color="negative"
                icon="delete"
                @click="confirmDelete(props.row)"
                dense
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
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

interface Recommender {
  id: string
  firstName: string
  lastName: string
  email: string
  organization: string
  title: string
  status: string
}

const recommenders = ref<Recommender[]>([
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    organization: 'University of Technology',
    title: 'Professor',
    status: 'Active'
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    organization: 'Tech Institute',
    title: 'Department Head',
    status: 'Pending'
  }
])

const columns = [
  {
    name: 'name',
    label: 'Name',
    field: (row: Recommender) => `${row.firstName} ${row.lastName}`,
    align: 'left' as const
  },
  {
    name: 'email',
    label: 'Email',
    field: 'email',
    align: 'left' as const
  },
  {
    name: 'organization',
    label: 'Organization',
    field: 'organization',
    align: 'left' as const
  },
  {
    name: 'title',
    label: 'Title',
    field: 'title',
    align: 'left' as const
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'center' as const
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'center' as const
  }
]

const showDeleteDialog = ref(false)
const recommenderToDelete = ref<Recommender | null>(null)

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'positive'
    case 'pending':
      return 'warning'
    case 'inactive':
      return 'negative'
    default:
      return 'grey'
  }
}

const confirmDelete = (recommender: Recommender) => {
  recommenderToDelete.value = recommender
  showDeleteDialog.value = true
}

const deleteRecommender = () => {
  if (recommenderToDelete.value) {
    // TODO: Implement actual delete logic
    recommenders.value = recommenders.value.filter(r => r.id !== recommenderToDelete.value?.id)
    $q.notify({
      type: 'positive',
      message: 'Recommender deleted successfully'
    })
  }
}
</script> 