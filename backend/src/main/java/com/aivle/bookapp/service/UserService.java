package com.aivle.bookapp.service;

import com.aivle.bookapp.config.SecurityConfig;
import com.aivle.bookapp.entity.Book;
import com.aivle.bookapp.entity.User;
import com.aivle.bookapp.repository.UserRepository;
import com.aivle.bookapp.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    //회원가입 로직
    @Transactional
    public User signup(String userID, String userpassword, String useremail, HttpSecurity http) {
        //아이디 중복 체크
        if(userRepository.existByUserId(userID)) {
            throw new RuntimeException("이미 사용중인 아이디입니다.");
        }

        //이메일 중복 체크
        if(userRepository.existByUserEmail(useremail)) {
            throw new RuntimeException("이미 가입된 이메일입니다." + useremail);
        }

        //비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(userpassword);

        User user = new User();
        user.setUserID(userID);
        user.setUserpassword(encodedPassword);
        user.setUseremail(useremail);

        return userRepository.save(user);
    }

    //로그인 로직
    @Transactional(readOnly = true)
    public User login(String userID, String userpassword) {
        User user = userRepository.findByUserID(userID).orElseThrow(() -> new RuntimeException("존재하지 않는 아이디 입니다."));

        if(!passwordEncoder.matches(userpassword, user.getUserpassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        System.out.println("로그인 성공");
        return user;
    }



}