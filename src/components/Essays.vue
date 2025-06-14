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
          :to="{ name: 'essayCreate', params: { applicationId: props?.application?.applicationId }}"
        />
      </div>

      <q-table
        :rows="essays"
        :columns="essayColumns"
        row-key="id"
        flat
        bordered
        dense
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-sm">
            <q-btn
              flat
              round
              color="primary"
              icon="edit"
              :to="{ name: 'essayEdit', params: { essayId: props.row.essayId } }"
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
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useEssayStore } from 'stores/essay.store'
import type { Essay, Application } from 'src/types'

const props = defineProps<{
  application: Application | null
}>()

const $q = useQuasar()
const essayStore = useEssayStore()
const essays = ref<Essay[]>([])

const essayColumns = [
  { name: 'theme', label: 'Theme', field: 'theme', sortable: true, align: 'left' as const },
  { name: 'count', label: 'Count', field: 'count', sortable: true, align: 'left' as const },
  { name: 'units', label: 'Units', field: 'units', sortable: true, align: 'left' as const },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' as const }
]

const loadEssays = () => {
  essays.value = props.application?.essays || []
}

const confirmDeleteEssay = (essay: Essay) => {
  if (!essay.essayId) {
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
    void (async () => {
      try {
        await essayStore.deleteEssay(essay.essayId)
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
    })()
  })
}

onMounted( () => {
  void loadEssays()
})
</script> 