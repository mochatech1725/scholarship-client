<template>
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
        @click="$emit('cancel')"
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
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps, watch } from 'vue'
import type { Recommender } from 'src/types'

const props = defineProps<{
  initialData?: Omit<Recommender, 'recommenderId' | 'created'> & { emailAddress: string; phoneNumber: string }
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', form: Omit<Recommender, 'recommenderId' | 'created'> & { emailAddress: string; phoneNumber: string }): void
  (e: 'cancel'): void
}>()

const relationshipOptions = ['Teacher', 'Counselor', 'Employer', 'Friend', 'Other']

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

watch(() => props.initialData, (newData) => {
  if (newData) {
    form.value = { ...newData }
  }
}, { immediate: true })

const onSubmit = () => {
  emit('submit', form.value)
}
</script>

<style scoped>
.max-width-300 {
  max-width: 300px;
}
</style> 