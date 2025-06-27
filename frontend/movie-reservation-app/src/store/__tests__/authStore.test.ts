import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from '../authStore'

// Mock zustand persist
vi.mock('zustand/middleware', () => ({
  persist: (fn: any) => fn,
}))

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
    
    // Clear console logs
    vi.clearAllMocks()
  })

  it('should have initial state', () => {
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
  })

  it('should login with valid credentials', async () => {
    const { login } = useAuthStore.getState()
    
    await login({ username: 'admin', password: 'admin123' })
    
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.user?.username).toBe('admin')
    expect(state.token).toBeTruthy()
  })

  it('should fail login with invalid credentials', async () => {
    const { login } = useAuthStore.getState()
    
    try {
      await login({ username: 'invalid', password: 'wrong' })
    } catch (error) {
      expect(error).toBeDefined()
    }
    
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
  })

  it('should logout successfully', async () => {
    const { login, logout } = useAuthStore.getState()
    
    // Login first
    await login({ username: 'admin', password: 'admin123' })
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
    
    // Then logout
    logout()
    
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
  })

  it('should check if user is admin', async () => {
    const { login, isAdmin } = useAuthStore.getState()
    
    await login({ username: 'admin', password: 'admin123' })
    
    expect(isAdmin()).toBe(true)
  })

  it('should clear error', () => {
    const { clearError } = useAuthStore.getState()
    
    // Set an error manually
    useAuthStore.setState({ error: 'Test error' })
    expect(useAuthStore.getState().error).toBe('Test error')
    
    // Clear the error
    clearError()
    expect(useAuthStore.getState().error).toBeNull()
  })

  describe('register', () => {
    it('should register successfully with valid data', async () => {
      const { register } = useAuthStore.getState()
      
      const userData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User'
      }
      
      await register(userData)
      
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.user?.username).toBe('newuser')
      expect(state.user?.email).toBe('newuser@example.com')
      expect(state.user?.firstName).toBe('New')
      expect(state.user?.lastName).toBe('User')
    })

    it('should fail registration with existing username', async () => {
      const { register } = useAuthStore.getState()
      
      const userData = {
        username: 'admin', // Already exists
        email: 'test@example.com',
        password: 'password123'
      }
      
      await expect(register(userData))
        .rejects.toThrow('El usuario ya existe')
    })

    it('should fail registration with invalid email', async () => {
      const { register } = useAuthStore.getState()
      
      const userData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123'
      }
      
      await expect(register(userData))
        .rejects.toThrow('Email inválido')
    })
  })

  describe('updateUser', () => {
    beforeEach(async () => {
      // Login first
      const { login } = useAuthStore.getState()
      await login({ username: 'admin', password: 'admin123' })
    })

    it('should update user successfully', async () => {
      const { updateUser } = useAuthStore.getState()
      
      await updateUser({
        firstName: 'Updated',
        lastName: 'Name',
        phone: '+57 300 999 8888'
      })
      
      const state = useAuthStore.getState()
      expect(state.user?.firstName).toBe('Updated')
      expect(state.user?.lastName).toBe('Name')
      expect(state.user?.phone).toBe('+57 300 999 8888')
    })

    it('should update user preferences', async () => {
      const { updateUser } = useAuthStore.getState()
      
      await updateUser({
        preferences: {
          notifications: false,
          language: 'en' as const,
          favoriteGenres: ['Horror', 'Thriller']
        }
      })
      
      const state = useAuthStore.getState()
      expect(state.user?.preferences?.notifications).toBe(false)
      expect(state.user?.preferences?.language).toBe('en')
      expect(state.user?.preferences?.favoriteGenres).toEqual(['Horror', 'Thriller'])
    })

    it('should fail update with invalid email', async () => {
      const { updateUser } = useAuthStore.getState()
      
      await expect(updateUser({ email: 'invalid-email' }))
        .rejects.toThrow('Email inválido')
    })
  })

  describe('error handling', () => {
    it('should clear error', async () => {
      const { login, clearError } = useAuthStore.getState()
      
      // Cause an error
      try {
        await login({ username: 'invalid', password: '123' })
      } catch (e) {
        // Expected to fail
      }
      
      expect(useAuthStore.getState().error).toBeTruthy()
      
      clearError()
      
      expect(useAuthStore.getState().error).toBeNull()
    })
  })
}) 