package com.aivle.bookapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    private String userID;
    private String userpassword;
}