import { useAuthStore } from 'src/stores/auth.store'
import type { Profile, Scholarship } from 'src/types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

class ApiService {
  private async getAuthHeaders() {
    const authStore = useAuthStore()
    const token = await authStore.getToken()
    
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const headers = await this.getAuthHeaders()
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers
      }
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
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
      body: JSON.stringify(profile)
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
      body: JSON.stringify(scholarship)
    })
  }

  async updateScholarship(id: string, scholarship: Scholarship) {
    return this.makeRequest(`/api/scholarships/${id}`, {
      method: 'PUT',
      body: JSON.stringify(scholarship)
    })
  }

  async deleteScholarship(id: string) {
    return this.makeRequest(`/api/scholarships/${id}`, {
      method: 'DELETE'
    })
  }
}

export const apiService = new ApiService() 