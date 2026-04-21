package com.preloved.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadDir = Paths.get("./uploads").toAbsolutePath().toString();
        System.out.println("📁 Serving uploads from: " + uploadDir);
        System.out.println("📁 Directory exists: " + new java.io.File(uploadDir).exists());
        System.out.println("📁 Is directory: " + new java.io.File(uploadDir).isDirectory());
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadDir + "/");
    }
}
