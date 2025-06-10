package com.example.demo.repository;

import com.example.demo.model.User;


import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    List<User> findByRole(String role);
    List<User> findByRoleIgnoreCase(String role);
    boolean existsByEmail(String email);
    Optional<User> findFirstByRoleOrderByIdAsc(String role);


  
}