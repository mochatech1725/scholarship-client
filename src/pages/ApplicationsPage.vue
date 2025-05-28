<template>
  <q-page padding>
    <div class="row q-mb-md items-center justify-between">
      <div class="text-h5">Scholarship Applications</div>
      <q-btn
        color="primary"
        icon="add"
        label="New Application"
        to="/applications/new"
      />
    </div>

    <q-table
      :rows="applications"
      :columns="columns"
      row-key="scholarshipId"
      :loading="loading"
      v-model:pagination="pagination"
      :filter="filter"
    >
      <template v-slot:top-right>
        <q-input
          v-model="filter"
          placeholder="Search"
          dense
          debounce="300"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip
            :color="getStatusColor(props.value)"
            text-color="white"
            dense
          >
            {{ props.value }}
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
            :to="`/applications/${props.row.scholarshipId}`"
          />
          <q-btn
            flat
            round
            color="negative"
            icon="delete"
            @click="confirmDelete(props.row)"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="deleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">Are you sure you want to delete this application?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="deleteApplication" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

interface Application {
  scholarshipId: string
  scholarshipName: string
  company: string
  amount: number
  dueDate: string
  status: string
  currentAction: string
}

const $q = useQuasar()
const loading = ref(false)
const applications = ref<Application[]>([])
const filter = ref('')
const deleteDialog = ref(false)
const applicationToDelete = ref<Application | null>(null)

const pagination = ref({
  sortBy: 'dueDate',
  descending: true,
  page: 1,
  rowsPerPage: 10
})

const columns = [
  {
    name: 'scholarshipName',
    required: true,
    label: 'Scholarship',
    align: 'left' as const,
    field: 'scholarshipName',
    sortable: true
  },
  {
    name: 'company',
    required: true,
    label: 'Organization',
    align: 'left' as const,
    field: 'company',
    sortable: true
  },
  {
    name: 'amount',
    required: true,
    label: 'Amount',
    align: 'right' as const,
    field: 'amount',
    format: (val: number) => `$${val.toLocaleString()}`,
    sortable: true
  },
  {
    name: 'dueDate',
    required: true,
    label: 'Due Date',
    align: 'left' as const,
    field: 'dueDate',
    format: (val: string) => new Date(val).toLocaleDateString(),
    sortable: true
  },
  {
    name: 'status',
    required: true,
    label: 'Status',
    align: 'left' as const,
    field: 'status',
    sortable: true
  },
  {
    name: 'currentAction',
    required: true,
    label: 'Current Action',
    align: 'left' as const,
    field: 'currentAction',
    sortable: true
  },
  {
    name: 'actions',
    required: true,
    label: 'Actions',
    align: 'center' as const,
    field: 'actions'
  }
]

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'submitted':
      return 'positive'
    case 'in progress':
      return 'warning'
    case 'not started':
      return 'grey'
    case 'rejected':
      return 'negative'
    default:
      return 'grey'
  }
}

const loadApplications = async () => {
  loading.value = true
  try {
    // TODO: Implement API call
    // For now, using mock data
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
    applications.value = [
      {
        scholarshipId: '1',
        scholarshipName: 'STEM Excellence Scholarship',
        company: 'Tech Foundation',
        amount: 10000,
        dueDate: '2024-05-01',
        status: 'In Progress',
        currentAction: 'Complete Essay'
      },
      {
        scholarshipId: '2',
        scholarshipName: 'Arts Achievement Award',
        company: 'Creative Arts Society',
        amount: 5000,
        dueDate: '2024-04-15',
        status: 'Not Started',
        currentAction: 'Start Application'
      }
    ]
  } catch (err) {
    console.error('Failed to load applications:', err)
    $q.notify({
      color: 'negative',
      message: 'Failed to load applications'
    })
  } finally {
    loading.value = false
  }
}

const confirmDelete = (application: Application) => {
  applicationToDelete.value = application
  deleteDialog.value = true
}

const deleteApplication = async () => {
  if (!applicationToDelete.value) return

  try {
    // TODO: Implement API call
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
    applications.value = applications.value.filter(
      app => app.scholarshipId !== applicationToDelete.value?.scholarshipId
    )
    $q.notify({
      color: 'positive',
      message: 'Application deleted successfully'
    })
  } catch (err) {
    console.error('Failed to delete application:', err)
    $q.notify({
      color: 'negative',
      message: 'Failed to delete application'
    })
  }
}

onMounted(() => {
  void loadApplications()
})
</script> 