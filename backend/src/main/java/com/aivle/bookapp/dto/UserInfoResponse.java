package com.aivle.bookapp.dto;

import com.aivle.bookapp.entity.User;
import lombok.Getter;

@Getter
public class UserInfoResponse {

    private String userID;

    public UserInfoResponse(User user) {
        this.userID = user.getUserID();

    }
}