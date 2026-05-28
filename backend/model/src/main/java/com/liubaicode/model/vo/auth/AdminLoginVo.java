package com.liubaicode.model.vo.auth;

import lombok.Data;

@Data
public class AdminLoginVo {

    private String token;

    private Long expiresAt;

    private AdminProfileVo admin;
}
