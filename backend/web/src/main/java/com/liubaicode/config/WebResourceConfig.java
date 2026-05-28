package com.liubaicode.config;

import jakarta.servlet.MultipartConfigElement;
import java.nio.file.Path;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.unit.DataSize;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebResourceConfig implements WebMvcConfigurer {

    private static final DataSize MAX_AVATAR_UPLOAD_SIZE = DataSize.ofMegabytes(5);

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadPath = Path.of(System.getProperty("user.dir"), "uploads").toAbsolutePath().normalize();
        String uploadLocation = uploadPath.toUri().toString();
        if (!uploadLocation.endsWith("/")) {
            uploadLocation += "/";
        }
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadLocation);
    }

    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        factory.setMaxFileSize(MAX_AVATAR_UPLOAD_SIZE);
        factory.setMaxRequestSize(MAX_AVATAR_UPLOAD_SIZE);
        return factory.createMultipartConfig();
    }
}
