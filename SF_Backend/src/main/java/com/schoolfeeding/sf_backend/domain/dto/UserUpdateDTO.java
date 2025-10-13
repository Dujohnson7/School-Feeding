package com.schoolfeeding.sf_backend.domain.dto;

import com.schoolfeeding.sf_backend.util.role.ERole;
import lombok.Data;

@Data
public class UserUpdateDTO {
    private String profile;
    private String names;
    private String phone;
    private ERole role;
    private Long districtId;
    private Long schoolId;
}