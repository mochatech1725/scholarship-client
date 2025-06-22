<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6">{{ isEdit ? 'Editing' : 'Adding' }} Recommender</div>
      <div>
        <q-btn
          label="Cancel"
          color="grey-6"
          flat
          @click="$emit('cancel')"
          class="q-mr-sm"
          size="md"
        />
        <q-btn
          label="Save"
          type="submit"
          :style="{ backgroundColor: 'var(--q-button-primary)', color: 'white' }"
          :loading="loading"
          size="md"
        />
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <div class="form-label">First Name</div>
        <q-input
          v-model="form.firstName"
          :rules="rules.firstName"
          flat
          dense
          hide-bottom-space
          class="q-mb-md"
        />
      </div>

      <div class="col-12 col-md-6">
        <div class="form-label">Last Name</div>
        <q-input
          v-model="form.lastName"
          :rules="rules.lastName"
          flat
          dense
          hide-bottom-space
          class="q-mb-md"
        />
      </div>

      <div class="col-12 col-md-6">
        <div class="form-label">Email Address</div>
        <q-input
          v-model="form.emailAddress"
          :rules="rules.emailAddress"
          flat
          dense
          type="email"
          hide-bottom-space
          class="q-mb-md"
        />
      </div>

      <div class="col-12 col-md-6">
        <div class="form-label">Phone Number</div>
        <q-input
          v-model="form.phoneNumber"
          flat
          dense
          mask="(###) ###-####"
          hide-bottom-space
          class="q-mb-md"
        />
      </div>

      <div class="col-12 col-md-6">
        <div class="form-label">Relationship</div>
        <q-select
          v-model="form.relationship"
          :options="relationshipOptions"
          flat
          dense
          hide-bottom-space
          class="q-mb-md"
        />
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Recommender, User } from 'src/types'

const props = defineProps<{
  isEdit?: boolean
  recommender: Recommender | null
  loading?: boolean
  user: User | null
}>()

const emit = defineEmits<{
  (e: 'submit', form: Omit<Recommender, '_id'> & { emailAddress: string; phoneNumber: string }): void
  (e: 'cancel'): void
}>()

const relationshipOptions = ['Teacher', 'Counselor', 'Employer', 'Friend', 'Other']

const form = ref<Omit<Recommender, '_id'> & { emailAddress: string; phoneNumber: string }>({
  studentId: props.user?._id || '',
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
  emailAddress: [
    (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Please enter a valid email address'
  ]
}

const loadData = () => {
  if (props.isEdit && props.recommender) {
    form.value = {
      studentId: props.recommender.studentId,
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