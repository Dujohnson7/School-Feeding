package com.schoolfeeding.sf_backend.service.stock.stockOut;

import com.schoolfeeding.sf_backend.domain.entity.Stock;
import com.schoolfeeding.sf_backend.domain.entity.StockOut;

import java.util.List;
import java.util.UUID;

public interface IStockOutService {
    StockOut saveStockOut(StockOut theStockOut);
    StockOut updateStockOut(StockOut theStockOut);
    StockOut deleteStockOut(StockOut theStockOut);
    StockOut findStockOutById(UUID id);
    List<StockOut> findAllBySchool(UUID schoolId);
}
