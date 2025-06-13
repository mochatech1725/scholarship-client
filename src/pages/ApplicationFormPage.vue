<template>
  <q-page class="q-pa-lg">
    <div class="row q-mb-md items-center justify-between">
      <div class="text-h5">{{ isEdit ? 'Edit Application' : 'New Application' }}</div>
      <q-btn
        flat
        color="primary"
        icon="arrow_back"
        label="Back"
        :to="{ name: 'applicationsList' }"
      />
    </div>

    <q-card class="q-pa-md">
      <q-card-section>
        <ApplicationForm />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import ApplicationForm from 'components/ApplicationForm.vue'

const route = useRoute()
const isEdit = ref(!!route.params.applicationId)
</script> 