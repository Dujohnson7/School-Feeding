package com.schoolfeeding.sf_backend.domain.dto;

import com.schoolfeeding.sf_backend.domain.entity.District;
import com.schoolfeeding.sf_backend.util.accounting.EBank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SchoolDto extends AbstractCommonEntityDto {

    @NotBlank(message = "School Name is required")
    private String name;

    @NotBlank(message = "School Director is required")
    private String directorNames;

    @Email(message = "Invalid Email")
    private String email;

    @NotBlank(message = "Phone Number is required")
    @Size(min = 10, max = 10, message = "Phone number must be exactly 10 digits")
    private String phone;

    @NotNull(message = "Total Student is required")
    private Integer student;

    private District district;
    private String address;
    private EBank bank;
    private String bankAccount;
    private Boolean status = Boolean.TRUE;
}
