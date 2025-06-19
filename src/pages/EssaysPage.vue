<template>
  <q-page padding>
    <div class="row q-mb-md items-center justify-between">
      <div class="text-h5">Essays</div>
      <q-btn
        color="primary"
        icon="add"
        label="Add Essay"
        @click="handleEdit(null)"
      />
    </div>

    <q-table
      :rows="essays"
      :columns="columns"
      row-key="_id"
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
              @click="handleEdit(props.row)"
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

    <!-- Edit Form Dialog -->
    <q-dialog v-model="showForm" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ editingEssay ? 'Edit Essay' : 'Add Essay' }}</div>
        </q-card-section>

        <q-card-section>
          <EssayForm
            :application="application"
            :essay="editingEssay"
            @submit="handleFormSubmit"
            @cancel="closeForm"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">Are you sure you want to delete this essay?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="handleDelete" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useApplicationStore } from 'src/stores/application.store'
import type { Essay, Application } from 'src/types'
import EssayForm from 'src/components/EssayForm.vue'

const props = defineProps<{
  application: Application
}>()

const $q = useQuasar()
const applicationStore = useApplicationStore()
const loading = ref(false)
const essays = ref<Essay[]>([])
const showDeleteDialog = ref(false)
const selectedEssay = ref<Essay | null>(null)
const showForm = ref(false)
const editingEssay = ref<Essay | null>(null)

const columns = [
  { name: 'theme', label: 'Theme', field: 'theme', align: 'left' as const },
  { name: 'count', label: 'Count', field: 'count', align: 'left' as const },
  { name: 'units', label: 'Units', field: 'units', align: 'left' as const },
  { name: 'essayLink', label: 'Essay Link', field: 'essayLink', align: 'left' as const, format: (val: string) => val ? 'View' : 'Not uploaded' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' as const }
]

const loadEssays = () => {
  if (!props.application?.applicationId) {
    $q.notify({
      type: 'negative',
      message: 'No application provided'
    })
    return
  }

  essays.value = props.application.essays || []
}

const confirmDelete = (essay: Essay) => {
  selectedEssay.value = essay
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  if (!selectedEssay.value?._id) return

  try {
    // Since essays are nested in applications, we need to update the application
    // Remove the essay from the application's essays array
    const updatedEssays = props.application.essays.filter(essay => essay._id !== selectedEssay.value?._id)
    const updatedApplication = {
      ...props.application,
      essays: updatedEssays
    }
    
    await applicationStore.updateApplication(props.application.applicationId, updatedApplication)
    
    $q.notify({
      type: 'positive',
      message: 'Essay deleted successfully'
    })
    loadEssays()
  } catch (err) {
    console.error('Failed to delete essay:', err)
    $q.notify({
      type: 'negative',
      message: 'Failed to delete essay'
    })
  }
}

const handleEdit = (essay: Essay | null) => {
  editingEssay.value = essay
  showForm.value = true
}

const handleFormSubmit = () => {
  showForm.value = false
  editingEssay.value = null
  loadEssays()
}

const closeForm = () => {
  showForm.value = false
  editingEssay.value = null
}

// Watch for changes in the application prop
watch(() => props.application, () => {
  void loadEssays()
}, { immediate: true })
</script> 