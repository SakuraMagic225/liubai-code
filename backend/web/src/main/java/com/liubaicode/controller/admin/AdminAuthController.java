package com.liubaicode.controller.admin;

import com.liubaicode.auth.AdminAuthContext;
import com.liubaicode.auth.JwtTokenProvider;
import com.liubaicode.common.constant.AppConstants;
import com.liubaicode.common.result.Result;
import com.liubaicode.model.dto.auth.AdminLoginReq;
import com.liubaicode.model.vo.auth.AdminLoginVo;
import com.liubaicode.model.vo.auth.AdminProfileVo;
import com.liubaicode.service.IAdminAuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(AppConstants.API_PREFIX + "/admin/auth")
public class AdminAuthController {

    private final IAdminAuthService adminAuthService;
    private final JwtTokenProvider jwtTokenProvider;

    public AdminAuthController(IAdminAuthService adminAuthService, JwtTokenProvider jwtTokenProvider) {
        this.adminAuthService = adminAuthService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/login")
    public Result<AdminLoginVo> login(@Valid @RequestBody AdminLoginReq loginReq) {
        AdminProfileVo adminProfile = adminAuthService.login(loginReq);
        String token = jwtTokenProvider.createToken(adminProfile);

        AdminLoginVo loginVo = new AdminLoginVo();
        loginVo.setToken(token);
        loginVo.setExpiresAt(jwtTokenProvider.getExpiresAt(token));
        loginVo.setAdmin(adminProfile);
        return Result.success(loginVo);
    }

    @GetMapping("/me")
    public Result<AdminProfileVo> getCurrentAdmin() {
        return Result.success(adminAuthService.getActiveAdminProfile(AdminAuthContext.getCurrentAdminId()));
    }

    @PostMapping("/logout")
    public Result<Void> logout() {
        return Result.success();
    }
}
