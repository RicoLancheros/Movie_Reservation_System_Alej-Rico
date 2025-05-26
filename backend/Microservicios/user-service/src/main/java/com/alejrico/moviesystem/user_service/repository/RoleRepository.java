package com.alejrico.moviesystem.user_service.repository;

import com.alejrico.moviesystem.user_service.model.ERole;
import com.alejrico.moviesystem.user_service.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
}