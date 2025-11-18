package com.schoolfeeding.sf_backend.domain.entity;

import com.schoolfeeding.sf_backend.domain.base.AbstractBaseEntity;
import com.schoolfeeding.sf_backend.util.accounting.EBank;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter

public class School extends AbstractBaseEntity {

    @Column(name = "School_Name",unique = true, nullable = false)
    private String Name;

    @Column(name = "Director_Name", nullable = false)
    private String DirectorNames;

    @Column(name = "Email", nullable = false)
    private String Email;

    @Column(name = "PhoneNumber", nullable = false)
    private String Phone;

    @Column(name = "Student", nullable = false)
    private int Student;

    @ManyToOne
    @JoinColumn(name = "district_id")
    private District district;

    @Column(name = "Address", nullable = false)
    private String Address;

    @Enumerated(EnumType.STRING)
    @Column(name = "bank")
    private EBank bank;

    @Column(name = "Bank_Account", nullable = false)
    private String BankAccount;

    @Column(name = "status")
    private Boolean status = Boolean.TRUE;
}
