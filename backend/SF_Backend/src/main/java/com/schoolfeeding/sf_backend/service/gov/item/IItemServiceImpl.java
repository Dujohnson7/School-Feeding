package com.schoolfeeding.sf_backend.service.gov.item;

import com.schoolfeeding.sf_backend.domain.entity.Item;
import com.schoolfeeding.sf_backend.repository.gov.IItemRepository;
import com.schoolfeeding.sf_backend.util.audit.Auditable;
import com.schoolfeeding.sf_backend.util.audit.EAction;
import com.schoolfeeding.sf_backend.util.audit.EResource;
import lombok.RequiredArgsConstructor;
import org.hibernate.ObjectNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class IItemServiceImpl implements IItemService{

    private final IItemRepository itemRepository;

    @Override
    @Auditable(action = EAction.CREATE, resource = EResource.GOV)
    public Item saveItem(Item theItem) {
        return itemRepository.save(theItem);
    }

    @Override
    @Auditable(action = EAction.UPDATE, resource = EResource.GOV)
    public Item updateItem(Item theItem) {
        Item found = findByIdAndState(theItem.getId(), Boolean.TRUE);
        if (Objects.nonNull(found)) {
            found.setName(theItem.getName());
            found.setDescription(theItem.getDescription());
            found.setPerStudent(theItem.getPerStudent());
            found.setPrice(theItem.getPrice());
            found.setUnit(theItem.getUnit());
            found.setFoodCategory(theItem.getFoodCategory());
            return  itemRepository.save(found);
        }
        throw new ObjectNotFoundException(Item.class,"ITEM NOT FOUND");
    }

    @Override
    @Auditable(action = EAction.DELETE, resource = EResource.GOV)
    public Item deleteItem(Item theItem) {
        Item found = findByIdAndState(theItem.getId(), Boolean.TRUE);
        if (Objects.nonNull(found)) {
            found.setActive(Boolean.FALSE);
            return  itemRepository.save(found);
        }
        throw new ObjectNotFoundException(Item.class,"ITEM NOT FOUND");
    }

    @Override
    public Item findByIdAndState(UUID id, Boolean state) {
        Item theItem = itemRepository.findByIdAndActive(id, Boolean.TRUE)
                .orElseThrow(()-> new ObjectNotFoundException(Item.class,"ITEM NOT FOUND"));
        return theItem;
    }

    @Override
    public List<Item> findAllByActive(Boolean active) {
        return itemRepository.findAllByActive(Boolean.TRUE);
    }
}
