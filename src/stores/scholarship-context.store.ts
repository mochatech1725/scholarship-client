import { defineStore } from 'pinia'

export const useScholarshipContextStore = defineStore('scholarshipContext', {
  state: () => ({
    currentScholarshipName: '',
    applicationId: ''
  }),

  actions: {
    setCurrentScholarshipName(name: string) {
      this.currentScholarshipName = name
    },

    clearCurrentScholarshipName() {
      this.currentScholarshipName = ''
    },

    setApplicationId(id: string) {
      this.applicationId = id
    },

    clearApplicationId() {
      this.applicationId = ''
    }
  }
}) 