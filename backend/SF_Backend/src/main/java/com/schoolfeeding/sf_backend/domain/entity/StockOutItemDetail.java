package com.schoolfeeding.sf_backend.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.schoolfeeding.sf_backend.domain.base.AbstractBaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Getter
@Setter
public class StockOutItemDetail extends AbstractBaseEntity {

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "stock_out_id", nullable = false)
    private StockOut stockOut;

    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @Column(name = "quantity", nullable = false)
    private double quantity;

    @JsonProperty("stockOut")
    public MinimalId getMinimalStockOut() {
        return stockOut != null ? new MinimalId(stockOut.getId()) : null;
    }

    @JsonProperty("item")
    public MinimalId getMinimalItem() {
        return item != null ? new MinimalId(item.getId()) : null;
    }

    public record MinimalId(UUID id) {}
}
