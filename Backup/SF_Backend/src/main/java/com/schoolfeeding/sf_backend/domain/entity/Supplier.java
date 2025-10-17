package com.schoolfeeding.sf_backend.domain.entity;

import com.schoolfeeding.sf_backend.util.accounting.EBank;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class Supplier extends Users {

    @Column(name = "tin_number", nullable = false)
    private int tinNumber;

    @Column(name = "address", nullable = false)
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(name = "bank")
    private EBank bank;

    @Column(name = "bank_account", nullable = false)
    private String bankAccount;

    @ManyToMany
    @JoinTable(
            name = "supplier_items",
            joinColumns = @JoinColumn(name = "supplier_id"),
            inverseJoinColumns = @JoinColumn(name = "item_id")
    )
    private List<Item> items;
}