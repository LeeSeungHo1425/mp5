package com.aivle.bookapp.service;

import com.aivle.bookapp.entity.User;
import com.aivle.bookapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User signup(String userID, String userpassword) {

        if (userRepository.existsByUserID(userID)) {
            throw new RuntimeException("이미 사용중인 아이디입니다.");
        }

        String encodedPassword = passwordEncoder.encode(userpassword);

        User user = new User();
        user.setUserID(userID);
        user.setUserpassword(encodedPassword);

        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public boolean login(String userID, String userpassword) {

        User user = userRepository.findByUserID(userID)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 아이디입니다."));

        return passwordEncoder.matches(userpassword, user.getUserpassword());
    }
}