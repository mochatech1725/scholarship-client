import { useAuthStore } from 'src/stores/auth.store'
import type { Profile, Application, RegisterData, Recommender } from 'src/types'
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
  async login() {
    return this.makeRequest('/api/auth/login')
  }

  async register(userData: RegisterData) {
    return this.makeRequest('/api/auth/register', {
      method: 'POST',
      data: userData
    })
  }

  async logout() {
    return this.makeRequest('/api/auth/logout', {
      method: 'POST'
    })
  }

  // User endpoints
  async getUser(userId?: string) {
    if (userId) {
      return this.makeRequest(`/api/users/getById/${userId}`)
    }
    return this.makeRequest('/api/auth/login')
  }

  async updateProfile(profile: Profile) {
    return this.makeRequest('/api/users/profile', {
      method: 'PUT',
      data: profile
    })
  }

  // Application endpoints
  async getApplications() {
    return this.makeRequest('/api/applications/getAll')
  }

  async getApplicationById(id: string) {
    return this.makeRequest(`/api/applications/getById/${id}`)
  }

  async createApplication(application: Omit<Application, 'applicationId'>) {
    return this.makeRequest('/api/applications/create', {
      method: 'POST',
      data: application
    })
  }

  async updateApplication(id: string, application: Application) {
    return this.makeRequest(`/api/applications/update/${id}`, {
      method: 'PUT',
      data: application
    })
  }

  async deleteApplication(id: string) {
    return this.makeRequest(`/api/applications/delete/${id}`, {
      method: 'DELETE'
    })
  }

  async getApplicationsByUserId(userId: string) {
    return this.makeRequest(`/api/applications/getByUserId/${userId}`)
  }

  // Recommender endpoints
  async getRecommendersByUserId(userId: string) {
    return this.makeRequest(`/api/recommenders/getByUserId/${userId}`)
  }

  async getRecommenders() {
    return this.makeRequest('/api/recommenders/getAll')
  }

  async getRecommenderById(id: string) {
    return this.makeRequest(`/api/recommenders/getById/${id}`)
  }

  async createRecommender(recommender: Omit<Recommender, '_id'>) {
    return this.makeRequest('/api/recommenders/create', {
      method: 'POST',
      data: recommender
    })
  }

  async updateRecommender(id: string, recommender: Omit<Recommender, '_id'>) {
    return this.makeRequest(`/api/recommenders/update/${id}`, {
      method: 'PUT',
      data: recommender
    })
  }

  async deleteRecommender(id: string) {
    return this.makeRequest(`/api/recommenders/delete/${id}`, {
      method: 'DELETE'
    })
  }
}

export const apiService = new ApiService() 