package com.schoolfeeding.sf_backend.controller.auth;

import com.schoolfeeding.sf_backend.domain.entity.Users;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        if (email != null && password != null) {
            return ResponseEntity.badRequest().body("Email or password is incorrect");
        }

        try {

           // Authentication authentication =


        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error : " + ex.getMessage());
        }

    }
}
