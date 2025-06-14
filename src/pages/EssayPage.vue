<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="q-pa-md">
          <q-card-section>
            <EssayForm 
            :is-edit="isEdit" 
            :loading="loading"
            :essay="essay"
            @cancel="handleCancel" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import EssayForm from 'src/components/EssayForm.vue'
import { useEssayStore } from 'src/stores/essay.store'
import type { Essay } from 'src/types'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const essayStore = useEssayStore()

const props = defineProps<{
  isEdit: boolean
}>()

const loading = ref(false)
const essay = ref<Essay | null>(null)

const handleCancel = () => {
  router.back()
}

const loadData = async () => {
  if (props.isEdit) {
    try {
      loading.value = true
      if (route.params.essayId) {
        essay.value = await essayStore.getEssay(route.params.essayId as string)
      }
    } catch (err) {
      console.error('Failed to load essay:', err)
      $q.notify({
        type: 'negative',
        message: 'Failed to load essay'
      })
    } finally {
      loading.value = false
    }
  }
}

onMounted(async () => {
  await loadData()
})
</script> 