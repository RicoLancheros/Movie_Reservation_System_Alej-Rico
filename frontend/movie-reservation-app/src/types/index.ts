// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  birthDate?: string;
  preferences?: UserPreferences;
  roles: Role[];
}

export interface UserPreferences {
  notifications: boolean;
  language: 'es' | 'en';
  favoriteGenres: string[];
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
  movieTitle?: string; // Para mostrar en tablas
  date: string;
  time: string;
  hallId: string;
  hallName?: string; // Para mostrar en tablas
  price: number;
  availableSeats: number;
  totalSeats: number;
}

// Admin Showtime Form Types
export interface ShowtimeFormData {
  movieId: string;
  date: string;
  time: string;
  hallId: string;
  price: string; // String para formularios, se convierte a number
}

export interface CreateShowtimeRequest {
  movieId: string;
  date: string;
  time: string;
  hallId: string;
  price: number;
}

// Seat Types
export type SeatStatus = 'available' | 'occupied' | 'selected' | 'disabled' | 'accessible';

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
  type: 'regular' | 'accessible' | 'vip';
  price?: number; // Precio específico del asiento
}

// Hall Types
export interface Hall {
  id: string;
  name: string;
  seats: Seat[][];
  totalSeats: number;
  capacity: number; // Para admin
}

// Simple Hall for admin forms
export interface HallOption {
  id: string;
  name: string;
  capacity: number;
}

// Reservation Types
export interface Reservation {
  id: string;
  userId: string;
  showtimeId: string;
  seatIds: string[];
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
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
  method: 'credit' | 'debit';
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
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

// Admin Dashboard Types
export interface AdminStats {
  totalMovies: number;
  totalShowtimes: number;
  totalReservations: number;
  totalRevenue: number;
} 