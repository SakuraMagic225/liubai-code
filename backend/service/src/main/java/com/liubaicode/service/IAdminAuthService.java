package com.liubaicode.service;

import com.liubaicode.model.dto.auth.AdminLoginReq;
import com.liubaicode.model.vo.auth.AdminProfileVo;

public interface IAdminAuthService {

    AdminProfileVo login(AdminLoginReq loginReq);

    AdminProfileVo getActiveAdminProfile(Long adminId);
}
