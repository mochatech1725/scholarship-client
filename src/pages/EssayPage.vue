<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="q-pa-md">
          <q-card-section>
            <EssayForm :is-edit="isEdit" @cancel="handleCancel" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EssayForm from 'src/components/EssayForm.vue'

const route = useRoute()
const router = useRouter()
const isEdit = ref(route.params.essayId !== undefined)

const handleCancel = () => {
  router.back()
}
</script> 