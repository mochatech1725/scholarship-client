<template>
  <q-page padding>
    <div class="row q-mb-md items-center justify-between">
      <div class="text-h5">Applications</div>
      <q-btn
        color="primary"
        icon="add"
        label="New Application"
        @click="handleEdit(null)"
      />
    </div>

    <div v-if="showForm" class="row q-col-gutter-md q-mb-md">
      <div class="col-12">
        <q-card class="q-pa-md">
          <q-card-section>
            <ApplicationForm 
              :is-edit="!!editingApplication"
              :application="editingApplication"
              @cancel="handleFormCancel"
              @submit="handleFormSubmit"
            />
          </q-card-section>
        </q-card>
      </div>
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
                  @click="handleEdit(props.row)"
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
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import type { QTableColumn } from 'quasar'
import ApplicationFilters from 'src/components/ApplicationFilters.vue'
import ApplicationForm from 'src/components/ApplicationForm.vue'
import type { ApplicationStatus, Application } from 'src/types'
import { statusOptions } from 'src/types'
import { useGetStatusColor } from 'src/composables/useGetStatusColor'
import { useApplicationStore } from 'src/stores/application.store'
import { useUserStore } from 'src/stores/user.store'
import { storeToRefs } from 'pinia'

const $q = useQuasar()
const loading = ref(false)
const { getStatusColor } = useGetStatusColor()
const applicationStore = useApplicationStore()
const userStore = useUserStore()

const { applications } = storeToRefs(applicationStore)

const filters = ref({
  status: null as ApplicationStatus | null,
  company: '',
  dueDate: null
})

const applicationStatusOptions = [...statusOptions]

const columns: QTableColumn[] = [
  { name: 'company', label: 'Company', field: 'company', sortable: true, align: 'left' },
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
    if (filters.value.company && !app.company.toLowerCase().includes(filters.value.company.toLowerCase())) return false
    if (filters.value.dueDate && app.dueDate !== filters.value.dueDate) return false
    return true
  })
})

const showForm = ref(false)
const editingApplication = ref<Application | null>(null)

const handleFormCancel = () => {
  showForm.value = false
  editingApplication.value = null
}

const handleFormSubmit = async () => {
  showForm.value = false
  editingApplication.value = null
  await loadApplications()
}

const handleEdit = (application: Application | null) => {
  editingApplication.value = application
  showForm.value = true
}

const loadApplications = async () => {
  if (!userStore.user) {
    await userStore.loadUser()
  }
  
  if (!userStore.user) {
    $q.notify({
      color: 'negative',
      message: 'User not found'
    })
    return
  }
  
  loading.value = true
  try {
    await applicationStore.getApplicationsByUserId(userStore.user.userId)
  } catch (error) {
    console.error('Failed to load applications:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to load applications'
    })
  } finally {
    loading.value = false
  }
}

const confirmDelete = (application: Application) => {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure you want to delete this application?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    void applicationStore.deleteApplication(application.applicationId)
  })
}

onMounted(() => {
  void loadApplications()
})
</script> 