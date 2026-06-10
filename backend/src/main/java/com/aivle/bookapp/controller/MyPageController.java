package com.aivle.bookapp.controller;

import com.aivle.bookapp.dto.MyPageResponse;
import com.aivle.bookapp.service.MyPageService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mypage")
@RequiredArgsConstructor
public class MyPageController {

    private final MyPageService myPageService;

    @GetMapping
    public MyPageResponse getMyPage(HttpSession session) {

        String loginUserID = (String) session.getAttribute("loginUserID");

        if (loginUserID == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }

        return myPageService.getMyPage(loginUserID);
    }
}