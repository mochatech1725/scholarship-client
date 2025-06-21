<template>
  <div class="profile-container">
    <!-- Personal Information Card (Read-only) -->
    <q-card class="q-pa-md q-mb-md" style="background-color: white;">
      <q-card-section>
        <div class="text-h6 q-mb-md">Personal Information</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="form-label">First Name</div>
            <div class="q-pa-sm">{{ user?.firstName || 'Not set' }}</div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-label">Last Name</div>
            <div class="q-pa-sm">{{ user?.lastName || 'Not set' }}</div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-label">Email</div>
            <div class="q-pa-sm">{{ user?.emailAddress || 'Not set' }}</div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Search Preferences Card (Editable) -->
    <q-card class="q-pa-md" style="background-color: white;">
      <q-card-section>
        <div class="row items-center justify-between q-mb-md">
          <div class="text-h6">Search Preferences</div>
          <q-btn
            v-if="!isEdit"
            label="Edit"
            color="primary"
            @click="$emit('edit')"
            dense
          />
        </div>

        <q-form v-if="isEdit" @submit="onSubmit" class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="form-label">Education Level</div>
              <q-select
                v-model="form.userPreferences.searchPreferences.educationLevel"
                :options="educationLevelOptions"
                flat
                dense
                class="q-mb-md"
              />
            </div>
            <div class="col-12 col-md-6">
              <div class="form-label">Target Types</div>
              <q-select
                v-model="form.userPreferences.searchPreferences.targetTypes"
                :options="targetTypeOptions"
                multiple
                flat
                dense
                class="q-mb-md"
              />
            </div>
            <div class="col-12 col-md-6">
              <div class="form-label">Areas of Interest</div>
              <q-select
                v-model="form.userPreferences.searchPreferences.areas"
                :options="areaOptions"
                multiple
                flat
                dense
                class="q-mb-md"
              />
            </div>
            <div class="col-12 col-md-6">
              <div class="form-label">Minimum Amount</div>
              <q-input
                v-model.number="form.userPreferences.searchPreferences.minAmount"
                type="number"
                flat
                dense
                class="q-mb-md"
              />
            </div>
          </div>

          <div class="row justify-end q-mt-md">
            <q-btn
              label="Cancel"
              color="grey"
              flat
              class="q-mr-sm"
              @click="$emit('cancel')"
              dense
            />
            <q-btn
              label="Save"
              type="submit"
              :style="{ backgroundColor: 'var(--q-button-primary)', color: 'white' }"
              dense
            />
          </div>
        </q-form>

        <div v-else>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="form-label">Education Level</div>
              <div class="q-pa-sm">{{ profile?.userPreferences.searchPreferences.educationLevel || 'Not set' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="form-label">Target Types</div>
              <div class="q-pa-sm">{{ profile?.userPreferences.searchPreferences.targetTypes?.join(', ') || 'Not set' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="form-label">Areas of Interest</div>
              <div class="q-pa-sm">{{ profile?.userPreferences.searchPreferences.areas?.join(', ') || 'Not set' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="form-label">Minimum Amount</div>
              <div class="q-pa-sm">${{ profile?.userPreferences.searchPreferences.minAmount || '0' }}</div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Profile, User } from 'src/types'
import { educationLevelOptions, targetTypeOptions, areaOptions } from 'src/types'

const props = defineProps<{ 
  isEdit?: boolean; 
  profile?: Profile | null;
  user?: User | null;
}>()

const emit = defineEmits<{ 
  (e: 'submit', profile: Profile): void; 
  (e: 'cancel'): void;
  (e: 'edit'): void;
}>()

const form = ref<Profile>({
  userPreferences: {
    searchPreferences: {
      educationLevel: 'College Freshman',
      targetTypes: [],
      areas: [],
      minAmount: 0
    }
  }
})

watch(
  () => [!!props.profile, props.profile],
  ([hasProfile, newProfile]) => {
    if (hasProfile && newProfile) {
      form.value = JSON.parse(JSON.stringify(newProfile))
    }
  },
  { immediate: true }
)

const onSubmit = () => {
  emit('submit', form.value)
}
</script>

<style scoped>
.q-form {
  max-width: 800px;
  margin: 0 auto;
}

.profile-container {
  max-width: 600px;
  margin: 0 auto;
}
</style> 