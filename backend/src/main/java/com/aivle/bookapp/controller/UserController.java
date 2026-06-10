package com.aivle.bookapp.controller;

import com.aivle.bookapp.dto.LoginRequest;
import com.aivle.bookapp.dto.SignupRequest;
import com.aivle.bookapp.entity.User;
import com.aivle.bookapp.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public User signup(@RequestBody SignupRequest request) {
        return userService.signup(
                request.getUserID(),
                request.getUserpassword()
        );
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request, HttpSession session) {

        boolean result = userService.login(
                request.getUserID(),
                request.getUserpassword()
        );

        if (!result) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        session.setAttribute("loginUserID", request.getUserID());

        return "로그인 성공";
    }

    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "로그아웃 성공";
    }
}