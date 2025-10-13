package com.schoolfeeding.sf_backend.domain.entity;

import com.schoolfeeding.sf_backend.domain.base.AbstractBaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "audit_logs")
public class AuditLog extends AbstractBaseEntity {

    // Renamed to avoid name collision. Lombok will generate: 
    // public String getActivityAction() and public void setActivityAction(String action)
    @Column(name = "action", nullable = false) 
    private String activityAction; // Maps to DB column 'action'

    @Column(name = "actor", nullable = false)
    private String actor; 

    @Column(name = "severity", nullable = false)
    private String severity; 

    @Column(name = "details")
    private String details;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    public AuditLog() {
    }

    // Constructor updated to use the new field name
    public AuditLog(String action, String actor, String severity, String details) {
        this.activityAction = action; // 'action' argument is saved to 'activityAction' field
        this.actor = actor;
        this.severity = severity;
        this.details = details;
    }
    
    // NOTE: The custom getAction() and setAction() methods are REMOVED to eliminate the 
    // conflict with the base class method, regardless of its return type.
}