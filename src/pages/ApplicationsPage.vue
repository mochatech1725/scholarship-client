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

    <div class="row q-col-gutter-md">
      <!-- Applications List -->
      <div class="col">
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
                  :to="`/dashboard/application-form/${props.row.applicationId}`"
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
      </div>

      <!-- Filters Sidebar -->
      <div class="col-auto">
        <ApplicationFilters
          v-model:filters="filters"
          :status-options="applicationStatusOptions"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import type { QTableColumn } from 'quasar'
import ApplicationFilters from 'src/components/ApplicationFilters.vue'
import type { ApplicationStatus } from 'src/types'
import { statusOptions } from 'src/types'

interface Application {
  applicationId: string
  companyName: string
  scholarshipName: string
  status: ApplicationStatus
  dueDate: string
  notes?: string
}

const $q = useQuasar()
const loading = ref(false)

const applications = ref<Application[]>([
  {
    applicationId: '1',
    companyName: 'Google',
    scholarshipName: 'Google Scholarship',
    status: 'Submitted',
    dueDate: '2024-04-01',
    notes: 'Applied through company website'
  }
])

const filters = ref({
  status: null as ApplicationStatus | null,
  companyName: '',
  dueDate: null
})

const applicationStatusOptions = [...statusOptions]

const columns: QTableColumn[] = [
  { name: 'companyName', label: 'Company', field: 'companyName', sortable: true, align: 'left' },
  { name: 'scholarshipName', label: 'Scholarship', field: 'scholarshipName', sortable: true, align: 'left' },
  { name: 'status', label: 'Status', field: 'status', sortable: true, align: 'left' },
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
    if (filters.value.dueDate && app.dueDate !== filters.value.dueDate) return false
    return true
  })
})

const getStatusColor = (status: ApplicationStatus) => {
  const colors: Record<ApplicationStatus, string> = {
    'Not Started': 'grey',
    'In Progress': 'blue',
    'Submitted': 'orange',
    'Awarded': 'green',
    'Not Awarded': 'red'
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
  applications.value = applications.value.filter(app => app.applicationId !== application.applicationId)
  $q.notify({
    color: 'positive',
    message: 'Application deleted successfully'
  })
}
</script> 