package com.schoolfeeding.sf_backend.service.stock.stockOut;

import com.schoolfeeding.sf_backend.domain.entity.*;
import com.schoolfeeding.sf_backend.repository.stock.IStockOutRepository;
import com.schoolfeeding.sf_backend.service.stock.stock.IStockService;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.hibernate.ObjectNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StockOutServiceImpl implements IStockOutService {

    private final IStockOutRepository stockOutRepository;
    private final IStockService  stockService;
    private final EntityManager entityManager;

    @Override
    public StockOut saveStockOut(StockOut theStockOut) {
        var school = entityManager.find(School.class, theStockOut.getSchool().getId());
        theStockOut.setSchool(school);

        for (StockOutItemDetail detail : theStockOut.getStockOutItemDetails() ) {
            var item = entityManager.find(Item.class, detail.getItem().getId());
            detail.setItem(item);
            detail.setStockOut(theStockOut);
            Stock foundStock = stockService.findByItemIdAndSchoolId(item.getId(), school.getId());

            if (foundStock == null) {
                throw new ObjectNotFoundException(Stock.class, "STOCK NOT FOUND for item: " + item.getName());
            }

            if (detail.getQuantity() <= foundStock.getQuantity()) {
                foundStock.setQuantity(foundStock.getQuantity() - detail.getQuantity());
                stockService.updateStock(foundStock);
            } else {
                throw new IllegalArgumentException(
                        "Not enough stock for item: " + item.getName() + ". Available: " + foundStock.getQuantity()
                );
            }
        }

        return stockOutRepository.save(theStockOut);
    }


    @Override
    public StockOut updateStockOut(StockOut theStockOut) {
        StockOut existing = stockOutRepository.findByIdAndActive(theStockOut.getId(), true)
                .orElseThrow(() -> new ObjectNotFoundException(StockOut.class, "STOCKOUT NOT FOUND"));

        UUID schoolId = existing.getSchool().getId();

        for (StockOutItemDetail oldDetail : existing.getStockOutItemDetails()) {
            Stock stock = stockService.findByItemIdAndSchoolId(oldDetail.getItem().getId(), schoolId);
            if (stock != null) {
                stock.setQuantity(stock.getQuantity() + oldDetail.getQuantity());
                stockService.updateStock(stock);
            }
        }

        existing.getStockOutItemDetails().clear();

        for (StockOutItemDetail detail : theStockOut.getStockOutItemDetails()) {
            Item item = entityManager.find(Item.class, detail.getItem().getId());
            if (item == null) throw new ObjectNotFoundException(Item.class, "ITEM NOT FOUND");

            Stock stock = stockService.findByItemIdAndSchoolId(item.getId(), schoolId);
            if (stock == null) throw new ObjectNotFoundException(Stock.class, "STOCK NOT FOUND for item: " + item.getName());
            if (detail.getQuantity() > stock.getQuantity())
                throw new IllegalArgumentException("Not enough stock for item: " + item.getName() + ". Available: " + stock.getQuantity());

            stock.setQuantity(stock.getQuantity() - detail.getQuantity());
            stockService.updateStock(stock);

            detail.setItem(item);
            detail.setStockOut(existing);
            existing.getStockOutItemDetails().add(detail);
        }

        return stockOutRepository.save(existing);
    }


    @Override
    public StockOut deleteStockOut(StockOut theStockOut) {
        StockOut existingStockOut = findStockOutById(theStockOut.getId());

        if (existingStockOut == null) {
            throw new ObjectNotFoundException(StockOut.class, "STOCKOUT NOT FOUND");
        }

        var school = entityManager.find(School.class, existingStockOut.getSchool().getId());

        for (StockOutItemDetail detail : existingStockOut.getStockOutItemDetails()) {
            var item = detail.getItem();
            Stock stock = stockService.findByItemIdAndSchoolId(item.getId(), school.getId());
            if (stock != null) {
                stock.setQuantity(stock.getQuantity() + detail.getQuantity());
                stockService.updateStock(stock);
            }
        }

        existingStockOut.setActive(Boolean.FALSE);
        return stockOutRepository.save(existingStockOut);
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
