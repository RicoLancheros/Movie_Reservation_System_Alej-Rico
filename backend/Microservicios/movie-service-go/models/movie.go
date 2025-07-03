package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Movie struct {
	ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Title       string             `json:"title" bson:"title" validate:"required"`
	Description string             `json:"description" bson:"description" validate:"required"`
	PosterImage string             `json:"posterImage" bson:"posterImage" validate:"required"`
	Genre       string             `json:"genre" bson:"genre" validate:"required"`
	Duration    int                `json:"duration" bson:"duration" validate:"required,min=1"`
	Rating      string             `json:"rating" bson:"rating" validate:"required"`
	ReleaseDate string             `json:"releaseDate" bson:"releaseDate" validate:"required"`
	Director    string             `json:"director" bson:"director" validate:"required"`
	Cast        []string           `json:"cast" bson:"cast"`
	CreatedAt   time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt   time.Time          `json:"updatedAt" bson:"updatedAt"`
}

// MovieRequest representa la solicitud para crear/actualizar una película
type MovieRequest struct {
	Title       string   `json:"title" validate:"required"`
	Description string   `json:"description" validate:"required"`
	PosterImage string   `json:"posterImage" validate:"required"`
	Genre       string   `json:"genre" validate:"required"`
	Duration    int      `json:"duration" validate:"required,min=1"`
	Rating      string   `json:"rating" validate:"required"`
	ReleaseDate string   `json:"releaseDate" validate:"required"`
	Director    string   `json:"director" validate:"required"`
	Cast        []string `json:"cast"`
}

// MovieResponse representa la respuesta de una película
type MovieResponse struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	PosterImage string    `json:"posterImage"`
	Genre       string    `json:"genre"`
	Duration    int       `json:"duration"`
	Rating      string    `json:"rating"`
	ReleaseDate string    `json:"releaseDate"`
	Director    string    `json:"director"`
	Cast        []string  `json:"cast"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// ToMovieResponse convierte Movie a MovieResponse
func (m *Movie) ToMovieResponse() MovieResponse {
	return MovieResponse{
		ID:          m.ID.Hex(),
		Title:       m.Title,
		Description: m.Description,
		PosterImage: m.PosterImage,
		Genre:       m.Genre,
		Duration:    m.Duration,
		Rating:      m.Rating,
		ReleaseDate: m.ReleaseDate,
		Director:    m.Director,
		Cast:        m.Cast,
		CreatedAt:   m.CreatedAt,
		UpdatedAt:   m.UpdatedAt,
	}
}

// FromMovieRequest convierte MovieRequest a Movie
func (m *Movie) FromMovieRequest(req MovieRequest) {
	m.Title = req.Title
	m.Description = req.Description
	m.PosterImage = req.PosterImage
	m.Genre = req.Genre
	m.Duration = req.Duration
	m.Rating = req.Rating
	m.ReleaseDate = req.ReleaseDate
	m.Director = req.Director
	m.Cast = req.Cast
	m.UpdatedAt = time.Now()
}
