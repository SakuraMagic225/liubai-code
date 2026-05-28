package com.liubaicode.config;

import com.liubaicode.auth.AdminAuthInterceptor;
import com.liubaicode.common.constant.AppConstants;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class AdminAuthWebConfig implements WebMvcConfigurer {

    private final AdminAuthInterceptor adminAuthInterceptor;

    public AdminAuthWebConfig(AdminAuthInterceptor adminAuthInterceptor) {
        this.adminAuthInterceptor = adminAuthInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(adminAuthInterceptor)
                .addPathPatterns(AppConstants.API_PREFIX + "/admin/**")
                .excludePathPatterns(AppConstants.API_PREFIX + "/admin/auth/login");
    }
}
