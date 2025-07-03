package config

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func ConnectMongoDB() (*mongo.Client, error) {
	// Configuración de MongoDB
	mongoHost := getEnv("MONGO_HOST", "localhost")
	mongoPort := getEnv("MONGO_PORT", "27017") // Puerto interno de Docker
	mongoUser := getEnv("MONGO_USER", "root")
	mongoPassword := getEnv("MONGO_PASSWORD", "ContraSegura")
	mongoDatabase := getEnv("MONGO_DATABASE", "movie_service_db")

	// Crear URI de conexión
	uri := fmt.Sprintf("mongodb://%s:%s@%s:%s/%s?authSource=admin",
		mongoUser, mongoPassword, mongoHost, mongoPort, mongoDatabase)

	log.Printf("Connecting to MongoDB with URI: mongodb://%s:***@%s:%s/%s?authSource=admin",
		mongoUser, mongoHost, mongoPort, mongoDatabase)

	// Configurar opciones del cliente
	clientOptions := options.Client().ApplyURI(uri)

	// Crear contexto con timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Conectar a MongoDB
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to MongoDB: %w", err)
	}

	// Verificar conexión
	if err := client.Ping(ctx, nil); err != nil {
		return nil, fmt.Errorf("failed to ping MongoDB: %w", err)
	}

	log.Println("Connected to MongoDB successfully")
	return client, nil
}

func GetDatabase(client *mongo.Client) *mongo.Database {
	mongoDatabase := getEnv("MONGO_DATABASE", "movie_service_db")
	return client.Database(mongoDatabase)
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
