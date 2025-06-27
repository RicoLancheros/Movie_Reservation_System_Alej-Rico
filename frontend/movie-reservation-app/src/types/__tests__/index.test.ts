import { describe, it, expect } from 'vitest'
import type { User, Movie, Seat, Reservation } from '../index'

describe('Types', () => {
  it('should create valid User type', () => {
    const user: User = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      phone: '+57 300 123 4567',
      birthDate: '1990-01-01',
      preferences: {
        notifications: true,
        language: 'es',
        favoriteGenres: ['Action']
      },
      roles: [{ id: '1', name: 'ROLE_USER' }]
    }

    expect(user.id).toBe('1')
    expect(user.username).toBe('testuser')
    expect(user.email).toBe('test@example.com')
    expect(user.preferences?.language).toBe('es')
  })

  it('should create valid Movie type', () => {
    const movie: Movie = {
      id: '1',
      title: 'Test Movie',
      description: 'A test movie',
      posterImage: 'test.jpg',
      genre: 'Action',
      duration: 120,
      rating: 'PG-13',
      releaseDate: '2024-01-01',
      director: 'Test Director',
      cast: ['Actor 1', 'Actor 2']
    }

    expect(movie.id).toBe('1')
    expect(movie.title).toBe('Test Movie')
    expect(movie.duration).toBe(120)
    expect(movie.cast).toEqual(['Actor 1', 'Actor 2'])
  })

  it('should create valid Seat type', () => {
    const seat: Seat = {
      id: 'A1',
      row: 'A',
      number: 1,
      status: 'available',
      type: 'regular',
      price: 15000
    }

    expect(seat.id).toBe('A1')
    expect(seat.row).toBe('A')
    expect(seat.number).toBe(1)
    expect(seat.status).toBe('available')
    expect(seat.type).toBe('regular')
    expect(seat.price).toBe(15000)
  })

  it('should create valid Reservation type', () => {
    const reservation: Reservation = {
      id: 'RES-1',
      userId: '1',
      showtimeId: '1',
      seatIds: ['A1', 'A2'],
      totalPrice: 30000,
      status: 'confirmed',
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z',
      transactionId: 'TXN-1'
    }

    expect(reservation.id).toBe('RES-1')
    expect(reservation.seatIds).toEqual(['A1', 'A2'])
    expect(reservation.totalPrice).toBe(30000)
    expect(reservation.status).toBe('confirmed')
  })

  it('should handle different seat statuses', () => {
    const statuses: Seat['status'][] = ['available', 'selected', 'occupied', 'accessible', 'disabled']
    
    statuses.forEach(status => {
      const seat: Seat = {
        id: 'A1',
        row: 'A',
        number: 1,
        status,
        type: 'regular',
        price: 15000
      }
      expect(seat.status).toBe(status)
    })
  })

  it('should handle different seat types', () => {
    const types: Seat['type'][] = ['regular', 'vip', 'accessible']
    
    types.forEach(type => {
      const seat: Seat = {
        id: 'A1',
        row: 'A',
        number: 1,
        status: 'available',
        type,
        price: 15000
      }
      expect(seat.type).toBe(type)
    })
  })

  it('should handle different user languages', () => {
    const languages = ['es', 'en'] as const
    
    languages.forEach(language => {
      const user: User = {
        id: '1',
        username: 'test',
        email: 'test@example.com',
        preferences: {
          notifications: true,
          language,
          favoriteGenres: []
        },
        roles: []
      }
      expect(user.preferences?.language).toBe(language)
    })
  })
}) 