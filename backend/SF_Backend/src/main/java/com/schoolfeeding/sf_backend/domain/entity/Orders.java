package com.schoolfeeding.sf_backend.domain.entity;

import com.schoolfeeding.sf_backend.domain.base.AbstractBaseEntity;
import com.schoolfeeding.sf_backend.util.order.EDelivery;
import com.schoolfeeding.sf_backend.util.order.EOrderPay;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter

public class Orders extends AbstractBaseEntity {
    @ManyToOne
    @JoinColumn(name = "request_item_id")
    private RequestItem requestItem;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Users supplier;

    @Temporal(TemporalType.DATE)
    @Column(name = "deliveryDate")
    private Date deliveryDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "deliveryStatus", nullable = false)
    private EDelivery deliveryStatus;

    @Column(name = "order_price", nullable = false)
    private double orderPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "orderPayState", nullable = false)
    private EOrderPay orderPayState;

    @Column(name = "rating")
    private int rating;
}
