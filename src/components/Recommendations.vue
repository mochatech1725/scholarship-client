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
        row-key="_id"
        flat
        bordered
        dense
      >
        <template v-slot:body-cell-recommender="props">
          <q-td :props="props">
            {{ props.row.recommender?.first_name }} {{ props.row.recommender?.last_name }}
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
            <div class="row items-center justify-between">
              <div class="text-h6">{{ editingRecommendation ? 'Edit' : 'Add' }} Recommendation</div>
              <q-btn
                flat
                round
                dense
                icon="close"
                @click="closeForm"
                size="sm"
                color="grey-7"
                class="close-btn"
                style="background-color: #f5f5f5; transition: all 0.2s ease;"
              />
            </div>
          </q-card-section>

          <q-card-section>
            <RecommendationForm
              :is-edit="!!editingRecommendation"
              :loading="loading"
              :recommendation="editingRecommendation"
              :application="application"
              :recommenders="recommenders"
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
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useApplicationStore } from 'src/stores/application.store'
import type { Recommendation, Application, Recommender } from 'src/types'
import { useGetStatusColor } from 'src/composables/useGetStatusColor'
import RecommendationForm from 'src/components/RecommendationForm.vue'
import { formatDate } from 'src/utils/helper'

const props = defineProps<{
  application: Application | null
  recommenders: Recommender[]
}>()

const emit = defineEmits<{
  (e: 'recommendations-updated', recommendations: Recommendation[]): void
}>()

const $q = useQuasar()
const applicationStore = useApplicationStore()
const recommendations = ref<Recommendation[]>([])
const showForm = ref(false)
const loading = ref(false)
const editingRecommendation = ref<Recommendation | null>(null)

const { getStatusColor } = useGetStatusColor()

const recommenderDisplayName = computed(() => {
  return (recommendation: Recommendation) => {
    if (!recommendation.recommender) return 'Loading...'
    return `${recommendation.recommender.first_name} ${recommendation.recommender.last_name} (${recommendation.recommender.email_address})`
  }
})

const recommendationColumns = [
  { name: 'recommender', label: 'Recommender', 
  field: (row: Recommendation) => recommenderDisplayName.value(row), align: 'left' as const },
  { name: 'status', label: 'Status', field: 'status', align: 'left' as const },
  { name: 'dueDate', label: 'Due Date', field: 'dueDate', align: 'left' as const, format: (val: string) => formatDate(val) },
  { name: 'submissionDate', label: 'Submitted', field: 'submissionDate', align: 'left' as const, format: (val: string | null) => val ? formatDate(val) : '-' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' as const }
]

const loadRecommendations = () => {
  recommendations.value = props.application?.recommendations || []
}

const createApplicationUpdateObject = (recommendations: Recommendation[]): Application => {
  if (!props.application) {
    throw new Error('Application is required')
  }
  
  return {
    ...(props.application.application_id ? { application_id: props.application.application_id } : {}),
    student_id: props.application.student_id,
    scholarship_name: props.application.scholarship_name,
    target_type: props.application.target_type,
    organization: props.application.organization,
    org_website: props.application.org_website,
    platform: props.application.platform,
    application_link: props.application.application_link,
    theme: props.application.theme,
    amount: props.application.amount,
    requirements: props.application.requirements,
    renewable: props.application.renewable,
    current_action: props.application.current_action,
    status: props.application.status,
    submission_date: props.application.submission_date,
    open_date: props.application.open_date,
    due_date: props.application.due_date,
    essays: props.application.essays,
    recommendations
  }
}

const editRecommendation = (recommendation: Recommendation) => {
  editingRecommendation.value = recommendation
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingRecommendation.value = null
}

const handleSubmit = async (form: Recommendation) => {
  try {
    loading.value = true
    if (editingRecommendation.value && editingRecommendation.value.recommendation_id && props.application && props.application.application_id) {
      const appId = props.application.application_id;
      // Update the recommendation in the application's recommendations array
      const updatedRecommendations = props.application.recommendations.map(rec =>
        rec.recommendation_id === editingRecommendation.value!.recommendation_id ? form : rec
      )
      const updateObj = createApplicationUpdateObject(updatedRecommendations);
      await applicationStore.updateApplication(appId, updateObj)
      $q.notify({
        type: 'positive',
        message: 'Recommendation updated successfully'
      })
    } else if (props.application && props.application.application_id) {
      const appId = props.application.application_id;
      // Add new recommendation - let database generate the ID
      const updatedRecommendations = [
        ...(props.application.recommendations || []),
        { ...form } // No ID needed - database will generate it
      ]
      const updateObj = createApplicationUpdateObject(updatedRecommendations);
      await applicationStore.updateApplication(appId, updateObj)
      $q.notify({
        type: 'positive',
        message: 'Recommendation created successfully'
      })
    }
    closeForm()
    loadRecommendations()
    emit('recommendations-updated', recommendations.value)
  } catch (err) {
    console.error('Failed to save recommendation:', err)
    $q.notify({
      color: 'negative',
      message: 'Failed to save recommendation'
    })
  } finally {
    loading.value = false
  }
}

const confirmDeleteRecommendation = (recommendation: Recommendation) => {
  if (!recommendation.recommendation_id || !props.application || !props.application.application_id) {
    $q.notify({
      color: 'negative',
      message: 'Cannot delete recommendation: No recommendation ID or application found'
    })
    return
  }
  const appId = props.application.application_id;
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure you want to delete this recommendation?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    void (async () => {
      try {
        // Remove the recommendation from the application's recommendations array
        const updatedRecommendations = (props.application!.recommendations || []).filter(
          rec => rec.recommendation_id !== recommendation.recommendation_id
        )
        const updateObj = createApplicationUpdateObject(updatedRecommendations);
        await applicationStore.updateApplication(appId, updateObj)
        $q.notify({
          color: 'positive',
          message: 'Recommendation deleted successfully'
        })
        loadRecommendations()
        emit('recommendations-updated', recommendations.value)
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

<style scoped>
.close-btn:hover {
  background-color: #e0e0e0 !important;
  transform: scale(1.1);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.close-btn:active {
  transform: scale(0.95);
}
</style> 