package com.schoolfeeding.sf_backend.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.schoolfeeding.sf_backend.domain.base.AbstractBaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class StockOutItemDetail  extends AbstractBaseEntity {

    @ManyToOne
    @JoinColumn(name = "stock_out_id")
    private StockOut stockOut;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;

    @Column(name = "quantity")
    private double quantity;
}
