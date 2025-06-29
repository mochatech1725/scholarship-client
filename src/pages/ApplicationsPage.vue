<template>
  <q-page padding>
    <div class="row q-mb-md items-center justify-between">
      <div class="text-h5">Applications</div>
      <q-btn
        :style="{ backgroundColor: 'var(--q-button-primary)', color: 'white' }"
        icon="add"
        label="New Application"
        @click="handleEdit(null)"
      />
    </div>

    <!-- Filters Section -->
    <ApplicationFilters
      v-model:filters="filters"
      :target-type-options="targetTypeOptions"
    />

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
          <q-td :props="props">
            <q-btn
              flat
              round
              color="primary"
              icon="edit"
              size="sm"
              @click="handleEdit(props.row)"
            />
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              size="sm"
              @click="confirmDelete(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Application Form Dialog -->
    <q-dialog v-model="showForm" persistent>
      <q-card style="min-width: 800px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">{{ dialogTitle }}</div>
        </q-card-section>

        <q-card-section>
          <ApplicationForm
            :is-edit="!!editingApplication"
            :application="currentApplication"
            @cancel="handleFormCancel"
            @submit="handleFormSubmit"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import type { QTableColumn } from 'quasar'
import ApplicationFilters from 'src/components/ApplicationFilters.vue'
import ApplicationForm from 'src/components/ApplicationForm.vue'
import type { ApplicationStatus, Application } from 'src/types'
import { targetTypeOptions } from 'src/types'
import { useGetStatusColor } from 'src/composables/useGetStatusColor'
import { useApplicationStore } from 'src/stores/application.store'
import { useUserStore } from 'src/stores/user.store'
import { storeToRefs } from 'pinia'
import { formatDate } from 'src/utils/helper'
import { useAuthStore } from 'src/stores/auth.store'

const $q = useQuasar()
const loading = ref(false)
const { getStatusColor } = useGetStatusColor()
const applicationStore = useApplicationStore()
const userStore = useUserStore()
const authStore = useAuthStore()

const { applications } = storeToRefs(applicationStore)

const filters = ref({
  status: null as ApplicationStatus | null,
  targetType: null as string | null,
  currentAction: '',
  company: '',
  dueDateFrom: null as string | null,
  dueDateTo: null as string | null
})

const columns: QTableColumn[] = [
  { name: 'company', label: 'Company', field: 'company', sortable: true, align: 'left' },
  { name: 'scholarshipName', label: 'Scholarship', field: 'scholarshipName', sortable: true, align: 'left' },
  { name: 'targetType', label: 'Type', field: 'targetType', sortable: true, align: 'left' },
  { name: 'amount', label: 'Amount', field: 'amount', sortable: true, align: 'right', format: (val: number) => `$${val.toLocaleString()}` },
  { name: 'status', label: 'Status', field: 'status', sortable: true, align: 'left' },
  { name: 'currentAction', label: 'Current Action', field: 'currentAction', sortable: true, align: 'left' },
  { name: 'dueDate', label: 'Due Date', field: 'dueDate', sortable: true, align: 'left', format: (val: string) => formatDate(val) },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right', style: 'width: 70px' }
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
    if (filters.value.targetType && app.targetType !== filters.value.targetType) return false
    if (filters.value.currentAction && !app.currentAction.toLowerCase().includes(filters.value.currentAction.toLowerCase())) return false
    if (filters.value.company && !app.company.toLowerCase().includes(filters.value.company.toLowerCase())) return false
    
    // Date range filtering
    if (filters.value.dueDateFrom || filters.value.dueDateTo) {
      const appDueDate = new Date(app.dueDate)
      const fromDate = filters.value.dueDateFrom ? new Date(filters.value.dueDateFrom) : null
      const toDate = filters.value.dueDateTo ? new Date(filters.value.dueDateTo) : null
      
      if (fromDate && appDueDate < fromDate) return false
      if (toDate && appDueDate > toDate) return false
    }
    
    return true
  })
})

const showForm = ref(false)
const editingApplication = ref<Application | null>(null)

const dialogTitle = computed(() => {
  return editingApplication.value ? 'Edit Application' : 'New Application'
})

const currentApplication = computed(() => editingApplication.value)

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
  console.log('Loading applications...')
  
  // Try to get user from auth store first
  if (!userStore.user && authStore.user) {
    userStore.user = authStore.user
  }
  
  // If still no user, try to load from backend
  if (!userStore.user) {
    try {
      // If we have a user in auth store, use their ID, otherwise load without ID
      if (authStore.user?.userId) {
        await userStore.loadUser(authStore.user.userId)
      } else {
        await userStore.loadUser()
      }
    } catch (error) {
      console.error('Failed to load user:', error)
      $q.notify({
        color: 'negative',
        message: 'Failed to load user data'
      })
      return
    }
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
    void (async () => {
      try {
        if (application._id) {
          await applicationStore.deleteApplication(application._id)
          $q.notify({
            color: 'positive',
            message: 'Application deleted successfully'
          })
          await loadApplications()
        }
      } catch (error) {
        console.error('Failed to delete application:', error)
        $q.notify({
          color: 'negative',
          message: 'Failed to delete application'
        })
      }
    })()
  })
}

onMounted(() => {
  void loadApplications()
})
</script> 