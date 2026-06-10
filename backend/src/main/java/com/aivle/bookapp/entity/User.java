package com.aivle.bookapp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users") // user는 예약어일 수 있어서 users로 많이 씁니다.
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    @NotNull
    private String userID; // 아이디

    @Column
    @NotNull
    private String userpassword; // 비밀번호

    @Column
    @NotNull
    private String useremail;     // 실제 이름 (예: 최고관리자)
}