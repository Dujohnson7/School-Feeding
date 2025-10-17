package com.schoolfeeding.sf_backend.service.admin.user;

import org.springframework.security.core.userdetails.User;

import java.util.UUID;

public class UserDetailsImpl  extends User {
    private final UUID userId;
    private final UUID districtId;
    private final UUID schoolId;

}
