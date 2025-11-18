package com.schoolfeeding.sf_backend.domain.entity;

import com.schoolfeeding.sf_backend.domain.base.AbstractBaseEntity;
import com.schoolfeeding.sf_backend.util.budget.EBudget;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter

public class Budget_District extends AbstractBaseEntity {

    @ManyToOne
    @JoinColumn(name = "budget_id")
    private  Budget_Gov budgetGov;

    @ManyToOne
    @JoinColumn(name = "district_id")
    private  District district;

    @Column(name = "budget")
    private double budget;

    @Column(name = "budget_status")
    private EBudget budgetStatus;
}
