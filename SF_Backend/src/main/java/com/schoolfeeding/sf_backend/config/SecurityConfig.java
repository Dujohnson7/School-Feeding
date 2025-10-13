package com.schoolfeeding.sf_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for REST API
            .authorizeHttpRequests(auth -> auth
                // Allow login and user registration without authentication
                .requestMatchers("/api/auth/login", "/api/users").permitAll()
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            .httpBasic(); // Optional: simple HTTP basic auth if needed

        return http.build();
    }
}
