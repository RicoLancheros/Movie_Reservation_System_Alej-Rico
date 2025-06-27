import { describe, it, expect, beforeEach } from 'vitest'
import { useMovieStore } from '../movieStore'

describe('MovieStore', () => {
  beforeEach(() => {
    // Reset store state
    useMovieStore.setState({
      movies: [],
      selectedMovie: null,
      showtimes: [],
      filters: {},
      isLoading: false,
      error: null,
    })
  })

  it('should have initial state', () => {
    const state = useMovieStore.getState()
    expect(state.movies).toEqual([])
    expect(state.selectedMovie).toBeNull()
    expect(state.showtimes).toEqual([])
    expect(state.filters).toEqual({})
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
  })

  it('should set selected movie', () => {
    const mockMovie = {
      id: '1',
      title: 'Test Movie',
      description: 'A test movie',
      posterImage: 'test.jpg',
      genre: 'Action',
      duration: 120,
      rating: 'PG-13',
      releaseDate: '2024-01-01',
      director: 'Test Director',
      cast: ['Actor 1']
    }

    const { setSelectedMovie } = useMovieStore.getState()
    setSelectedMovie(mockMovie)

    const state = useMovieStore.getState()
    expect(state.selectedMovie).toEqual(mockMovie)
  })

  it('should clear selected movie', () => {
    const mockMovie = {
      id: '1',
      title: 'Test Movie',
      description: 'A test movie',
      posterImage: 'test.jpg',
      genre: 'Action',
      duration: 120,
      rating: 'PG-13',
      releaseDate: '2024-01-01',
      director: 'Test Director',
      cast: ['Actor 1']
    }

    const { setSelectedMovie } = useMovieStore.getState()
    
    setSelectedMovie(mockMovie)
    expect(useMovieStore.getState().selectedMovie).toEqual(mockMovie)
    
    setSelectedMovie(null)
    expect(useMovieStore.getState().selectedMovie).toBeNull()
  })

  it('should set filters', () => {
    const { setFilters } = useMovieStore.getState()
    
    setFilters({ genre: 'Action', search: 'Test' })
    
    const state = useMovieStore.getState()
    expect(state.filters.genre).toBe('Action')
    expect(state.filters.search).toBe('Test')
  })

  it('should clear filters', () => {
    const { setFilters, clearFilters } = useMovieStore.getState()
    
    setFilters({ genre: 'Action', search: 'Test' })
    expect(useMovieStore.getState().filters).toEqual({ genre: 'Action', search: 'Test' })
    
    clearFilters()
    expect(useMovieStore.getState().filters).toEqual({})
  })

  it('should set loading state', () => {
    const { setLoading } = useMovieStore.getState()
    
    setLoading(true)
    expect(useMovieStore.getState().isLoading).toBe(true)
    
    setLoading(false)
    expect(useMovieStore.getState().isLoading).toBe(false)
  })

  it('should set error state', () => {
    const { setError } = useMovieStore.getState()
    const errorMessage = 'Test error'
    
    setError(errorMessage)
    expect(useMovieStore.getState().error).toBe(errorMessage)
    
    setError(null)
    expect(useMovieStore.getState().error).toBeNull()
  })

  it('should sync showtimes from admin', () => {
    const mockShowtimes = [
      {
        id: '1',
        movieId: '1',
        movieTitle: 'Test Movie',
        date: '2024-01-01',
        time: '19:30',
        hallId: '1',
        hallName: 'Sala 1',
        price: 15000,
        availableSeats: 48,
        totalSeats: 50
      }
    ]

    const { syncShowtimesFromAdmin } = useMovieStore.getState()
    
    syncShowtimesFromAdmin(mockShowtimes)
    
    const state = useMovieStore.getState()
    expect(state.showtimes).toEqual(mockShowtimes)
  })
}) 