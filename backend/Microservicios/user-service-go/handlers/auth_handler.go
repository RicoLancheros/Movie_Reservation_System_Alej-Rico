package handlers

import (
	"net/http"
	"user-service-go/models"
	"user-service-go/repository"
	"user-service-go/utils"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler struct {
	userRepo *repository.UserRepository
	roleRepo *repository.RoleRepository
}

func NewAuthHandler(userRepo *repository.UserRepository, roleRepo *repository.RoleRepository) *AuthHandler {
	return &AuthHandler{
		userRepo: userRepo,
		roleRepo: roleRepo,
	}
}

func (h *AuthHandler) Login(c *gin.Context) {
	var loginReq models.LoginRequest
	if err := c.ShouldBindJSON(&loginReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos de entrada inválidos"})
		return
	}

	// Buscar usuario por username
	user, err := h.userRepo.GetByUsername(loginReq.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error interno del servidor"})
		return
	}

	if user == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Credenciales inválidas"})
		return
	}

	// Verificar contraseña
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginReq.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Credenciales inválidas"})
		return
	}

	// Generar token JWT
	token, err := utils.GenerateJWT(user.ID, user.Username, user.Roles)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al generar token"})
		return
	}

	// Preparar respuesta
	response := models.AuthResponse{
		Token: token,
		User:  user.ToUserResponse(),
	}

	c.JSON(http.StatusOK, response)
}

func (h *AuthHandler) Register(c *gin.Context) {
	var registerReq models.RegisterRequest
	if err := c.ShouldBindJSON(&registerReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos de entrada inválidos"})
		return
	}

	// Validar datos básicos
	if len(registerReq.Username) < 3 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "El username debe tener al menos 3 caracteres"})
		return
	}
	if len(registerReq.Password) < 6 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "La contraseña debe tener al menos 6 caracteres"})
		return
	}

	// Hash de la contraseña
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(registerReq.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al procesar contraseña"})
		return
	}

	// Crear usuario básico
	user := &models.User{
		Username:  registerReq.Username,
		Password:  string(hashedPassword),
		Email:     registerReq.Email,
		FirstName: registerReq.FirstName,
		LastName:  registerReq.LastName,
	}

	if err := h.userRepo.Create(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al crear usuario", "detail": err.Error()})
		return
	}

	// Respuesta simplificada
	response := models.AuthResponse{
		Token: "demo-token-" + registerReq.Username,
		User:  user.ToUserResponse(),
	}

	c.JSON(http.StatusCreated, response)
}
