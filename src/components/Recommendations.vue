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
    return `${recommendation.recommender.firstName} ${recommendation.recommender.lastName} (${recommendation.recommender.emailAddress})`
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
    ...(props.application._id ? { _id: props.application._id } : {}),
    studentId: props.application.studentId,
    scholarshipName: props.application.scholarshipName,
    targetType: props.application.targetType,
    company: props.application.company,
    companyWebsite: props.application.companyWebsite,
    platform: props.application.platform,
    applicationLink: props.application.applicationLink,
    theme: props.application.theme,
    amount: props.application.amount,
    requirements: props.application.requirements,
    renewable: props.application.renewable,
    documentInfoLink: props.application.documentInfoLink,
    currentAction: props.application.currentAction,
    status: props.application.status,
    submissionDate: props.application.submissionDate,
    openDate: props.application.openDate,
    dueDate: props.application.dueDate,
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
    if (editingRecommendation.value && editingRecommendation.value._id && props.application && props.application._id) {
      const appId = props.application._id;
      // Update the recommendation in the application's recommendations array
      const updatedRecommendations = props.application.recommendations.map(rec =>
        rec._id === editingRecommendation.value!._id ? form : rec
      )
      const updateObj = createApplicationUpdateObject(updatedRecommendations);
      await applicationStore.updateApplication(appId, updateObj)
      $q.notify({
        type: 'positive',
        message: 'Recommendation updated successfully'
      })
    } else if (props.application && props.application._id) {
      const appId = props.application._id;
      // Add new recommendation
      const updatedRecommendations = [
        ...(props.application.recommendations || []),
        { ...form, _id: crypto.randomUUID() }
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
  if (!recommendation._id || !props.application || !props.application._id) {
    $q.notify({
      color: 'negative',
      message: 'Cannot delete recommendation: No recommendation ID or application found'
    })
    return
  }
  const appId = props.application._id;
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
          rec => rec._id !== recommendation._id
        )
        const updateObj = createApplicationUpdateObject(updatedRecommendations);
        await applicationStore.updateApplication(appId, updateObj)
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