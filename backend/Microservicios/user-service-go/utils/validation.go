package utils

import (
	"fmt"
	"regexp"
	"strings"
	"user-service-go/models"
)

func ValidateRegisterRequest(req *models.RegisterRequest) error {
	// Validar username
	if len(strings.TrimSpace(req.Username)) < 3 {
		return fmt.Errorf("el nombre de usuario debe tener al menos 3 caracteres")
	}
	if len(req.Username) > 50 {
		return fmt.Errorf("el nombre de usuario no puede tener más de 50 caracteres")
	}

	// Validar email
	if !isValidEmail(req.Email) {
		return fmt.Errorf("el email no tiene un formato válido")
	}
	if len(req.Email) > 80 {
		return fmt.Errorf("el email no puede tener más de 80 caracteres")
	}

	// Validar contraseña
	if len(req.Password) < 6 {
		return fmt.Errorf("la contraseña debe tener al menos 6 caracteres")
	}
	if len(req.Password) > 120 {
		return fmt.Errorf("la contraseña no puede tener más de 120 caracteres")
	}

	// Validar nombres (opcional)
	if req.FirstName != nil && len(*req.FirstName) > 50 {
		return fmt.Errorf("el nombre no puede tener más de 50 caracteres")
	}
	if req.LastName != nil && len(*req.LastName) > 50 {
		return fmt.Errorf("el apellido no puede tener más de 50 caracteres")
	}

	return nil
}

func isValidEmail(email string) bool {
	// Patrón básico para validar email
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return emailRegex.MatchString(email)
}
