package models

import (
	"time"
)

type User struct {
	ID        uint      `json:"id" db:"id"`
	Username  string    `json:"username" db:"username" validate:"required,min=3,max=50"`
	Password  string    `json:"-" db:"password" validate:"required,min=6"`
	Email     string    `json:"email" db:"email" validate:"required,email,max=80"`
	FirstName *string   `json:"firstName" db:"first_name"`
	LastName  *string   `json:"lastName" db:"last_name"`
	CreatedAt time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt time.Time `json:"updatedAt" db:"updated_at"`
	Roles     []Role    `json:"roles"`
}

type Role struct {
	ID   uint   `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
}

// UserResponse representa la respuesta del usuario sin datos sensibles
type UserResponse struct {
	ID        uint      `json:"id"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	FirstName *string   `json:"firstName"`
	LastName  *string   `json:"lastName"`
	CreatedAt time.Time `json:"createdAt"`
	Roles     []Role    `json:"roles"`
}

// LoginRequest representa la solicitud de login
type LoginRequest struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

// RegisterRequest representa la solicitud de registro
type RegisterRequest struct {
	Username  string  `json:"username" validate:"required,min=3,max=50"`
	Password  string  `json:"password" validate:"required,min=6"`
	Email     string  `json:"email" validate:"required,email,max=80"`
	FirstName *string `json:"firstName"`
	LastName  *string `json:"lastName"`
}

// AuthResponse representa la respuesta de autenticación
type AuthResponse struct {
	Token string       `json:"token"`
	User  UserResponse `json:"user"`
}

// ToUserResponse convierte User a UserResponse
func (u *User) ToUserResponse() UserResponse {
	return UserResponse{
		ID:        u.ID,
		Username:  u.Username,
		Email:     u.Email,
		FirstName: u.FirstName,
		LastName:  u.LastName,
		CreatedAt: u.CreatedAt,
		Roles:     u.Roles,
	}
}
