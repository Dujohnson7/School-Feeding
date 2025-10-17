package com.schoolfeeding.sf_backend.domain.base;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import java.util.UUID;

@Getter
@Setter
@MappedSuperclass

public class AbstractBaseEntity extends AbstractAuditEntity{
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy ="org.hibernate.id.UUIDGenerator"
    )

    private UUID id;

    @Column( name = "active", nullable = false )
    private Boolean active =Boolean.TRUE;

}
