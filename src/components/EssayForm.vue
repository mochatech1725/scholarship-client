<template>
  <div style="background-color: #f5f3fa; padding: 16px;">
    <q-card class="q-pa-md" style="background-color: white;">
      <q-card-section>
        <ScholarshipBanner :name="scholarshipName" />
        <q-form @submit="onSubmit" class="q-gutter-sm">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-h6">{{ props.essay ? 'Edit' : 'Add' }} Essay</div>
            <div>
              <q-btn
                label="Cancel"
                color="grey-7"
                outline
                @click="$emit('cancel')"
                class="q-mr-sm"
                size="md"
              />
              <q-btn
                :label="props.essay ? 'Update' : 'Create'"
                type="submit"
                color="primary"
                size="md"
              />
            </div>
          </div>

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
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Essay, Application } from 'src/types'
import ScholarshipBanner from 'components/ScholarshipBanner.vue'

const props = defineProps<{
  application?: Application | null
  essay?: Essay | null
}>()

const emit = defineEmits<{
  (e: 'submit', form: Essay): void
  (e: 'cancel'): void
}>()

const scholarshipName = computed(() => {
  return props.application?.scholarshipName || ''
})

const form = ref<Essay>({
  essayLink: '',
  count: 0,
  units: '',
  theme: ''
})

const initializeForm = () => {
  if (props.essay) {
    form.value = {
      essayLink: props.essay.essayLink,
      count: props.essay.count,
      units: props.essay.units,
      theme: props.essay.theme
    }
  }
}

onMounted(() => {
  initializeForm()
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