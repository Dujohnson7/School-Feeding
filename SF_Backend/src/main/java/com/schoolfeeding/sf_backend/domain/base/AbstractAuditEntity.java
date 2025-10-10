package com.schoolfeeding.sf_backend.domain.base;

import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Setter
@Getter
@MappedSuperclass

@EntityListeners(AuditingEntityListener.class)
public class AbstractAuditEntity {

    @CreatedBy
    private String createdBy;

    @CreatedDate
    private LocalDateTime created;

    @LastModifiedBy
    private String updatedBy;

    @LastModifiedDate
    private LocalDateTime updated;

    private String action;

    private String resource;

    private String actionStatus;

    private String details;
}
