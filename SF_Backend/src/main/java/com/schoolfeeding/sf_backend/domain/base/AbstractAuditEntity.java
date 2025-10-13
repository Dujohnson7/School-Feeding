// package com.schoolfeeding.sf_backend.domain.base;

// import com.schoolfeeding.sf_backend.util.audit.EAction;
// import com.schoolfeeding.sf_backend.util.audit.EActionStatus;
// import com.schoolfeeding.sf_backend.util.audit.EResource;
// import jakarta.persistence.EntityListeners;
// import jakarta.persistence.EnumType;
// import jakarta.persistence.Enumerated;
// import jakarta.persistence.MappedSuperclass;
// import lombok.Getter;
// import lombok.Setter;
// import org.springframework.data.annotation.CreatedBy;
// import org.springframework.data.annotation.CreatedDate;
// import org.springframework.data.annotation.LastModifiedBy;
// import org.springframework.data.annotation.LastModifiedDate;
// import org.springframework.data.jpa.domain.support.AuditingEntityListener;

// import java.time.LocalDateTime;

// @Setter
// @Getter
// @MappedSuperclass

// @EntityListeners(AuditingEntityListener.class)
// public class AbstractAuditEntity {

//     @CreatedBy
//     private String createdBy;

//     @CreatedDate
//     private LocalDateTime created;

//     @LastModifiedBy
//     private String updatedBy;

//     @LastModifiedDate
//     private LocalDateTime updated;

//     @Enumerated(EnumType.STRING)
//     private EAction action;

//     @Enumerated(EnumType.STRING)
//     private EResource resource;

//     @Enumerated(EnumType.STRING)
//     private EActionStatus actionStatus;

//     private String details;
// }
