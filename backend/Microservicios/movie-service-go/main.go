package main

import (
	"log"
	"movie-service-go/config"
	"movie-service-go/handlers"
	"movie-service-go/repository"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Cargar variables de entorno
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Conectar a MongoDB
	client, err := config.ConnectMongoDB()
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}
	defer client.Disconnect(nil)

	// Inicializar repositorio
	movieRepo := repository.NewMovieRepository(client)

	// Inicializar handlers
	movieHandler := handlers.NewMovieHandler(movieRepo)

	// Configurar Gin
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

	// Rutas de películas
	movies := r.Group("/api/movies")
	{
		movies.GET("", movieHandler.GetAllMovies)
		movies.GET("/:id", movieHandler.GetMovieById)
		movies.POST("", movieHandler.CreateMovie)
		movies.PUT("/:id", movieHandler.UpdateMovie)
		movies.DELETE("/:id", movieHandler.DeleteMovie)
		movies.GET("/search", movieHandler.SearchMovies)
		movies.GET("/genres", movieHandler.GetAllGenres)
	}

	// Inicializar datos de prueba
	if err := movieRepo.InitializeData(); err != nil {
		log.Println("Warning: Failed to initialize sample data:", err)
	}

	// Iniciar servidor
	log.Println("Movie Service starting on port 8080...")
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
