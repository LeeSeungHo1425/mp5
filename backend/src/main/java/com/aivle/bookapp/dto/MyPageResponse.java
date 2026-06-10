package com.aivle.bookapp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class MyPageResponse {

    private UserInfoResponse userInfo;
    private List<?> userbasket;
    private List<?> JJimlist;
    private List<?> buylist;
}