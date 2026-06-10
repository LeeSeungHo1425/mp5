package com.aivle.bookapp.entity;

import com.aivle.bookapp.dto.MyPageResponse;
import com.aivle.bookapp.repository.UserRepository;
import com.aivle.bookapp.service.MyPageService;
import com.aivle.bookapp.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MyPage {
    private final UserRepository userRepository;
    private final UserService userService;
    private final MyPageService myPageService;

    @Transactional(readOnly = true)
    public MyPageResponse getMyPage(HttpSession session) {

        String userID = (String) session.getAttribute("loginUserID");

        if (userID == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }

        return myPageService.getMyPage(UserID);
    }
}
