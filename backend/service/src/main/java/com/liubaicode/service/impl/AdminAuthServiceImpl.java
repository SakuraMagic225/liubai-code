package com.liubaicode.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.liubaicode.common.exception.BizException;
import com.liubaicode.common.exception.ErrorCode;
import com.liubaicode.model.dto.auth.AdminLoginReq;
import com.liubaicode.model.entity.AdminUser;
import com.liubaicode.model.vo.auth.AdminProfileVo;
import com.liubaicode.repository.mapper.AdminUserMapper;
import com.liubaicode.service.IAdminAuthService;
import java.time.LocalDateTime;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminAuthServiceImpl implements IAdminAuthService {

    private static final int STATUS_ENABLED = 1;

    private final AdminUserMapper adminUserMapper;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AdminAuthServiceImpl(AdminUserMapper adminUserMapper) {
        this.adminUserMapper = adminUserMapper;
    }

    @Override
    @Transactional
    public AdminProfileVo login(AdminLoginReq loginReq) {
        AdminUser adminUser = adminUserMapper.selectOne(new LambdaQueryWrapper<AdminUser>()
                .eq(AdminUser::getUsername, loginReq.getUsername())
                .last("LIMIT 1"));
        if (adminUser == null || !passwordEncoder.matches(loginReq.getPassword(), adminUser.getPasswordHash())) {
            throw new BizException(ErrorCode.UNAUTHORIZED, "用户名或密码错误");
        }
        if (adminUser.getStatus() == null || adminUser.getStatus() != STATUS_ENABLED) {
            throw new BizException(ErrorCode.FORBIDDEN, "管理员账号已禁用");
        }

        AdminUser updateUser = new AdminUser();
        updateUser.setId(adminUser.getId());
        updateUser.setLastLoginAt(LocalDateTime.now());
        adminUserMapper.updateById(updateUser);

        return toProfile(adminUser);
    }

    @Override
    public AdminProfileVo getActiveAdminProfile(Long adminId) {
        AdminUser adminUser = adminUserMapper.selectById(adminId);
        if (adminUser == null || adminUser.getStatus() == null || adminUser.getStatus() != STATUS_ENABLED) {
            throw new BizException(ErrorCode.UNAUTHORIZED, "登录状态已失效");
        }
        return toProfile(adminUser);
    }

    private AdminProfileVo toProfile(AdminUser adminUser) {
        AdminProfileVo profileVo = new AdminProfileVo();
        profileVo.setId(adminUser.getId());
        profileVo.setUsername(adminUser.getUsername());
        profileVo.setNickname(adminUser.getNickname());
        return profileVo;
    }
}
