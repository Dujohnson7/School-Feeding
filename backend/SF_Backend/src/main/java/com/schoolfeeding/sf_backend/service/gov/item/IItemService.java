package com.schoolfeeding.sf_backend.service.gov.item;

import com.schoolfeeding.sf_backend.domain.entity.Item;

import java.util.List;
import java.util.UUID;

public interface IItemService {
    Item saveItem(Item theItem);
    Item updateItem(Item theItem);
    Item deleteItem(Item theItem);
    Item findByIdAndState(UUID id, Boolean state);
    List<Item> findAllByActive(Boolean active);
}
