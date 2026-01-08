package com.schoolfeeding.sf_backend.domain.service;

import com.schoolfeeding.sf_backend.domain.entity.StockIn;
import com.schoolfeeding.sf_backend.domain.repository.StockInRepository;
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
class StockInServiceTest {

    @Mock
    private StockInRepository stockInRepository;

    @InjectMocks
    private StockInService stockInService;

    private StockIn stockIn;
    private UUID stockInId;

    @BeforeEach
    void setUp() {
        stockInId = UUID.randomUUID();
        stockIn = new StockIn();
        stockIn.setId(stockInId);
        stockIn.setQuantity(100.0);
        stockIn.setIsDeleted(false);
    }

    @Test
    void createStockIn_ShouldSaveStockIn() {
        when(stockInRepository.save(any(StockIn.class))).thenReturn(stockIn);

        StockIn saved = stockInService.createStockIn(new StockIn());

        assertNotNull(saved);
        assertEquals(100.0, saved.getQuantity());
        verify(stockInRepository).save(any(StockIn.class));
    }

    @Test
    void getAllStockIns_ShouldReturnList() {
        when(stockInRepository.findByIsDeletedFalse()).thenReturn(Collections.singletonList(stockIn));

        List<StockIn> list = stockInService.getAllStockIns();

        assertFalse(list.isEmpty());
        verify(stockInRepository).findByIsDeletedFalse();
    }

    @Test
    void getStockInById_ShouldReturnStockIn_WhenExists() {
        when(stockInRepository.findById(stockInId)).thenReturn(Optional.of(stockIn));

        StockIn found = stockInService.getStockInById(stockInId);

        assertNotNull(found);
        assertEquals(stockInId, found.getId());
    }

    @Test
    void updateStockIn_ShouldUpdateFields() {
        when(stockInRepository.findById(stockInId)).thenReturn(Optional.of(stockIn));
        when(stockInRepository.save(any(StockIn.class))).thenReturn(stockIn);

        StockIn updates = new StockIn();
        updates.setQuantity(200.0);

        StockIn updated = stockInService.updateStockIn(stockInId, updates);

        assertEquals(200.0, updated.getQuantity());
        verify(stockInRepository).save(any(StockIn.class));
    }

    @Test
    void deleteStockIn_ShouldMarkAsDeleted() {
        when(stockInRepository.findById(stockInId)).thenReturn(Optional.of(stockIn));
        when(stockInRepository.save(any(StockIn.class))).thenReturn(stockIn);

        stockInService.deleteStockIn(stockInId);

        assertTrue(stockIn.getIsDeleted());
        verify(stockInRepository).save(stockIn);
    }
}
