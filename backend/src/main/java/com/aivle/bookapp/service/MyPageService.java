package com.aivle.bookapp.service;

import com.aivle.bookapp.dto.MyPageResponse;
import com.aivle.bookapp.dto.UserInfoResponse;
import com.aivle.bookapp.entity.User;
import com.aivle.bookapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MyPageService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public MyPageResponse getMyPage(String userID) {

        User user = userRepository.findByUserID(userID)
                .orElseThrow(() -> new RuntimeException("회원 정보를 찾을 수 없습니다."));

        return new MyPageResponse(
                new UserInfoResponse(user),
                List.of(),
                List.of(),
                List.of()
        );
    }
}