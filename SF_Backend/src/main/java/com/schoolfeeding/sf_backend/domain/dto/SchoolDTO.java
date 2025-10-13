package com.schoolfeeding.sf_backend.domain.dto;

import com.schoolfeeding.sf_backend.util.accounting.EBank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class SchoolDTO {

    @NotBlank(message = "School Name is required")
    private String name;

    @NotBlank(message = "Director Name is required")
    private String directorNames;

    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Invalid phone number format")
    private String phone;

    @NotNull(message = "District ID is required")
    private Long districtId;

    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Bank is required")
    private EBank bank;

    @NotBlank(message = "Bank Account number is required")
    private String bankAccount;
}