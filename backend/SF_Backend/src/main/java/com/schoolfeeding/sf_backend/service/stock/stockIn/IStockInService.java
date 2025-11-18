package com.schoolfeeding.sf_backend.service.stock.stockIn;

import com.schoolfeeding.sf_backend.domain.entity.StockIn;

import java.util.List;
import java.util.UUID;

public interface IStockInService {
    StockIn saveStockIn(StockIn theStockIn);
    StockIn findByIdAndActive(UUID id);
    List<StockIn> findAllBySchoolIdAndActive(UUID schoolId);
}
