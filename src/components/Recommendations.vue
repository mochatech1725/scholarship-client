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
          :to="{ name: 'recommendationCreate' }"
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
              :to="{ name: 'recommendationEdit', params: { recommendationId: props.row.recommendationId } }"
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
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRecommendationStore } from 'stores/recommendation.store'
import type { Recommendation } from 'src/types'
import { useGetStatusColor } from 'src/composables/useGetStatusColor'

const props = defineProps<{
  applicationId: string
}>()

const $q = useQuasar()
const recommendationStore = useRecommendationStore()
const recommendations = ref<Recommendation[]>([])
const { getStatusColor } = useGetStatusColor()

const recommendationColumns = [
  {
    name: 'recommender',
    label: 'Recommender',
    field: (row: Recommendation) => {
      if (!row.recommender) return 'Loading...'
      return `${row.recommender.firstName} ${row.recommender.lastName} (${row.recommender.emailAddress})`
    },
    align: 'left' as const
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'left' as const
  },
  {
    name: 'dueDate',
    label: 'Due Date',
    field: 'dueDate',
    align: 'left' as const,
    format: (val: string) => new Date(val).toLocaleDateString()
  },
  {
    name: 'submissionDate',
    label: 'Submitted',
    field: 'submissionDate',
    align: 'left' as const,
    format: (val: string | null) => val ? new Date(val).toLocaleDateString() : '-'
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'right' as const
  }
]

const loadRecommendations = async () => {
  if (!props.applicationId) return

  try {
    recommendations.value = await recommendationStore.getRecommendationsByApplication(props.applicationId)
  } catch (err) {
    console.error('Failed to load recommendations:', err)
    $q.notify({
      type: 'negative',
      message: 'Failed to load recommendations'
    })
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
        await recommendationStore.deleteRecommendation(recommendation.recommendationId)
        await loadRecommendations()
        $q.notify({
          color: 'positive',
          message: 'Recommendation deleted successfully'
        })
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

// Watch for changes in applicationId
watch(() => props.applicationId, (newId) => {
  if (newId) {
    void loadRecommendations()
  }
})

onMounted(async () => {
  if (props.applicationId) {
    await loadRecommendations()
  }
})
</script> 