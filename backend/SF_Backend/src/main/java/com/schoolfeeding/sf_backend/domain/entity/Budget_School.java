package com.schoolfeeding.sf_backend.domain.entity;

import com.schoolfeeding.sf_backend.domain.base.AbstractBaseEntity;
import com.schoolfeeding.sf_backend.util.budget.EBudget;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter

public class Budget_School  extends AbstractBaseEntity {

    @ManyToOne
    @JoinColumn(name = "budget_id")
    private  Budget_District budgetDistrict;

    @Column(name = "budget")
    private double budget;

    @Column(name = "budget_status")
    private EBudget budgetStatus;
}
