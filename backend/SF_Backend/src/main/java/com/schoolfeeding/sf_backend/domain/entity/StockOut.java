package com.schoolfeeding.sf_backend.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.schoolfeeding.sf_backend.domain.base.AbstractBaseEntity;
import com.schoolfeeding.sf_backend.util.stock.EStock;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter

public class StockOut extends AbstractBaseEntity {

    @ManyToOne
    @JoinColumn(name = "school_id")
    private School school;

    @OneToMany(mappedBy = "stockOut", cascade = CascadeType.ALL)
    private List<StockOutItemDetail> stockOutItemDetails;
}
