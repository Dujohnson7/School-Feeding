package com.schoolfeeding.sf_backend.domain.service;

import com.schoolfeeding.sf_backend.domain.entity.Supplier;
import com.schoolfeeding.sf_backend.domain.repository.SupplierRepository;
import com.schoolfeeding.sf_backend.util.accounting.EBank;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SupplierServiceTest {

    @Mock
    private SupplierRepository supplierRepository;

    @InjectMocks
    private SupplierService supplierService;

    private Supplier supplier;
    private UUID supplierId;

    @BeforeEach
    void setUp() {
        supplierId = UUID.randomUUID();
        supplier = new Supplier();
        supplier.setId(supplierId);
        supplier.setAddress("123 Supplier St");
        supplier.setTinNumber(123456);
        supplier.setBankAccount("0011223344");
        supplier.setIsDeleted(false);
    }

    @Test
    void createSupplier_ShouldSaveSupplier() {
        when(supplierRepository.save(any(Supplier.class))).thenReturn(supplier);

        Supplier saved = supplierService.createSupplier(new Supplier());

        assertNotNull(saved);
        assertEquals("123 Supplier St", saved.getAddress());
        verify(supplierRepository).save(any(Supplier.class));
    }

    @Test
    void getAllSuppliers_ShouldReturnList() {
        when(supplierRepository.findByIsDeletedFalse()).thenReturn(Collections.singletonList(supplier));

        List<Supplier> list = supplierService.getAllSuppliers();

        assertFalse(list.isEmpty());
        verify(supplierRepository).findByIsDeletedFalse();
    }

    @Test
    void getSupplierById_ShouldReturnSupplier_WhenExists() {
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(supplier));

        Supplier found = supplierService.getSupplierById(supplierId);

        assertNotNull(found);
        assertEquals(supplierId, found.getId());
    }

    @Test
    void updateSupplier_ShouldUpdateFields() {
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(supplier));
        when(supplierRepository.save(any(Supplier.class))).thenReturn(supplier);

        Supplier updates = new Supplier();
        updates.setAddress("456 New Road");
        updates.setTinNumber(999888);

        Supplier updated = supplierService.updateSupplier(supplierId, updates);

        assertEquals("456 New Road", updated.getAddress());
        assertEquals(999888, updated.getTinNumber());
        verify(supplierRepository).save(any(Supplier.class));
    }

    @Test
    void deleteSupplier_ShouldMarkAsDeleted() {
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(supplier));
        when(supplierRepository.save(any(Supplier.class))).thenReturn(supplier);

        supplierService.deleteSupplier(supplierId);

        assertTrue(supplier.getIsDeleted());
        assertFalse(supplier.getActive());
        verify(supplierRepository).save(supplier);
    }
}
