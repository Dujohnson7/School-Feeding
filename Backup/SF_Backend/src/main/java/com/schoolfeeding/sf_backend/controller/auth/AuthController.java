package com.schoolfeeding.sf_backend.controller.auth;

import com.schoolfeeding.sf_backend.config.JwtProvider;
import com.schoolfeeding.sf_backend.domain.dto.UserDto;
import com.schoolfeeding.sf_backend.domain.entity.Users;
import com.schoolfeeding.sf_backend.repository.admin.IUsersRepository;
import com.schoolfeeding.sf_backend.util.audit.Auditable;
import com.schoolfeeding.sf_backend.util.audit.EAction;
import com.schoolfeeding.sf_backend.util.audit.EResource;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final IUsersRepository usersRepository;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    private final java.util.Map<String, String> otpStorage = new java.util.concurrent.ConcurrentHashMap<>();

    @PostMapping("/login")
    @Auditable(action = EAction.LOGIN, resource = EResource.SYSTEM)
    public ResponseEntity<UserDto> login(@Valid @RequestBody UserDto loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(), loginRequest.getPassword()
                    )
            );

            Users user = usersRepository.findUsersByEmailAndActive(
                    loginRequest.getEmail(), Boolean.TRUE
            ).orElseThrow(() -> new RuntimeException("User not found"));


            String token = jwtProvider.generateToken(authentication);

            user.setLastLogin(LocalDateTime.now());
            usersRepository.save(user);

            UserDto response = new UserDto();
            response.setId(user.getId());
            response.setEmail(user.getEmail());
            response.setRole(user.getRole());
            response.setNames(user.getNames());
            response.setPhone(user.getPhone());
            response.setToken(token);
            response.setMessage("Login successful");
            response.setProfile(user.getProfile());

            return ResponseEntity.ok(response);

        } catch (Exception ex) {
            UserDto errorResponse = new UserDto();
            errorResponse.setEmail(loginRequest.getEmail());
            errorResponse.setMessage("Invalid credentials: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @PostMapping("/logout")
    @Auditable(action = EAction.LOGOUT, resource = EResource.SYSTEM)
    public ResponseEntity<UserDto> logout() {
        SecurityContextHolder.clearContext();
        UserDto response = new UserDto();
        response.setMessage("Logout successful");
        return ResponseEntity.ok(response);
    }


    @PostMapping("/forgot-password")
    public ResponseEntity<UserDto> forgotPassword(@RequestBody UserDto userDto) {
        Optional<Users> userOpt = usersRepository.findUsersByEmailAndActive(userDto.getEmail(), Boolean.TRUE);
        if (userOpt.isEmpty()) {
            UserDto response = new UserDto();
            response.setEmail(userDto.getEmail());
            response.setMessage("User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStorage.put(userDto.getEmail(), otp);

        System.out.println("OTP for " + userDto.getEmail() + " = " + otp);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(userDto.getEmail());
        message.setSubject("Your OTP for Password Reset");
        message.setText("Your OTP is: " + otp + "\nIt will expire in 10 minutes.");
        mailSender.send(message);

        UserDto response = new UserDto();
        response.setEmail(userDto.getEmail());
        response.setMessage("OTP sent to " + userDto.getEmail());
        return ResponseEntity.ok(response);
    }


    @PostMapping("/reset-password")
    public ResponseEntity<UserDto> resetPassword(@RequestBody UserDto userDto) {
        String email = userDto.getEmail();
        String otp = userDto.getOtp();
        String newPassword = userDto.getPassword();

        String storedOtp = otpStorage.get(email);
        if (storedOtp == null || !storedOtp.equals(otp)) {
            UserDto response = new UserDto();
            response.setEmail(email);
            response.setMessage("Invalid or expired OTP");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        Users user = usersRepository.findUsersByEmailAndActive(email, Boolean.TRUE)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        usersRepository.save(user);

        otpStorage.remove(email);

        UserDto response = new UserDto();
        response.setEmail(email);
        response.setMessage("Password reset successful");
        return ResponseEntity.ok(response);
    }
}
