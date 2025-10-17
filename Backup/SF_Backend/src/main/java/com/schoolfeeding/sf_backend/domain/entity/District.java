package com.schoolfeeding.sf_backend.domain.entity;

import com.schoolfeeding.sf_backend.domain.base.AbstractBaseEntity;
import com.schoolfeeding.sf_backend.util.address.EDistrict;
import com.schoolfeeding.sf_backend.util.address.EProvince;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter

public class District extends AbstractBaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "Province", nullable = false)
    private EProvince province;

    @Enumerated(EnumType.STRING)
    @Column(name = "District", nullable = false, unique = true)
    private EDistrict district;
}
