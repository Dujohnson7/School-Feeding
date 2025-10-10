package com.schoolfeeding.sf_backend.domain.entity;

import com.schoolfeeding.sf_backend.domain.base.AbstractBaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter

public class Budget_Gov extends AbstractBaseEntity {

    @Column(name = "fiscalYear", nullable = false)
    private String FiscalYear;

    @Column(name = "budget", nullable = false)
    private double Budget;

    @Column(name = "description" )
    private String Description;

    @Column(name = "status" )
    private Boolean Status = Boolean.FALSE;

}
