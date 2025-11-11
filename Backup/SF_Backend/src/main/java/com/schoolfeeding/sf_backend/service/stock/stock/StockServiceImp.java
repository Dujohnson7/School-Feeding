package com.schoolfeeding.sf_backend.service.stock.stock;

import com.schoolfeeding.sf_backend.domain.entity.Item;
import com.schoolfeeding.sf_backend.domain.entity.School;
import com.schoolfeeding.sf_backend.domain.entity.Stock;
import com.schoolfeeding.sf_backend.repository.stock.IStockRepository;
import com.schoolfeeding.sf_backend.util.stock.EStock;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.hibernate.ObjectNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StockServiceImp implements IStockService{

    private final IStockRepository  stockRepository;

    @Override
    public Stock saveStock(Stock theStock) {
        Stock foundStock = stockRepository.findByItemIdAndSchoolIdAndActive(theStock.getItem().getId(), theStock.getSchool().getId(), Boolean.TRUE).orElse(null);

        if (foundStock != null) {
            foundStock.setQuantity(foundStock.getQuantity() + theStock.getQuantity());
            foundStock.setStockState(EStock.NORMAL);
            return stockRepository.save(foundStock);
        } else {
            theStock.setStockState(EStock.NORMAL);
            return stockRepository.save(theStock);
        }
    }
    @Override
    public Stock updateStock(Stock theStock) {
        Stock foundStock = stockRepository.findByItemIdAndSchoolIdAndActive(theStock.getItem().getId(), theStock.getSchool().getId(), Boolean.TRUE).orElse(null);
        if (Objects.nonNull(foundStock)) {
            foundStock.setQuantity(theStock.getQuantity());
            return stockRepository.save(foundStock);
        }
        throw new ObjectNotFoundException(Item.class, "ITEM NOT FOUND");
    }


    @Override
    public Stock findByIdAndActive(UUID id) {
        return stockRepository.findByIdAndActive(id, Boolean.TRUE)
                .orElseThrow(()-> new ObjectNotFoundException(Stock.class,"STOCK IN NOT FOUND"));
    }

    @Override
    public Stock findByItemIdAndSchoolId(UUID itemId, UUID schoolId) {
        return stockRepository.findByItemIdAndSchoolIdAndActive(itemId,schoolId, Boolean.TRUE)
                .orElseThrow(()-> new ObjectNotFoundException(Stock.class,"NOT FOUND"));
    }

    @Override
    public List<Stock> findAllBySchool(UUID schoolId) {
        return stockRepository.findAllBySchoolIdAndActive(schoolId, Boolean.TRUE);
    }
}
