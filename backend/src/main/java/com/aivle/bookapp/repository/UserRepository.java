package com.aivle.bookapp.repository;

import com.aivle.bookapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByUserID(String userID);


    Optional<User> findByUserID(String userID);
}