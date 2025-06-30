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
          <div class="text-h6">Profile</div>
          <q-btn
            v-if="!isEdit"
            label="Edit"
            color="primary"
            @click="$emit('edit')"
            dense
          />
        </div>

        <div v-if="isEdit">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <div class="row items-center justify-between q-mb-md">
              <div class="text-h6">Search Preferences</div>
              <div class="row items-center">
                <div v-if="isFormDirty" class="text-caption text-orange q-mr-md">
                  <q-icon name="warning" size="sm" class="q-mr-xs" />
                  Unsaved changes
                </div>
                <q-btn
                  flat
                  round
                  dense
                  icon="close"
                  @click="handleCancel"
                  class="q-mr-sm close-btn"
                  size="sm"
                  color="grey-7"
                  style="background-color: #f5f5f5; transition: all 0.2s ease;"
                />
                <q-btn
                  label="Cancel"
                  color="grey-6"
                  flat
                  @click="handleCancel"
                  class="q-mr-sm"
                  size="md"
                />
                <q-btn
                  label="Save"
                  type="submit"
                  :style="{ backgroundColor: 'var(--q-button-primary)', color: 'white' }"
                  size="md"
                />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <div class="form-label">Education Level</div>
                <q-select
                  v-model="form.userPreferences.searchPreferences.educationLevel"
                  :options="educationLevelOptions"
                  flat
                  dense
                  class="q-mb-sm"
                />
              </div>
              <div class="col-12 col-md-6">
                <div class="form-label">Education Year</div>
                <q-select
                  v-model="form.userPreferences.searchPreferences.educationYear"
                  :options="educationYearOptions"
                  flat
                  dense
                  class="q-mb-sm"
                />
              </div>
              <div class="col-12 col-md-6">
                <div class="form-label">Target Type</div>
                <q-select
                  v-model="form.userPreferences.searchPreferences.targetType"
                  :options="targetTypeOptions"
                  flat
                  dense
                  class="q-mb-sm"
                />
              </div>
              <div class="col-12 col-md-6">
                <div class="form-label">Areas of Interest</div>
                <q-select
                  v-model="form.userPreferences.searchPreferences.subjectAreas"
                  :options="subjectAreaOptions"
                  multiple
                  flat
                  dense
                  class="q-mb-sm"
                />
              </div>
              <div class="col-12 col-md-6">
                <div class="form-label">Gender</div>
                <q-select
                  v-model="form.userPreferences.searchPreferences.gender"
                  :options="genderOptions"
                  flat
                  dense
                  class="q-mb-sm"
                />
              </div>
              <div class="col-12 col-md-6">
                <div class="form-label">Ethnicity</div>
                <q-select
                  v-model="form.userPreferences.searchPreferences.ethnicity"
                  :options="ethnicityOptions"
                  flat
                  dense
                  class="q-mb-sm"
                />
              </div>
              <div class="col-12 col-md-6">
                <div class="form-label">Academic GPA</div>
                <q-input
                  v-model.number="form.userPreferences.searchPreferences.academicGPA"
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.0"
                  flat
                  dense
                  class="q-mb-sm"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-checkbox
                  v-model="form.userPreferences.searchPreferences.essayRequired"
                  label="Essay Required"
                  class="q-mb-sm"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-checkbox
                  v-model="form.userPreferences.searchPreferences.recommendationRequired"
                  label="Recommendation Required"
                  class="q-mb-sm"
                />
              </div>
            </div>
          </q-form>
        </div>

        <div v-else>
          <div class="text-h6 q-mb-md">Search Preferences</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="form-label">Education Level</div>
              <div class="q-pa-sm">{{ profile?.userPreferences?.searchPreferences?.educationLevel || 'Not set' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="form-label">Education Year</div>
              <div class="q-pa-sm">{{ profile?.userPreferences?.searchPreferences?.educationYear || 'Not set' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="form-label">Target Type</div>
              <div class="q-pa-sm">{{ 
                  profile?.userPreferences?.searchPreferences?.targetType || 'Not set' 
              }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="form-label">Areas of Interest</div>
              <div class="q-pa-sm">{{ profile?.userPreferences?.searchPreferences?.subjectAreas?.join(', ') || 'Not set' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="form-label">Gender</div>
              <div class="q-pa-sm">{{ profile?.userPreferences?.searchPreferences?.gender || 'Not set' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="form-label">Ethnicity</div>
              <div class="q-pa-sm">{{ profile?.userPreferences?.searchPreferences?.ethnicity || 'Not set' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="form-label">Academic GPA</div>
              <div class="q-pa-sm">{{ profile?.userPreferences?.searchPreferences?.academicGPA || 'Not set' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="form-label">Essay Required</div>
              <div class="q-pa-sm">{{ profile?.userPreferences?.searchPreferences?.essayRequired ? 'Yes' : 'No' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="form-label">Recommendation Required</div>
              <div class="q-pa-sm">{{ profile?.userPreferences?.searchPreferences?.recommendationRequired ? 'Yes' : 'No' }}</div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onUnmounted, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import type { Profile, User } from 'src/types'
import { 
  educationLevelOptions, 
  educationYearOptions, 
  targetTypeOptions, 
  subjectAreaOptions, 
  genderOptions, 
  ethnicityOptions 
} from 'src/types'

const $q = useQuasar()

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
      educationLevel: 'Undergraduate',
      educationYear: 'College Freshman',
      targetType: 'Both',
      subjectAreas: [],
      gender: 'Male',
      ethnicity: 'White/Caucasian',
      academicGPA: 3.0,
      essayRequired: false,
      recommendationRequired: false
    }
  }
})

const originalFormData = ref<Profile | null>(null)
const isInitialized = ref(false)

// Track if form is dirty (has been modified)
const isFormDirty = computed(() => {
  if (!originalFormData.value || !isInitialized.value) return false
  
  // Deep comparison of form data
  const current = JSON.stringify(form.value)
  const original = JSON.stringify(originalFormData.value)
  return current !== original
})

watch(
  () => [!!props.profile, props.profile],
  ([hasProfile, newProfile]) => {
    if (hasProfile && newProfile) {
      // Store original data first
      originalFormData.value = JSON.parse(JSON.stringify(newProfile)) as Profile
      // Then set form data
      form.value = newProfile as Profile
      isInitialized.value = true
    }
  },
  { immediate: true }
)

// Debug watch to see what props are being received
watch(
  () => [props.user, props.profile],
  ([user, profile]) => {
    console.log('ProfileForm props changed:', {
      user: user,
      profile: profile,
      hasUser: !!user,
      hasProfile: !!profile
    })
  },
  { immediate: true }
)

const handleCancel = () => {
  if (isFormDirty.value) {
    $q.dialog({
      title: 'Unsaved Changes',
      message: 'You have unsaved changes. Are you sure you want to cancel?',
      cancel: true,
      persistent: true,
      ok: {
        label: 'Discard Changes',
        color: 'negative'
      }
    }).onOk(() => {
      emit('cancel')
    })
  } else {
    emit('cancel')
  }
}

const onSubmit = () => {
  // Reset dirty state after successful submission
  originalFormData.value = { ...form.value }
  emit('submit', form.value)
}

// Handle ESC key press
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.preventDefault()
    handleCancel()
  }
}

// Add ESC key listener when component is mounted
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  // Remove ESC key listener
  document.removeEventListener('keydown', handleKeydown)
})
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

.close-btn:hover {
  background-color: #e0e0e0 !important;
  transform: scale(1.1);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.close-btn:active {
  transform: scale(0.95);
}
</style> 