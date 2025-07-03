package repository

import (
	"database/sql"
	"fmt"
	"user-service-go/models"
)

type RoleRepository struct {
	db *sql.DB
}

func NewRoleRepository(db *sql.DB) *RoleRepository {
	return &RoleRepository{db: db}
}

func (r *RoleRepository) GetByName(name string) (*models.Role, error) {
	role := &models.Role{}
	query := `SELECT id, name FROM roles WHERE name = ?`

	row := r.db.QueryRow(query, name)
	err := row.Scan(&role.ID, &role.Name)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get role by name: %w", err)
	}

	return role, nil
}

func (r *RoleRepository) GetByID(id uint) (*models.Role, error) {
	role := &models.Role{}
	query := `SELECT id, name FROM roles WHERE id = ?`

	row := r.db.QueryRow(query, id)
	err := row.Scan(&role.ID, &role.Name)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get role by id: %w", err)
	}

	return role, nil
}

func (r *RoleRepository) GetAll() ([]*models.Role, error) {
	query := `SELECT id, name FROM roles ORDER BY name`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to get all roles: %w", err)
	}
	defer rows.Close()

	var roles []*models.Role
	for rows.Next() {
		role := &models.Role{}
		err := rows.Scan(&role.ID, &role.Name)
		if err != nil {
			return nil, fmt.Errorf("failed to scan role: %w", err)
		}
		roles = append(roles, role)
	}

	return roles, nil
}
