package com.schoolfeeding.sf_backend.service.stock.stockOut;

import com.schoolfeeding.sf_backend.domain.entity.Stock;
import com.schoolfeeding.sf_backend.domain.entity.StockOut;
import com.schoolfeeding.sf_backend.repository.stock.IStockOutRepository;
import com.schoolfeeding.sf_backend.service.stock.stock.IStockService;
import lombok.RequiredArgsConstructor;
import org.hibernate.ObjectNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StockOutServiceImpl implements IStockOutService {

    private final IStockOutRepository stockOutRepository;
    private final IStockService  stockService;

    @Override
    public StockOut saveStockOut(StockOut theStockOut) {
        Stock foundStock = stockService.findByItemIdAndSchoolId(theStockOut.getItem().getId(), theStockOut.getSchool().getId());

        if (Objects.nonNull(foundStock)) {

            if (theStockOut.getQuantity() > foundStock.getQuantity()) {
                foundStock.setQuantity(theStockOut.getQuantity());
                stockService.updateStock(foundStock);
                return stockOutRepository.save(theStockOut);
            }else{
                throw new ObjectNotFoundException(Stock.class,"Quantity ARE NOT IN STOCK");
            }
        }
        throw new ObjectNotFoundException(Stock.class,"STOCK IN NOT FOUND");
    }

    @Override
    public StockOut updateStockOut(StockOut theStockOut) {
        StockOut foundStock = findStockOutById(theStockOut.getId());
        if (Objects.nonNull(foundStock)) {
            if (theStockOut.getQuantity() > foundStock.getQuantity()) {
                double tempQuantity = foundStock.getQuantity() - theStockOut.getQuantity();
                Stock theStock = new Stock();
                theStock.setQuantity(tempQuantity);
                stockService.updateStock(theStock);
                foundStock.setQuantity(theStockOut.getQuantity());
                return stockOutRepository.save(foundStock);
            }else {
                throw new ObjectNotFoundException(Stock.class,"Quantity ARE NOT IN STOCK");
            }
        }
        throw new ObjectNotFoundException(Stock.class,"STOCKOUT NOT FOUND");
    }

    @Override
    public StockOut deleteStockOut(StockOut theStockOut) {
        StockOut foundStock = findStockOutById(theStockOut.getId());
        if (Objects.nonNull(foundStock)) {
            if (theStockOut.getQuantity() > foundStock.getQuantity()) {
                double tempQuantity = foundStock.getQuantity() - theStockOut.getQuantity();
                Stock theStock = new Stock();
                theStock.setQuantity(tempQuantity);
                stockService.updateStock(theStock);
                foundStock.setActive(Boolean.FALSE);
                return stockOutRepository.save(foundStock);
            }else {
                throw new ObjectNotFoundException(Stock.class,"Quantity ARE NOT IN STOCK");
            }
        }
        throw new ObjectNotFoundException(Stock.class,"STOCKOUT NOT FOUND");
    }

    @Override
    public StockOut findStockOutById(UUID id) {
        return stockOutRepository.findByIdAndActive(id, Boolean.TRUE)
                .orElseThrow(()-> new ObjectNotFoundException(StockOut.class,"STOCKOUT NOT FOUND"));
    }

    @Override
    public List<StockOut> findAllBySchool(UUID schoolId) {
        return stockOutRepository.findAllBySchoolIdAndActive(schoolId, Boolean.TRUE);
    }
}
