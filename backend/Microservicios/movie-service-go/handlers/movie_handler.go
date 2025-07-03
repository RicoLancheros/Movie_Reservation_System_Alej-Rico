package handlers

import (
	"movie-service-go/models"
	"movie-service-go/repository"
	"movie-service-go/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type MovieHandler struct {
	movieRepo *repository.MovieRepository
}

func NewMovieHandler(movieRepo *repository.MovieRepository) *MovieHandler {
	return &MovieHandler{
		movieRepo: movieRepo,
	}
}

func (h *MovieHandler) GetAllMovies(c *gin.Context) {
	movies, err := h.movieRepo.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener películas"})
		return
	}

	// Convertir a respuesta
	var movieResponses []models.MovieResponse
	for _, movie := range movies {
		movieResponses = append(movieResponses, movie.ToMovieResponse())
	}

	c.JSON(http.StatusOK, movieResponses)
}

func (h *MovieHandler) GetMovieById(c *gin.Context) {
	id := c.Param("id")

	movie, err := h.movieRepo.GetByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener película"})
		return
	}

	if movie == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Película no encontrada"})
		return
	}

	c.JSON(http.StatusOK, movie.ToMovieResponse())
}

func (h *MovieHandler) CreateMovie(c *gin.Context) {
	var movieReq models.MovieRequest
	if err := c.ShouldBindJSON(&movieReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos de entrada inválidos"})
		return
	}

	// Validar datos
	if err := utils.ValidateMovieRequest(&movieReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Crear película
	movie := &models.Movie{}
	movie.FromMovieRequest(movieReq)

	if err := h.movieRepo.Create(movie); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al crear película"})
		return
	}

	c.JSON(http.StatusCreated, movie.ToMovieResponse())
}

func (h *MovieHandler) UpdateMovie(c *gin.Context) {
	id := c.Param("id")

	// Verificar que la película existe
	existingMovie, err := h.movieRepo.GetByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener película"})
		return
	}

	if existingMovie == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Película no encontrada"})
		return
	}

	var movieReq models.MovieRequest
	if err := c.ShouldBindJSON(&movieReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos de entrada inválidos"})
		return
	}

	// Validar datos
	if err := utils.ValidateMovieRequest(&movieReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Actualizar película
	existingMovie.FromMovieRequest(movieReq)

	if err := h.movieRepo.Update(id, existingMovie); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar película"})
		return
	}

	// Obtener película actualizada
	updatedMovie, err := h.movieRepo.GetByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener película actualizada"})
		return
	}

	c.JSON(http.StatusOK, updatedMovie.ToMovieResponse())
}

func (h *MovieHandler) DeleteMovie(c *gin.Context) {
	id := c.Param("id")

	// Verificar que la película existe
	movie, err := h.movieRepo.GetByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener película"})
		return
	}

	if movie == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Película no encontrada"})
		return
	}

	if err := h.movieRepo.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al eliminar película"})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

func (h *MovieHandler) SearchMovies(c *gin.Context) {
	title := c.Query("title")
	genre := c.Query("genre")

	movies, err := h.movieRepo.Search(title, genre)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al buscar películas"})
		return
	}

	// Convertir a respuesta
	var movieResponses []models.MovieResponse
	for _, movie := range movies {
		movieResponses = append(movieResponses, movie.ToMovieResponse())
	}

	c.JSON(http.StatusOK, movieResponses)
}

func (h *MovieHandler) GetAllGenres(c *gin.Context) {
	genres, err := h.movieRepo.GetAllGenres()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener géneros"})
		return
	}

	c.JSON(http.StatusOK, genres)
}
