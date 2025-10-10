package com.schoolfeeding.sf_backend.domain.entity;

import com.schoolfeeding.sf_backend.domain.base.AbstractBaseEntity;
import com.schoolfeeding.sf_backend.util.order.ERequest;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter

public class RequestItem extends AbstractBaseEntity {

    @ManyToOne
    @JoinColumn(name = "district_id")
    private District district;

    @ManyToOne
    @JoinColumn(name = "school_id")
    private School school;

    @ManyToMany
    @JoinTable(
            name = "request_items",
            joinColumns = @JoinColumn(name = "request_id"),
            inverseJoinColumns = @JoinColumn(name = "item_id")
    )
    private List<Item> items;

    @Column(name = "quantity", nullable = false)
    private double quantity;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "requestStatus", nullable = false)
    private ERequest requestStatus;
}
