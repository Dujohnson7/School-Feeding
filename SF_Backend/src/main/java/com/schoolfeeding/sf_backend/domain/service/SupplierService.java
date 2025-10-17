package com.schoolfeeding.sf_backend.domain.service;

import com.schoolfeeding.sf_backend.domain.entity.Supplier;
import com.schoolfeeding.sf_backend.domain.repository.SupplierRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;

    // ✅ Create
    public Supplier createSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    // ✅ Get all (only active)
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findByIsDeletedFalse();
    }

    // ✅ Get by ID
    public Supplier getSupplierById(UUID id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Supplier not found with id: " + id));
    }

    // ✅ Update
    public Supplier updateSupplier(UUID id, Supplier supplierDetails) {
        Supplier supplier = getSupplierById(id);

        supplier.setAddress(supplierDetails.getAddress());
        supplier.setTinNumber(supplierDetails.getTinNumber());
        supplier.setBank(supplierDetails.getBank());
        supplier.setBankAccount(supplierDetails.getBankAccount());
        supplier.setItems(supplierDetails.getItems());

        return supplierRepository.save(supplier);
    }

    // ✅ Soft Delete
    public void deleteSupplier(UUID id) {
        Supplier supplier = getSupplierById(id);
        supplier.setIsDeleted(true);
        supplier.setActive(false);
        supplierRepository.save(supplier);
    }
}
