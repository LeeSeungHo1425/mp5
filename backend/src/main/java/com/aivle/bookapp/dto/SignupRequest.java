package com.aivle.bookapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {
    private String userID;
    private String userpassword;
    private String useremail;
}