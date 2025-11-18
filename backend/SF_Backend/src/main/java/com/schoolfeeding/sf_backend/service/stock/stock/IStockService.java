package com.schoolfeeding.sf_backend.service.stock.stock;

import com.schoolfeeding.sf_backend.domain.entity.Stock;

import java.util.List;
import java.util.UUID;

public interface IStockService {
    Stock saveStock(Stock theStock);
    Stock updateStock(Stock theStock);
    Stock findByIdAndActive(UUID id);
    Stock findByItemIdAndSchoolId(UUID itemId, UUID schoolId);
    List<Stock> findAllBySchool(UUID schoolId);
}
