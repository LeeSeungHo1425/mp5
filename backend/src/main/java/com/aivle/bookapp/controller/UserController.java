package com.aivle.bookapp.controller;

import com.aivle.bookapp.entity.User;
import com.aivle.bookapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        User savedUser = userService.signup(user);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "회원가입 성공",
                "userId", savedUser.getUserId(),
                "username", savedUser.getUsername()
        ));
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {

        String userId = loginData.get("userId");
        String userpassword = loginData.get("userpassword");

        User loginUser = userService.login(userId, userpassword);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "로그인 성공",
                "userId", loginUser.getUserId(),
                "username", loginUser.getUsername()
        ));
    }
}