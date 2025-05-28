import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  personId: string
  firstName: string
  lastName: string
  emailAddress: string
  phoneNumber: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = ref(false)

  const login = async (email: string, password: string) => {
    try {
      // TODO: Implement actual API call
      // For now, just mock the response
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
      
      // Validate credentials (mock)
      if (password.length < 8) {
        throw new Error('Invalid credentials')
      }
      
      const mockUser: User = {
        personId: '1',
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: email,
        phoneNumber: '123-456-7890'
      }
      
      user.value = mockUser
      token.value = 'mock-token'
      isAuthenticated.value = true
      
      // Store token in localStorage
      localStorage.setItem('token', 'mock-token')
      
      return true
    } catch (err) {
      console.error('Login failed:', err)
      return false
    }
  }

  const register = async (userData: Omit<User, 'personId'>) => {
    try {
      // TODO: Implement actual API call
      // For now, just mock the response
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
      const mockUser: User = {
        personId: '1',
        ...userData
      }
      
      user.value = mockUser
      token.value = 'mock-token'
      isAuthenticated.value = true
      
      // Store token in localStorage
      localStorage.setItem('token', 'mock-token')
      
      return true
    } catch (err) {
      console.error('Registration failed:', err)
      return false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
  }

  const checkAuth = () => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      token.value = storedToken
      isAuthenticated.value = true
      // TODO: Implement actual API call to get user data
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth
  }
}) 