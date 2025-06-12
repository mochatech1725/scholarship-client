<template>
  <q-form @submit="onSubmit" class="q-gutter-sm">
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-md-6">
        <q-input
          v-model="form.theme"
          label="Theme"
          :rules="[val => !!val || 'Theme is required']"
          outlined
          dense
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="form.units"
          label="Units"
          :rules="[val => !!val || 'Units is required']"
          outlined
          dense
        />
      </div>
      <div class="col-12">
        <q-input
          v-model="form.essayLink"
          label="Essay Link"
          :rules="[val => !!val || 'Essay link is required']"
          outlined
          dense
        />
      </div>
      <div class="col-12">
        <q-input
          v-model.number="form.count"
          label="Count"
          type="number"
          :rules="[val => !!val || 'Count is required']"
          outlined
          dense
        />
      </div>
    </div>

    <div class="row justify-end q-mt-sm">
      <q-btn
        label="Cancel"
        color="grey"
        flat
        class="q-mr-sm"
        @click="$emit('cancel')"
        dense
      />
      <q-btn
        :label="isEdit ? 'Update' : 'Create'"
        type="submit"
        color="primary"
        dense
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Essay } from 'src/types'

defineProps<{
  isEdit?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', form: Omit<Essay, 'essayId' | 'created'>): void
  (e: 'cancel'): void
}>()

const form = ref<Omit<Essay, 'essayId' | 'created'>>({
  applicationId: '',
  studentId: '',
  essayLink: '',
  count: 0,
  units: '',
  theme: ''
})

const onSubmit = () => {
  emit('submit', form.value)
}
</script>

<style scoped>
.q-form {
  max-width: 800px;
  margin: 0 auto;
}
</style> 