package com.schoolfeeding.sf_backend.service.admin.user;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;
import java.util.UUID;

public class UserDetailsImpl  extends User {
    private final UUID userId;

    public UserDetailsImpl(String email, String password,
                           Collection<? extends GrantedAuthority> authorities,
                           UUID userId) {
        super(email, password, authorities);
        this.userId = userId;
    }

    public UUID getUserId() {
        return userId;
    }

}
