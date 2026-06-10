package com.aivle.bookapp.controller;

import com.aivle.bookapp.entity.User;
import com.aivle.bookapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");

        Optional<User> user = userRepository.findByUsernameAndPassword(username, password);

        if (user.isPresent()) {
            // 성공 시 이름(name)을 리액트로 전달
            return ResponseEntity.ok(Map.of("success", true, "name", user.get().getName()));
        } else {
            // 실패 시 401 에러 반환
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "로그인 실패"));
        }
    }
}