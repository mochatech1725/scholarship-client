<template>
  <q-page padding>
    <div class="row q-mb-md items-center justify-between">
      <div class="text-h5">Essays</div>
      <q-btn
        color="primary"
        icon="add"
        label="Add Essay"
        to="/essays/new"
      />
    </div>

    <q-table
      :rows="essays"
      :columns="columns"
      row-key="essayId"
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
              :to="`/essays/${props.row.essayId}`"
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

    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">Are you sure you want to delete this essay?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="deleteEssay" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useEssayStore } from 'src/stores/essay.store'
import type { Essay } from 'src/types'

const $q = useQuasar()
const essayStore = useEssayStore()
const loading = ref(false)
const essays = ref<Essay[]>([])
const showDeleteDialog = ref(false)
const selectedEssay = ref<Essay | null>(null)

const columns = [
  {
    name: 'theme',
    label: 'Theme',
    field: 'theme',
    align: 'left' as const
  },
  {
    name: 'count',
    label: 'Count',
    field: 'count',
    align: 'left' as const
  },
  {
    name: 'units',
    label: 'Units',
    field: 'units',
    align: 'left' as const
  },
  {
    name: 'essayLink',
    label: 'Essay Link',
    field: 'essayLink',
    align: 'left' as const,
    format: (val: string) => val ? 'View' : 'Not uploaded'
  },
  {
    name: 'created',
    label: 'Created',
    field: 'created',
    align: 'left' as const,
    format: (val: string) => new Date(val).toLocaleDateString()
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'center' as const
  }
]

const loadEssays = async () => {
  try {
    loading.value = true
    essays.value = await essayStore.getEssays()
  } catch (err) {
    console.error('Failed to load essays:', err)
    $q.notify({
      type: 'negative',
      message: 'Failed to load essays'
    })
  } finally {
    loading.value = false
  }
}

const confirmDelete = (essay: Essay) => {
  selectedEssay.value = essay
  showDeleteDialog.value = true
}

const deleteEssay = async () => {
  if (!selectedEssay.value?.essayId) return

  try {
    await essayStore.deleteEssay(selectedEssay.value.essayId)
    $q.notify({
      type: 'positive',
      message: 'Essay deleted successfully'
    })
    await loadEssays()
  } catch (err) {
    console.error('Failed to delete essay:', err)
    $q.notify({
      type: 'negative',
      message: 'Failed to delete essay'
    })
  }
}

onMounted(() => {
  void loadEssays()
})
</script> 