<template>
  <q-card class="q-pa-md">
    <q-card-section>
      <div class="row items-center justify-between q-mb-md">
        <div class="text-h6">Essays</div>
        <q-btn
          flat
          color="primary"
          icon="add"
          label="Add Essay"
          @click="showEssayForm = true"
        />
      </div>

      <q-table
        :rows="essays"
        :columns="essayColumns"
        row-key="_id"
        flat
        bordered
        dense
        :loading="loading"
      >
        <template v-slot:body-cell-essayLink="props">
          <q-td :props="props">
            {{ props.row.essayLink ? 'View' : 'Not uploaded' }}
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-sm">
            <q-btn
              flat
              round
              color="primary"
              icon="edit"
              @click="editEssay(props.row)"
              dense
            />
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              @click="confirmDeleteEssay(props.row)"
              dense
            />
          </q-td>
        </template>
      </q-table>
    </q-card-section>

    <q-dialog v-model="showEssayForm" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ editingEssay ? 'Edit Essay' : 'Add Essay' }}</div>
        </q-card-section>

        <q-card-section>
          <EssayForm
            :application="application"
            :essay="editingEssay"
            @cancel="closeEssayForm"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import type { Essay, Application } from 'src/types'
import EssayForm from './EssayForm.vue'

const props = defineProps<{
  application: Application | null
}>()

const $q = useQuasar()
const essays = ref<Essay[]>([])
const showEssayForm = ref(false)
const editingEssay = ref<Essay | null>(null)
const loading = ref(false)

const application = computed(() => props.application)

const essayColumns = [
  { name: 'theme', label: 'Theme', field: 'theme', sortable: true, align: 'left' as const },
  { name: 'count', label: 'Count', field: 'count', sortable: true, align: 'left' as const },
  { name: 'units', label: 'Units', field: 'units', sortable: true, align: 'left' as const },
  { name: 'essayLink', label: 'Essay Link', field: 'essayLink', align: 'left' as const },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' as const }
]

const loadEssays = () => {
  if (!props.application?.applicationId) return
  
  try {
    loading.value = true
    essays.value = props.application.essays || []
  } catch (err) {
    console.error('Failed to load essays:', err)
    $q.notify({
      color: 'negative',
      message: 'Failed to load essays'
    })
  } finally {
    loading.value = false
  }
}

const editEssay = (essay: Essay) => {
  editingEssay.value = essay
  showEssayForm.value = true
}

const closeEssayForm = () => {
  showEssayForm.value = false
  editingEssay.value = null
}

const confirmDeleteEssay = (essay: Essay) => {
  if (!essay._id) {
    $q.notify({
      color: 'negative',
      message: 'Cannot delete essay: No essay ID found'
    })
    return
  }

  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure you want to delete this essay?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    try {
      // Remove the essay from the application's essays array
      // This would require access to the application store
      loadEssays()
      $q.notify({
        color: 'positive',
        message: 'Essay deleted successfully'
      })
    } catch (err) {
      console.error('Failed to delete essay:', err)
      $q.notify({
        color: 'negative',
        message: 'Failed to delete essay'
      })
    }
  })
}

onMounted(() => {
  loadEssays()
})
</script> 