<template>
  <q-page padding>
    <div class="row q-mb-md items-center justify-between">
      <div class="text-h5">Applications</div>
      <q-btn
        color="primary"
        icon="add"
        label="New Application"
        @click="openApplicationForm"
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
              @click="editApplication(props.row)"
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

    <!-- Application Form Dialog -->
    <q-dialog v-model="showApplicationForm" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ editingApplication ? 'Edit' : 'New' }} Application</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              v-model="applicationForm.companyName"
              label="Company Name"
              :rules="[val => !!val || 'Company name is required']"
            />

            <q-input
              v-model="applicationForm.position"
              label="Position"
              :rules="[val => !!val || 'Position is required']"
            />

            <q-select
              v-model="applicationForm.status"
              :options="statusOptions"
              label="Status"
              :rules="[val => !!val || 'Status is required']"
            />

            <q-input
              v-model="applicationForm.openDate"
              label="Open Date"
              type="date"
              :rules="[val => !!val || 'Open date is required']"
            />

            <q-input
              v-model="applicationForm.dueDate"
              label="Due Date"
              type="date"
              :rules="[val => !!val || 'Due date is required']"
            />

            <q-input
              v-model="applicationForm.notes"
              label="Notes"
              type="textarea"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="onSubmit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import type { QTableColumn } from 'quasar'

interface Application {
  id: string
  companyName: string
  position: string
  status: string
  openDate: string
  dueDate: string
  notes?: string
}

const $q = useQuasar()
const loading = ref(false)
const showApplicationForm = ref(false)
const editingApplication = ref<Application | null>(null)

const applications = ref<Application[]>([
  {
    id: '1',
    companyName: 'Google',
    position: 'Software Engineer',
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
  { name: 'position', label: 'Position', field: 'position', sortable: true, align: 'left' },
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

const applicationForm = ref<Partial<Application>>({
  companyName: '',
  position: '',
  status: '',
  openDate: '',
  dueDate: '',
  notes: ''
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

const openApplicationForm = () => {
  editingApplication.value = null
  applicationForm.value = {
    companyName: '',
    position: '',
    status: '',
    openDate: '',
    dueDate: '',
    notes: ''
  }
  showApplicationForm.value = true
}

const editApplication = (application: Application) => {
  editingApplication.value = application
  applicationForm.value = { ...application }
  showApplicationForm.value = true
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

const onSubmit = () => {
  if (editingApplication.value) {
    const index = applications.value.findIndex(app => app.id === editingApplication.value?.id)
    if (index !== -1) {
      applications.value[index] = {
        ...editingApplication.value,
        ...applicationForm.value
      } as Application
    }
  } else {
    applications.value.push({
      id: Date.now().toString(),
      ...applicationForm.value
    } as Application)
  }
  
  showApplicationForm.value = false
  $q.notify({
    color: 'positive',
    message: `Application ${editingApplication.value ? 'updated' : 'created'} successfully`
  })
}
</script> 