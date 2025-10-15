package com.schoolfeeding.sf_backend.domain.dto;

import java.util.UUID;

import com.schoolfeeding.sf_backend.util.role.ERole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserCreationDTO {

    @NotBlank
    private String names;

    @NotBlank
    private String phone;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password; 

    @NotNull
    private ERole role;

    private UUID districtId; 
    private UUID schoolId;
}