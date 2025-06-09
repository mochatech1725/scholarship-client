<template>
  <q-page padding>
    <div class="row q-mb-md items-center justify-between">
      <div class="text-h5">Applications</div>
      <q-btn
        color="primary"
        icon="add"
        label="New Application"
        to="/dashboard/application-form"
      />
    </div>

    <!-- Filters -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-4">
            <q-select
              v-model="filters.status"
              :options="statusOptions"
              label="Status"
              clearable
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              v-model="filters.companyName"
              label="Company Name"
              clearable
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-select
              v-model="filters.dateRange"
              :options="dateRangeOptions"
              label="Date Range"
              clearable
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Applications List -->
    <q-card>
      <q-table
        :rows="filteredApplications"
        :columns="columns"
        row-key="id"
        :loading="loading"
        v-model:pagination="pagination"
      >
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
              :to="`/dashboard/application-form/${props.row.id}`"
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
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import type { QTableColumn } from 'quasar'

interface Application {
  id: string
  companyName: string
  status: string
  openDate: string
  dueDate: string
  notes?: string
}

const $q = useQuasar()
const loading = ref(false)

const applications = ref<Application[]>([
  {
    id: '1',
    companyName: 'Google',
    status: 'Applied',
    openDate: '2024-03-01',
    dueDate: '2024-04-01',
    notes: 'Applied through company website'
  }
])

const filters = ref({
  status: null,
  companyName: '',
  dateRange: null
})

const statusOptions = ['Applied', 'Interview', 'Offer', 'Rejected', 'Draft']
const dateRangeOptions = ['Last 7 days', 'Last 30 days', 'Last 90 days']

const columns: QTableColumn[] = [
  { name: 'companyName', label: 'Company', field: 'companyName', sortable: true, align: 'left' },
  { name: 'status', label: 'Status', field: 'status', sortable: true, align: 'left' },
  { name: 'openDate', label: 'Open Date', field: 'openDate', sortable: true, align: 'left' },
  { name: 'dueDate', label: 'Due Date', field: 'dueDate', sortable: true, align: 'left' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
]

const pagination = ref({
  sortBy: 'dueDate',
  descending: true,
  page: 1,
  rowsPerPage: 10
})

const filteredApplications = computed(() => {
  return applications.value.filter(app => {
    if (filters.value.status && app.status !== filters.value.status) return false
    if (filters.value.companyName && !app.companyName.toLowerCase().includes(filters.value.companyName.toLowerCase())) return false
    // Add date range filtering logic here
    return true
  })
})

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Applied: 'blue',
    Interview: 'orange',
    Offer: 'green',
    Rejected: 'red',
    Draft: 'grey'
  }
  return colors[status] || 'grey'
}

const confirmDelete = (application: Application) => {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure you want to delete this application?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    deleteApplication(application)
  })
}

const deleteApplication = (application: Application) => {
  applications.value = applications.value.filter(app => app.id !== application.id)
  $q.notify({
    color: 'positive',
    message: 'Application deleted successfully'
  })
}
</script> 