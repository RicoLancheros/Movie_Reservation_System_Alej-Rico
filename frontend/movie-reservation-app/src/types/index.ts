// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: Role[];
}

export interface Role {
  id: string;
  name: 'ROLE_USER' | 'ROLE_ADMIN';
}

// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Movie Types
export interface Movie {
  id: string;
  title: string;
  description: string;
  posterImage: string;
  genre: string;
  duration: number; // minutes
  rating: string;
  releaseDate: string;
  director: string;
  cast: string[];
}

// Showtime Types
export interface Showtime {
  id: string;
  movieId: string;
  date: string;
  time: string;
  hallId: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
}

// Seat Types
export type SeatStatus = 'available' | 'occupied' | 'selected' | 'disabled' | 'accessible';

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
  type: 'regular' | 'accessible';
}

// Hall Types
export interface Hall {
  id: string;
  name: string;
  seats: Seat[][];
  totalSeats: number;
}

// Reservation Types
export interface Reservation {
  id: string;
  userId: string;
  showtimeId: string;
  movieTitle: string;
  date: string;
  time: string;
  seats: Seat[];
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface CreateReservationRequest {
  showtimeId: string;
  seatIds: string[];
}

// Payment Types
export interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  cardType: 'credit' | 'debit';
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  message: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}

// Filter Types
export interface MovieFilters {
  genre?: string;
  search?: string;
  sortBy?: 'title' | 'releaseDate' | 'rating';
  sortOrder?: 'asc' | 'desc';
} 