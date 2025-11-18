package com.schoolfeeding.sf_backend.domain.entity;

import com.schoolfeeding.sf_backend.util.audit.EAction;
import com.schoolfeeding.sf_backend.util.audit.EActionStatus;
import com.schoolfeeding.sf_backend.util.audit.EResource;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter

public class Audit {

    @Id
    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "userId")
    private Users user;

    @Enumerated(EnumType.STRING)
    private EAction action;

    @Enumerated(EnumType.STRING)
    private EResource resource;

    @Enumerated(EnumType.STRING)
    private EActionStatus actionStatus;

    private String details;
}
