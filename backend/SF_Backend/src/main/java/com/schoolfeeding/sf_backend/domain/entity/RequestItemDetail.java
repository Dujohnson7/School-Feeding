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
public class RequestItemDetail extends AbstractBaseEntity {

/*
    @ManyToOne
    @JoinColumn(name = "request_id", nullable = false)
    private RequestItem requestItem;

    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @Column(name = "quantity", nullable = false)
    private double quantity;

*/

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "request_id", nullable = false)
    private RequestItem requestItem;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @Column(name = "quantity", nullable = false)
    private double quantity;


    @JsonProperty("requestItem")
    public MinimalId getMinimalRequestItem() {
        return requestItem != null ? new MinimalId(requestItem.getId()) : null;
    }

    @JsonProperty("item")
    public MinimalId getMinimalItem() {
        return item != null ? new MinimalId(item.getId()) : null;
    }

    public record MinimalId(UUID id) {}

}
