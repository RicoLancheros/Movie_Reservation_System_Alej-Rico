package handlers

import (
	"net/http"
	"strconv"
	"user-service-go/models"
	"user-service-go/repository"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userRepo *repository.UserRepository
}

func NewUserHandler(userRepo *repository.UserRepository) *UserHandler {
	return &UserHandler{
		userRepo: userRepo,
	}
}

func (h *UserHandler) GetAllUsers(c *gin.Context) {
	// Endpoint simplificado para pruebas
	c.JSON(http.StatusOK, []models.UserResponse{})
}

func (h *UserHandler) GetUserById(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	user, err := h.userRepo.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener usuario"})
		return
	}

	if user == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		return
	}

	c.JSON(http.StatusOK, user.ToUserResponse())
}

func (h *UserHandler) UpdateUser(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	// Verificar que el usuario existe
	existingUser, err := h.userRepo.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener usuario"})
		return
	}

	if existingUser == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		return
	}

	// Parsear datos de actualización
	var updateReq struct {
		Username  string  `json:"username"`
		Email     string  `json:"email"`
		FirstName *string `json:"firstName"`
		LastName  *string `json:"lastName"`
	}

	if err := c.ShouldBindJSON(&updateReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos de entrada inválidos"})
		return
	}

	// Verificar username único (si se está cambiando)
	if updateReq.Username != existingUser.Username {
		exists, err := h.userRepo.ExistsByUsername(updateReq.Username)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error interno del servidor"})
			return
		}
		if exists {
			c.JSON(http.StatusBadRequest, gin.H{"error": "El nombre de usuario ya está en uso"})
			return
		}
	}

	// Verificar email único (si se está cambiando)
	if updateReq.Email != existingUser.Email {
		exists, err := h.userRepo.ExistsByEmail(updateReq.Email)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error interno del servidor"})
			return
		}
		if exists {
			c.JSON(http.StatusBadRequest, gin.H{"error": "El email ya está en uso"})
			return
		}
	}

	// Actualizar campos
	existingUser.Username = updateReq.Username
	existingUser.Email = updateReq.Email
	existingUser.FirstName = updateReq.FirstName
	existingUser.LastName = updateReq.LastName

	if err := h.userRepo.Update(existingUser); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar usuario"})
		return
	}

	// Obtener usuario actualizado
	updatedUser, err := h.userRepo.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener usuario actualizado"})
		return
	}

	c.JSON(http.StatusOK, updatedUser.ToUserResponse())
}

func (h *UserHandler) DeleteUser(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	// Verificar que el usuario existe
	user, err := h.userRepo.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener usuario"})
		return
	}

	if user == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		return
	}

	if err := h.userRepo.Delete(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al eliminar usuario"})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
