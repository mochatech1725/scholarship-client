<template>
  <q-card class="q-pa-md">
    <q-card-section>
      <div class="row items-center justify-between q-mb-md">
        <div class="text-h6">Recommendations</div>
        <q-btn
          flat
          color="primary"
          icon="add"
          label="Add Recommendation"
          @click="showForm = true"
        />
      </div>

      <q-table
        :rows="recommendations"
        :columns="recommendationColumns"
        row-key="recommendationId"
        flat
        bordered
        dense
      >
        <template v-slot:body-cell-recommender="props">
          <q-td :props="props">
            {{ props.row.recommender?.firstName }} {{ props.row.recommender?.lastName }}
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="getStatusColor(props.row.status)"
              text-color="white"
              dense
            >
              {{ props.row.status }}
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
              @click="editRecommendation(props.row)"
              dense
            />
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              @click="confirmDeleteRecommendation(props.row)"
              dense
            />
          </q-td>
        </template>
      </q-table>

      <!-- Recommendation Form Dialog -->
      <q-dialog v-model="showForm" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">{{ editingRecommendation ? 'Edit' : 'Add' }} Recommendation</div>
          </q-card-section>

          <q-card-section>
            <RecommendationForm
              :is-edit="!!editingRecommendation"
              :loading="loading"
              :recommendation="editingRecommendation"
              @submit="handleSubmit"
              @cancel="closeForm"
            />
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useApplicationStore } from 'src/stores/application.store'
import { useRecommendationStore } from 'src/stores/recommendation.store'
import type { Recommendation, Application } from 'src/types'
import { useGetStatusColor } from 'src/composables/useGetStatusColor'
import RecommendationForm from 'src/components/RecommendationForm.vue'

const props = defineProps<{
  application: Application | null
}>()

const $q = useQuasar()
const applicationStore = useApplicationStore()
const recommendationStore = useRecommendationStore()
const recommendations = ref<Recommendation[]>([])
const showForm = ref(false)
const loading = ref(false)
const editingRecommendation = ref<Recommendation | null>(null)

const { getStatusColor } = useGetStatusColor()

const recommendationColumns = [
  { name: 'recommender', label: 'Recommender', 
  field: (row: Recommendation) => { 
    if (!row.recommender) return 'Loading...' 
    return `${row.recommender.firstName} ${row.recommender.lastName} (${row.recommender.emailAddress})` }, align: 'left' as const },
  { name: 'status', label: 'Status', field: 'status', align: 'left' as const },
  { name: 'dueDate', label: 'Due Date', field: 'dueDate', align: 'left' as const, format: (val: string) => new Date(val).toLocaleDateString() },
  { name: 'submissionDate', label: 'Submitted', field: 'submissionDate', align: 'left' as const, format: (val: string | null) => val ? new Date(val).toLocaleDateString() : '-' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' as const }
]

const loadRecommendations = () => {
  recommendations.value = props.application?.recommendations || []
}

const editRecommendation = (recommendation: Recommendation) => {
  editingRecommendation.value = recommendation
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingRecommendation.value = null
}

const handleSubmit = async (form: Omit<Recommendation, 'created'>) => {
  try {
    loading.value = true
    if (editingRecommendation.value) {
      await recommendationStore.updateRecommendation(editingRecommendation.value.recommendationId, form)
      $q.notify({
        type: 'positive',
        message: 'Recommendation updated successfully'
      })
    } else {
      const newRecommendation: Omit<Recommendation, 'recommendationId'> = {
        ...form,
        created: new Date().toISOString()
      }
      await recommendationStore.createRecommendation(newRecommendation)
      $q.notify({
        type: 'positive',
        message: 'Recommendation created successfully'
      })
    }
    closeForm()
    loadRecommendations()
  } catch (err) {
    console.error('Failed to save recommendation:', err)
    $q.notify({
      type: 'negative',
      message: 'Failed to save recommendation'
    })
  } finally {
    loading.value = false
  }
}

const confirmDeleteRecommendation = (recommendation: Recommendation) => {
  if (!recommendation.recommendationId) {
    $q.notify({
      color: 'negative',
      message: 'Cannot delete recommendation: No recommendation ID found'
    })
    return
  }

  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure you want to delete this recommendation?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    void (async () => {
      try {
        await applicationStore.deleteRecommendation(recommendation.recommendationId)
        $q.notify({
          color: 'positive',
          message: 'Recommendation deleted successfully'
        })
        loadRecommendations()
      } catch (err) {
        console.error('Failed to delete recommendation:', err)
        $q.notify({
          color: 'negative',
          message: 'Failed to delete recommendation'
        })
      }
    })()
  })
}

onMounted(() => {
  loadRecommendations()
})
</script> 