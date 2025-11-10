package com.schoolfeeding.sf_backend.service.district.supplier;

import com.schoolfeeding.sf_backend.domain.entity.Item;
import com.schoolfeeding.sf_backend.domain.entity.Supplier;

import java.util.List;
import java.util.UUID;

public interface ISupplierService {
    Supplier saveSupplier(Supplier theSupplier);
    Supplier updateSupplier(Supplier theSupplier);
    Supplier deleteSupplier(Supplier theSupplier);
    List<Item> findItemBySupplierId(UUID id, Boolean state);
    Supplier findByIdAndState(UUID id, Boolean state);
    List<Supplier> findAllByState(Boolean state);
    List<Supplier> findAllByDistrictAndAState(UUID districtId, Boolean state);
}
