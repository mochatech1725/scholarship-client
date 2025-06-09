<template>
  <q-page class="q-pa-lg">
    <div class="row q-mb-md items-center justify-between">
      <div class="text-h5">{{ isEdit ? 'Edit Recommendation' : 'New Recommendation' }}</div>
      <q-btn
        flat
        color="primary"
        icon="arrow_back"
        label="Back"
        to="/dashboard/recommenders"
      />
    </div>

    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <q-form @submit="onSubmit" class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.firstName"
                label="First Name"
                :rules="rules.firstName"
                outlined
                dense
                class="max-width-300"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.lastName"
                label="Last Name"
                :rules="rules.lastName"
                outlined
                dense
                class="max-width-300"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.emailAddress"
                label="Email Address"
                :rules="rules.emailAddress"
                outlined
                dense
                type="email"
                class="max-width-300"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.phoneNumber"
                label="Phone Number"
                :rules="rules.phoneNumber"
                outlined
                dense
                mask="(###) ###-####"
                class="max-width-300"
              />
            </div>

            <div class="col-12">
              <q-select
                v-model="form.relationship"
                :options="relationshipOptions"
                label="Relationship"
                :rules="rules.relationship"
                outlined
                dense
                class="max-width-300"
              />
            </div>
          </div>

          <div class="row justify-end q-mt-lg">
            <q-btn
              label="Cancel"
              color="grey"
              flat
              to="/recommenders"
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
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useRecommenderStore } from 'src/stores/recommender.store'
import type { Recommender } from 'src/types'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const recommenderStore = useRecommenderStore()
const loading = ref(false)

const relationshipOptions = ['Teacher', 'Counselor', 'Employer', 'Friend', 'Other']

const isEdit = ref(false)
const form = ref<Omit<Recommender, 'recommenderId' | 'created'> & { emailAddress: string; phoneNumber: string }>({
  firstName: '',
  lastName: '',
  relationship: '',
  emailAddress: '',
  phoneNumber: ''
})

const rules = {
  firstName: [
    (val: string) => !!val || 'First name is required'
  ],
  lastName: [
    (val: string) => !!val || 'Last name is required'
  ],
  relationship: [
    (val: string) => !!val || 'Relationship is required'
  ],
  emailAddress: [
    (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Please enter a valid email address'
  ],
  phoneNumber: [
    (val: string) => val.replace(/[^0-9]/g, '').length === 10 || 'Please enter a valid 10-digit phone number'
  ]
}

const loadRecommender = async (id: string) => {
  try {
    const recommenders = await recommenderStore.getRecommenders()
    const recommender = recommenders.find(r => r.recommenderId === id)
    if (recommender) {
      form.value = {
        firstName: recommender.firstName,
        lastName: recommender.lastName,
        relationship: recommender.relationship,
        emailAddress: recommender.emailAddress,
        phoneNumber: recommender.phoneNumber
      }
    }
  } catch (err) {
    console.error('Failed to load recommender:', err)
    $q.notify({
      type: 'negative',
      message: 'Failed to load recommender'
    })
  }
}

const onSubmit = async () => {
  try {
    loading.value = true
    if (isEdit.value) {
      const id = route.params.id as string
      await recommenderStore.updateRecommender(id, form.value)
      $q.notify({
        type: 'positive',
        message: 'Recommender updated successfully'
      })
    } else {
      await recommenderStore.createRecommender(form.value)
      $q.notify({
        type: 'positive',
        message: 'Recommender created successfully'
      })
    }
    await router.push('/recommenders')
  } catch {
    $q.notify({
      type: 'negative',
      message: `Failed to ${isEdit.value ? 'update' : 'create'} recommender`
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const { id } = route.params
  if (id && id !== 'new') {
    isEdit.value = true
    void loadRecommender(id as string)
  }
})
</script>

<style scoped>
.max-width-300 {
  max-width: 300px;
}
</style> 