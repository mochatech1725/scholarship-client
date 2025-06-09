<template>
  <q-page padding class="q-px-xl q-py-lg">
    <div class="row q-mb-lg items-center justify-between">
      <div class="text-h5">{{ isEdit ? 'Edit Essay' : 'New Essay' }}</div>
      <q-btn
        flat
        color="primary"
        icon="arrow_back"
        label="Back"
        to="/dashboard/essays"
      />
    </div>

    <q-form @submit="onSubmit" class="q-gutter-md">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-3">
          <q-input
            v-model="form.count"
            label="Count"
            :rules="rules.count"
            outlined
            dense
            type="number"
          />
        </div>

        <div class="col-12 col-md-3">
          <q-input
            v-model="form.units"
            label="Units"
            :rules="rules.units"
            outlined
            dense
          />
        </div>
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-input
            v-model="form.theme"
            label="Theme"
            outlined
          />
        </div>

        <div class="col-12">
          <q-input
            v-model="form.essayLink"
            label="Essay Link"
            outlined
            type="url"
          />
        </div>
      </div>

      <div class="row justify-end q-mt-lg">
        <q-btn
          label="Cancel"
          color="grey"
          flat
          to="/dashboard/essays"
          class="q-mr-sm"
        />
        <q-btn
          label="Save"
          type="submit"
          color="primary"
          :loading="loading"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useEssayStore } from 'src/stores/essay.store'
import type { Essay } from 'src/types'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const essayStore = useEssayStore()
const loading = ref(false)

const isEdit = ref(false)
const form = ref<Omit<Essay, 'created'>>({
  essayId: route.params.essayId as string,
  scholarshipId: '', // TODO: Get from parent application
  studentId: '', // TODO: Get from auth store
  count: '',
  units: '',
  theme: '',
  essayLink: ''
})

const rules = {
  count: [
    (val: string) => !!val || 'Count is required'
  ],
  units: [
    (val: number) => !isNaN(val) || 'Units must be a number',
    (val: number) => val >= 0 || 'Units must be a positive number'
  ],
  // essayLink: [
  //   (val: string) => !!val || 'Essay link is required',
  //   (val: string) => /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(val) || 'Please enter a valid URL'
  // ]
}

const loadEssay = async (id: string) => {
  try {
    const essays = await essayStore.getEssays()
    const essay = essays.find(e => e.essayId === id)
    if (essay) {
      form.value = {
        essayId: essay.essayId || '',
        scholarshipId: essay.scholarshipId,
        studentId: essay.studentId,
        count: essay.count,
        units: essay.units,
        theme: essay.theme,
        essayLink: essay.essayLink
      }
    }
  } catch (err) {
    console.error('Failed to load essay:', err)
    $q.notify({
      type: 'negative',
      message: 'Failed to load essay'
    })
  }
}

const onSubmit = async () => {
  try {
    loading.value = true
    if (isEdit.value) {
      const id = route.params.id as string
      await essayStore.updateEssay(id, form.value)
      $q.notify({
        type: 'positive',
        message: 'Essay updated successfully'
      })
    } else {
      await essayStore.createEssay(form.value)
      $q.notify({
        type: 'positive',
        message: 'Essay created successfully'
      })
    }
    await router.push('/essays')
  } catch (err) {
    console.error('Failed to save essay:', err)
    $q.notify({
      type: 'negative',
      message: `Failed to ${isEdit.value ? 'update' : 'create'} essay`
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const { id } = route.params
  if (id && id !== 'new') {
    isEdit.value = true
    void loadEssay(id as string)
  }
})
</script> 