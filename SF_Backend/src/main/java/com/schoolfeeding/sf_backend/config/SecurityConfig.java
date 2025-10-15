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
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.disable())
            .formLogin(form -> form.disable())
            .logout(logout -> logout.disable())
            .httpBasic(httpBasic -> httpBasic.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/users/**").permitAll()
                .requestMatchers("/api/districts/**").permitAll()
                .requestMatchers("/api/schools/**").permitAll()
                .requestMatchers("/api/budgets/**").permitAll()
                .requestMatchers("/api/admin/dashboard").permitAll()
                .requestMatchers("/api/gov/dashboard").permitAll()
                .anyRequest().authenticated()
            );

        return http.build(); // semicolon is required
    }
}
