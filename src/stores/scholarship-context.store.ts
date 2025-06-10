import { defineStore } from 'pinia'

export const useScholarshipContextStore = defineStore('scholarshipContext', {
  state: () => ({
    currentScholarshipName: ''
  }),

  actions: {
    setCurrentScholarshipName(name: string) {
      this.currentScholarshipName = name
    },

    clearCurrentScholarshipName() {
      this.currentScholarshipName = ''
    }
  }
}) 