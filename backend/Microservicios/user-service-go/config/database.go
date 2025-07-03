package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

func ConnectDB() (*sql.DB, error) {
	// Configuración de la base de datos
	dbHost := getEnv("DB_HOST", "localhost")
	dbPort := getEnv("DB_PORT", "3307")
	dbUser := getEnv("DB_USER", "root")
	dbPassword := getEnv("DB_PASSWORD", "ContraSegura")
	dbName := getEnv("DB_NAME", "user_service_db")

	// Crear DSN (Data Source Name)
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		dbUser, dbPassword, dbHost, dbPort, dbName)

	// Abrir conexión
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	// Verificar conexión
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	log.Println("Connected to MySQL database successfully")

	// Crear tablas si no existen
	if err := createTables(db); err != nil {
		return nil, fmt.Errorf("failed to create tables: %w", err)
	}

	return db, nil
}

func createTables(db *sql.DB) error {
	// Crear tabla de roles
	createRolesTable := `
	CREATE TABLE IF NOT EXISTS roles (
		id BIGINT AUTO_INCREMENT PRIMARY KEY,
		name VARCHAR(20) NOT NULL UNIQUE
	);`

	// Crear tabla de usuarios
	createUsersTable := `
	CREATE TABLE IF NOT EXISTS users (
		id BIGINT AUTO_INCREMENT PRIMARY KEY,
		username VARCHAR(50) NOT NULL UNIQUE,
		password VARCHAR(120) NOT NULL,
		email VARCHAR(80) NOT NULL UNIQUE,
		first_name VARCHAR(50),
		last_name VARCHAR(50),
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	);`

	// Crear tabla de relación usuario-roles
	createUserRolesTable := `
	CREATE TABLE IF NOT EXISTS user_roles (
		user_id BIGINT NOT NULL,
		role_id BIGINT NOT NULL,
		PRIMARY KEY (user_id, role_id),
		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
		FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
	);`

	// Ejecutar creación de tablas
	if _, err := db.Exec(createRolesTable); err != nil {
		return fmt.Errorf("failed to create roles table: %w", err)
	}

	if _, err := db.Exec(createUsersTable); err != nil {
		return fmt.Errorf("failed to create users table: %w", err)
	}

	if _, err := db.Exec(createUserRolesTable); err != nil {
		return fmt.Errorf("failed to create user_roles table: %w", err)
	}

	// Insertar roles por defecto
	if err := insertDefaultRoles(db); err != nil {
		return fmt.Errorf("failed to insert default roles: %w", err)
	}

	log.Println("Database tables created successfully")
	return nil
}

func insertDefaultRoles(db *sql.DB) error {
	roles := []string{"ROLE_USER", "ROLE_ADMIN"}

	for _, role := range roles {
		_, err := db.Exec("INSERT IGNORE INTO roles (name) VALUES (?)", role)
		if err != nil {
			return fmt.Errorf("failed to insert role %s: %w", role, err)
		}
	}

	return nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
