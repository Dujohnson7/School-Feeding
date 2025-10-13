package com.schoolfeeding.sf_backend.domain.entity;

import com.schoolfeeding.sf_backend.domain.base.AbstractBaseEntity;
import com.schoolfeeding.sf_backend.util.role.ERole;
import com.schoolfeeding.sf_backend.util.status.EStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@Inheritance(strategy = InheritanceType.JOINED)
public class Users extends AbstractBaseEntity {

    // UUID as a generated unique field, not primary key
    @Column(name = "uuid", unique = true, nullable = false, updatable = false)
    private UUID uuid;

    @Column(name = "profile")
    private String profile;

    @Column(name = "User_Names", nullable = false)
    private String names;

    @Column(name = "phone_number", nullable = false)
    private String phone;

    @Column(name = "Email", nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private ERole role;

    // ✅ Added status field (the missing part)
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private EStatus status = EStatus.ACTIVE;

    @ManyToOne
    @JoinColumn(name = "district_id")
    private District district;

    @ManyToOne
    @JoinColumn(name = "school_id") // Fixed JoinColumn
    private School school;

    @Column(name = "lastLogin", nullable = true)
    private LocalDateTime lastLogin;

    // Generate UUID automatically before persisting
    @PrePersist
    public void prePersist() {
        if (uuid == null) {
            uuid = UUID.randomUUID();
        }
    }
}
