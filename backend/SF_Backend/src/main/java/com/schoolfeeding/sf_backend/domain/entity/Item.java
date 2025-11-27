package com.schoolfeeding.sf_backend.domain.entity;

import com.schoolfeeding.sf_backend.domain.base.AbstractBaseEntity;
import com.schoolfeeding.sf_backend.util.item.FoodCategory;
import com.schoolfeeding.sf_backend.util.item.FoodUnit;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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

    @Enumerated(EnumType.STRING)
    @Column(name = "foodCategory")
    private FoodCategory foodCategory;

    @Column(name = "price")
    private Double price;

    @Enumerated(EnumType.STRING)
    @Column(name = "unit")
    private FoodUnit unit;

    @Column(name = "description")
    private String description;

}
