package utils

import (
	"fmt"
	"movie-service-go/models"
	"strings"
)

func ValidateMovieRequest(req *models.MovieRequest) error {
	// Validar título
	if len(strings.TrimSpace(req.Title)) == 0 {
		return fmt.Errorf("el título es obligatorio")
	}
	if len(req.Title) > 200 {
		return fmt.Errorf("el título no puede tener más de 200 caracteres")
	}

	// Validar descripción
	if len(strings.TrimSpace(req.Description)) == 0 {
		return fmt.Errorf("la descripción es obligatoria")
	}
	if len(req.Description) > 1000 {
		return fmt.Errorf("la descripción no puede tener más de 1000 caracteres")
	}

	// Validar imagen del póster
	if len(strings.TrimSpace(req.PosterImage)) == 0 {
		return fmt.Errorf("la imagen del póster es obligatoria")
	}

	// Validar género
	if len(strings.TrimSpace(req.Genre)) == 0 {
		return fmt.Errorf("el género es obligatorio")
	}

	// Validar duración
	if req.Duration <= 0 {
		return fmt.Errorf("la duración debe ser mayor a 0 minutos")
	}
	if req.Duration > 600 {
		return fmt.Errorf("la duración no puede ser mayor a 600 minutos")
	}

	// Validar clasificación
	if len(strings.TrimSpace(req.Rating)) == 0 {
		return fmt.Errorf("la clasificación es obligatoria")
	}

	// Validar fecha de estreno
	if len(strings.TrimSpace(req.ReleaseDate)) == 0 {
		return fmt.Errorf("la fecha de estreno es obligatoria")
	}

	// Validar director
	if len(strings.TrimSpace(req.Director)) == 0 {
		return fmt.Errorf("el director es obligatorio")
	}

	return nil
}
