package com.schoolfeeding.sf_backend.controller;

import com.schoolfeeding.sf_backend.domain.entity.Users;
import com.schoolfeeding.sf_backend.domain.service.UsersService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsersService usersService;

    public AuthController(UsersService usersService) {
        this.usersService = usersService;
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        // Manually authenticate using your service
        Users user = usersService.authenticateUser(email, password);

        // Return only user info, no tokens needed
        Map<String, Object> response = new HashMap<>();
        response.put("role", user.getRole().name());
        response.put("email", user.getEmail());
        response.put("names", user.getNames());

        return ResponseEntity.ok(response);
    }
}
