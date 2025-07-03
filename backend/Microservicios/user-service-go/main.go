package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"-"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type RegisterRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

// Simulación de base de datos en memoria
var users = []User{
	{ID: 1, Username: "admin", Email: "admin@cinereserva.com", Password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi"}, // password
	{ID: 2, Username: "user", Email: "user@cinereserva.com", Password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi"},   // password
}
var nextID uint = 3

func main() {
	r := gin.Default()

	// Middleware CORS
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization, Cache-Control, Pragma")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Rutas de autenticación
	auth := r.Group("/api/auth")
	{
		auth.POST("/login", login)
		auth.POST("/register", register)
	}

	// Rutas de usuarios
	users := r.Group("/api/users")
	{
		users.GET("", getAllUsers)
		users.GET("/:id", getUserById)
	}

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "user-service-go", "time": time.Now()})
	})

	log.Println("User Service (Go) starting on port 8081...")
	if err := r.Run(":8081"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

func getAllUsers(c *gin.Context) {
	var response []User
	for _, user := range users {
		response = append(response, User{
			ID:       user.ID,
			Username: user.Username,
			Email:    user.Email,
		})
	}
	c.JSON(http.StatusOK, response)
}

func getUserById(c *gin.Context) {
	id := c.Param("id")
	for _, user := range users {
		if user.ID == 1 && id == "1" || user.ID == 2 && id == "2" {
			c.JSON(http.StatusOK, User{
				ID:       user.ID,
				Username: user.Username,
				Email:    user.Email,
			})
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
}

func login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}

	for _, user := range users {
		if user.Username == req.Username {
			if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err == nil {
				response := AuthResponse{
					Token: "jwt-token-" + user.Username + "-" + time.Now().Format("20060102150405"),
					User: User{
						ID:       user.ID,
						Username: user.Username,
						Email:    user.Email,
					},
				}
				c.JSON(http.StatusOK, response)
				return
			}
		}
	}
	c.JSON(http.StatusUnauthorized, gin.H{"error": "Credenciales inválidas"})
}

func register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}

	// Validaciones básicas
	if len(req.Username) < 3 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username debe tener al menos 3 caracteres"})
		return
	}
	if len(req.Password) < 6 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password debe tener al menos 6 caracteres"})
		return
	}

	// Verificar si el usuario ya existe
	for _, user := range users {
		if user.Username == req.Username || user.Email == req.Email {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Usuario o email ya existe"})
			return
		}
	}

	// Hash de la contraseña
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al procesar contraseña"})
		return
	}

	// Crear nuevo usuario
	newUser := User{
		ID:       nextID,
		Username: req.Username,
		Email:    req.Email,
		Password: string(hashedPassword),
	}
	users = append(users, newUser)
	nextID++

	response := AuthResponse{
		Token: "jwt-token-" + newUser.Username + "-" + time.Now().Format("20060102150405"),
		User: User{
			ID:       newUser.ID,
			Username: newUser.Username,
			Email:    newUser.Email,
		},
	}

	c.JSON(http.StatusCreated, response)
}
