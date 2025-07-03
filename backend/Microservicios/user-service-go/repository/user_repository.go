package repository

import (
	"database/sql"
	"fmt"
	"user-service-go/models"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(user *models.User) error {
	query := `INSERT INTO users (username, password, email, first_name, last_name) 
			  VALUES (?, ?, ?, ?, ?)`

	result, err := r.db.Exec(query, user.Username, user.Password, user.Email, user.FirstName, user.LastName)
	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("failed to get last insert id: %w", err)
	}

	user.ID = uint(id)
	return nil
}

func (r *UserRepository) GetByID(id uint) (*models.User, error) {
	user := &models.User{}
	var firstName, lastName sql.NullString

	query := `SELECT id, username, password, email, first_name, last_name, created_at, updated_at 
			  FROM users WHERE id = ?`

	row := r.db.QueryRow(query, id)
	err := row.Scan(&user.ID, &user.Username, &user.Password, &user.Email,
		&firstName, &lastName, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get user by id: %w", err)
	}

	// Manejar campos NULL
	if firstName.Valid {
		user.FirstName = &firstName.String
	}
	if lastName.Valid {
		user.LastName = &lastName.String
	}

	// Cargar roles del usuario
	if err := r.loadUserRoles(user); err != nil {
		return nil, fmt.Errorf("failed to load user roles: %w", err)
	}

	return user, nil
}

func (r *UserRepository) GetByUsername(username string) (*models.User, error) {
	user := &models.User{}
	var firstName, lastName sql.NullString

	query := `SELECT id, username, password, email, first_name, last_name, created_at, updated_at 
			  FROM users WHERE username = ?`

	row := r.db.QueryRow(query, username)
	err := row.Scan(&user.ID, &user.Username, &user.Password, &user.Email,
		&firstName, &lastName, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get user by username: %w", err)
	}

	// Manejar campos NULL
	if firstName.Valid {
		user.FirstName = &firstName.String
	}
	if lastName.Valid {
		user.LastName = &lastName.String
	}

	// Cargar roles del usuario
	if err := r.loadUserRoles(user); err != nil {
		return nil, fmt.Errorf("failed to load user roles: %w", err)
	}

	return user, nil
}

func (r *UserRepository) GetByEmail(email string) (*models.User, error) {
	user := &models.User{}
	var firstName, lastName sql.NullString

	query := `SELECT id, username, password, email, first_name, last_name, created_at, updated_at 
			  FROM users WHERE email = ?`

	row := r.db.QueryRow(query, email)
	err := row.Scan(&user.ID, &user.Username, &user.Password, &user.Email,
		&firstName, &lastName, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get user by email: %w", err)
	}

	// Manejar campos NULL
	if firstName.Valid {
		user.FirstName = &firstName.String
	}
	if lastName.Valid {
		user.LastName = &lastName.String
	}

	// Cargar roles del usuario
	if err := r.loadUserRoles(user); err != nil {
		return nil, fmt.Errorf("failed to load user roles: %w", err)
	}

	return user, nil
}

func (r *UserRepository) GetAll() ([]*models.User, error) {
	query := `SELECT id, username, password, email, first_name, last_name, created_at, updated_at 
			  FROM users ORDER BY created_at DESC`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to get all users: %w", err)
	}
	defer rows.Close()

	var users []*models.User
	for rows.Next() {
		user := &models.User{}
		var firstName, lastName sql.NullString

		err := rows.Scan(&user.ID, &user.Username, &user.Password, &user.Email,
			&firstName, &lastName, &user.CreatedAt, &user.UpdatedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan user: %w", err)
		}

		// Manejar campos NULL
		if firstName.Valid {
			user.FirstName = &firstName.String
		}
		if lastName.Valid {
			user.LastName = &lastName.String
		}

		// Cargar roles del usuario
		if err := r.loadUserRoles(user); err != nil {
			return nil, fmt.Errorf("failed to load user roles: %w", err)
		}

		users = append(users, user)
	}

	return users, nil
}

func (r *UserRepository) Update(user *models.User) error {
	query := `UPDATE users SET username = ?, email = ?, first_name = ?, last_name = ?, 
			  updated_at = CURRENT_TIMESTAMP WHERE id = ?`

	_, err := r.db.Exec(query, user.Username, user.Email, user.FirstName, user.LastName, user.ID)
	if err != nil {
		return fmt.Errorf("failed to update user: %w", err)
	}

	return nil
}

func (r *UserRepository) Delete(id uint) error {
	query := `DELETE FROM users WHERE id = ?`

	_, err := r.db.Exec(query, id)
	if err != nil {
		return fmt.Errorf("failed to delete user: %w", err)
	}

	return nil
}

func (r *UserRepository) ExistsByUsername(username string) (bool, error) {
	var count int
	query := `SELECT COUNT(*) FROM users WHERE username = ?`

	err := r.db.QueryRow(query, username).Scan(&count)
	if err != nil {
		return false, fmt.Errorf("failed to check username existence: %w", err)
	}

	return count > 0, nil
}

func (r *UserRepository) ExistsByEmail(email string) (bool, error) {
	var count int
	query := `SELECT COUNT(*) FROM users WHERE email = ?`

	err := r.db.QueryRow(query, email).Scan(&count)
	if err != nil {
		return false, fmt.Errorf("failed to check email existence: %w", err)
	}

	return count > 0, nil
}

func (r *UserRepository) AddRoleToUser(userID, roleID uint) error {
	query := `INSERT INTO user_roles (user_id, role_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE user_id = user_id`

	_, err := r.db.Exec(query, userID, roleID)
	if err != nil {
		return fmt.Errorf("failed to add role to user: %w", err)
	}

	return nil
}

func (r *UserRepository) loadUserRoles(user *models.User) error {
	query := `SELECT r.id, r.name FROM roles r 
			  INNER JOIN user_roles ur ON r.id = ur.role_id 
			  WHERE ur.user_id = ?`

	rows, err := r.db.Query(query, user.ID)
	if err != nil {
		return fmt.Errorf("failed to load user roles: %w", err)
	}
	defer rows.Close()

	var roles []models.Role
	for rows.Next() {
		role := models.Role{}
		err := rows.Scan(&role.ID, &role.Name)
		if err != nil {
			return fmt.Errorf("failed to scan role: %w", err)
		}
		roles = append(roles, role)
	}

	user.Roles = roles
	return nil
}
