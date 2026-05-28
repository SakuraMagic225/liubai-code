package com.liubaicode.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.liubaicode.common.exception.BizException;
import com.liubaicode.common.exception.ErrorCode;
import com.liubaicode.common.result.Result;
import com.liubaicode.service.IAdminAuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.nio.charset.StandardCharsets;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AdminAuthInterceptor implements HandlerInterceptor {

    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtTokenProvider jwtTokenProvider;
    private final IAdminAuthService adminAuthService;
    private final ObjectMapper objectMapper;

    public AdminAuthInterceptor(
            JwtTokenProvider jwtTokenProvider,
            IAdminAuthService adminAuthService,
            ObjectMapper objectMapper
    ) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.adminAuthService = adminAuthService;
        this.objectMapper = objectMapper;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        try {
            String authorization = request.getHeader("Authorization");
            if (authorization == null || !authorization.startsWith(BEARER_PREFIX)) {
                throw new BizException(ErrorCode.UNAUTHORIZED, "请先登录");
            }
            String token = authorization.substring(BEARER_PREFIX.length()).trim();
            Long adminId = jwtTokenProvider.parseAdminId(token);
            adminAuthService.getActiveAdminProfile(adminId);
            AdminAuthContext.setCurrentAdminId(adminId);
            return true;
        } catch (BizException exception) {
            writeUnauthorized(response, exception.getMessage());
            return false;
        }
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        AdminAuthContext.clear();
    }

    private void writeUnauthorized(HttpServletResponse response, String message) throws Exception {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(Result.failure(ErrorCode.UNAUTHORIZED, message)));
    }
}
