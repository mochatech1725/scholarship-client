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
        />
      </div>

      <div class="col-12 col-md-6">
        <q-input
          v-model="form.lastName"
          label="Last Name"
          :rules="rules.lastName"
          outlined
          dense
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
        />
      </div>

      <div class="col-12 col-md-6">
        <q-input
          v-model="form.phoneNumber"
          label="Phone Number"
          outlined
          dense
          mask="(###) ###-####"
        />
      </div>

      <div class="col-12 col-md-6">
        <q-select
          v-model="form.relationship"
          :options="relationshipOptions"
          label="Relationship"
          :rules="rules.relationship"
          outlined
          dense
        />
      </div>
    </div>

    <div class="row justify-end q-mt-md">
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
import { ref, defineEmits, defineProps, onMounted } from 'vue'
import type { Recommender, User } from 'src/types'

const props = defineProps<{
  isEdit?: boolean
  recommender: Recommender | null
  loading?: boolean
  user: User | null
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
  ]
}

const loadData = () => {
  if (props.isEdit && props.recommender) {
    form.value = {
      firstName: props.recommender.firstName,
      lastName: props.recommender.lastName,
      relationship: props.recommender.relationship,
      emailAddress: props.recommender.emailAddress,
      phoneNumber: props.recommender.phoneNumber
    }
  }
}

const onSubmit = () => {
  emit('submit', form.value)
}

onMounted(() => {
  void loadData()
})
</script>

<style scoped>
.q-form {
  max-width: 800px;
  margin: 0 auto;
}
</style> 