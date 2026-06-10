package com.aivle.bookapp.service;

import com.aivle.bookapp.config.SecurityConfig;
import com.aivle.bookapp.entity.Book;
import com.aivle.bookapp.entity.User;
import com.aivle.bookapp.repository.UserRepository;
import com.aivle.bookapp.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final SecurityConfig securityConfig;

    // 전체 조회
    public List<Book> findAllBooks() {
        return bookRepository.findAll();
    }

    // 단건 조회
    public Book findBookById(Long id) {
        return bookRepository.findById(id)
                .orElse(null);
    }

    //=================================================================

    //회원가입 로직
    public User signup(String userID, String userpassword, String useremail, HttpSecurity http) {
        //아이디 중복 체크
        if(userRepository.existByUserId(userID)) {
            throw new RuntimeException("이미 사용중인 아이디입니다.");
        }

        //이메일 중복 체크
        if(userRepository.existByUserEmail(useremail)) {
            throw new RuntimeException("이미 가입된 이메일입니다." + useremail);
        }

        String encodedPassword = securityConfig.(userpassword);
    }



}