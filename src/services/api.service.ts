import { useAuthStore } from 'src/stores/auth.store'
import type { Profile, Scholarship } from 'src/types'
import { api } from 'src/boot/axios'
import type { AxiosRequestConfig } from 'axios'

class ApiService {
  private async getAuthHeaders() {
    const authStore = useAuthStore()
    const token = await authStore.getToken()
    
    return {
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }

  private async makeRequest(endpoint: string, options: AxiosRequestConfig = {}) {
    try {
      const headers = await this.getAuthHeaders()
      const url = endpoint
      
      console.log('Making API request:', {
        url,
        method: options.method || 'GET',
        headers: headers,
        hasToken: !!headers.Authorization
      })
      
      const response = await api({
        url,
        method: options.method || 'GET',
        headers: {
          ...headers,
          ...options.headers,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        data: options.data,
        ...options
      })

      console.log('API response data:', response.data)
      return response.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      console.error('API request failed:', {
        endpoint,
        error: errorMessage
      })
      throw error
    }
  }

  // Auth endpoints
  async getProfile() {
    return this.makeRequest('/api/auth/profile')
  }

  async checkAuth() {
    return this.makeRequest('/api/auth/me')
  }

  // User endpoints
  async getUser(userId?: string) {
    if (userId) {
      return this.makeRequest(`/api/users/${userId}`)
    }
    return this.makeRequest('/api/auth/profile')
  }

  async updateProfile(profile: Profile) {
    return this.makeRequest('/api/users/profile', {
      method: 'PUT',
      data: profile
    })
  }

  // Scholarship endpoints
  async getScholarships() {
    return this.makeRequest('/api/scholarships')
  }

  async getScholarship(id: string) {
    return this.makeRequest(`/api/scholarships/${id}`)
  }

  async createScholarship(scholarship: Scholarship) {
    return this.makeRequest('/api/scholarships', {
      method: 'POST',
      data: scholarship
    })
  }

  async updateScholarship(id: string, scholarship: Scholarship) {
    return this.makeRequest(`/api/scholarships/${id}`, {
      method: 'PUT',
      data: scholarship
    })
  }

  async deleteScholarship(id: string) {
    return this.makeRequest(`/api/scholarships/${id}`, {
      method: 'DELETE'
    })
  }
}

export const apiService = new ApiService() 