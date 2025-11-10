package com.schoolfeeding.sf_backend.service.stock.stockIn;

import com.schoolfeeding.sf_backend.domain.entity.Stock;
import com.schoolfeeding.sf_backend.domain.entity.StockIn;
import com.schoolfeeding.sf_backend.repository.stock.IStockInRepository;
import com.schoolfeeding.sf_backend.service.stock.stock.IStockService;
import com.schoolfeeding.sf_backend.util.stock.EStock;
import lombok.RequiredArgsConstructor;
import org.hibernate.ObjectNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StockInServiceImpl implements IStockInService {

    private final IStockInRepository stockInRepository;
    private final IStockService stockService;

    @Override
    public StockIn saveStockIn(StockIn theStockIn) {

        Stock stock = new Stock();
        stock.setSchool(theStockIn.getSchool());
        stock.setItem(theStockIn.getItem());
        stock.setQuantity(theStockIn.getQuantity());
        stock.setStockState(EStock.NORMAL);
        stockService.saveStock(stock);
        return stockInRepository.save(theStockIn);
    }

    @Override
    public StockIn findByIdAndActive(UUID id) {
        StockIn theStockIn = stockInRepository.findByIdAndActive(id, Boolean.TRUE)
                .orElseThrow(()-> new ObjectNotFoundException(StockIn.class,"STOCK IN NOT FOUND"));
        return theStockIn;
    }

    @Override
    public List<StockIn> findAllBySchoolIdAndActive(UUID schoolId) {
        return stockInRepository.findAllBySchoolIdAndActive(schoolId, Boolean.TRUE);
    }
}
