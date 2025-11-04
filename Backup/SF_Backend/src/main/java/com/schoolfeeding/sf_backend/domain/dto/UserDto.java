package com.schoolfeeding.sf_backend.domain.dto;

import com.schoolfeeding.sf_backend.domain.entity.District;
import com.schoolfeeding.sf_backend.domain.entity.School;
import com.schoolfeeding.sf_backend.util.role.ERole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto extends AbstractCommonEntityDto {
    private String profile;
    private String names;
    @Email(message = "Invalid Email Format")
    private String email;
    @NotBlank(message = "Password is required")
    private String password;
    private String phone;
    private ERole role;
    private District district;
    private School school;
    private LocalDateTime lastLogin;
    private String otp;

}
