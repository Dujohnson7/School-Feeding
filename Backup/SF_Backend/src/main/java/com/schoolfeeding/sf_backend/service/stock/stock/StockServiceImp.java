package com.schoolfeeding.sf_backend.service.stock.stock;

import com.schoolfeeding.sf_backend.domain.entity.Item;
import com.schoolfeeding.sf_backend.domain.entity.Stock;
import com.schoolfeeding.sf_backend.repository.stock.IStockRepository;
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
        Stock foundStock = findByItemIdAndSchoolId(theStock.getItem().getId(), theStock.getSchool().getId() );
        if (Objects.nonNull(foundStock)) {
            foundStock.setItem(theStock.getItem());
            foundStock.setQuantity(foundStock.getQuantity() + theStock.getQuantity());
            return stockRepository.save(foundStock);
        } else {
            return stockRepository.save(theStock);
        }
    }

    @Override
    public Stock updateStock(Stock theStock) {
        Stock foundStock = findByIdAndActive(theStock.getId());
        if (Objects.nonNull(foundStock)) {
            foundStock.setItem(theStock.getItem());
            foundStock.setQuantity(foundStock.getQuantity() - theStock.getQuantity());
            return stockRepository.save(foundStock);
        }
        throw new ObjectNotFoundException(Item.class,"ITEM NOT FOUND");
    }

    @Override
    public Stock findByIdAndActive(UUID id) {
        Stock theStock = stockRepository.findByIdAndActive(id, Boolean.TRUE)
                .orElseThrow(()-> new ObjectNotFoundException(Stock.class,"STOCK IN NOT FOUND"));
        return theStock;
    }

    @Override
    public Stock findByItemIdAndSchoolId(UUID itemId, UUID schoolId) {
        Stock theStock = stockRepository.findByItemIdAndSchoolIdAndActive(itemId,schoolId, Boolean.TRUE)
                .orElseThrow(()-> new ObjectNotFoundException(Stock.class,"NOT FOUND"));
        return theStock;
    }

    @Override
    public List<Stock> findAllBySchool(UUID schoolId) {
        return stockRepository.findAllBySchoolIdAndActive(schoolId, Boolean.TRUE);
    }
}
