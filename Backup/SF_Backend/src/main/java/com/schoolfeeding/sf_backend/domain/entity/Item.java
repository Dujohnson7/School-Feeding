package com.schoolfeeding.sf_backend.domain.entity;

import com.schoolfeeding.sf_backend.domain.base.AbstractBaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter

public class Item extends AbstractBaseEntity {
    @Column(name = "item_name", unique = true, nullable = false)
    private String name;

    @Column(name = "gram_Per_Student", nullable = false)
    private Double perStudent;

    @Column(name = "description")
    private String description;

}
