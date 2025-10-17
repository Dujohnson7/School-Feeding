package com.schoolfeeding.sf_backend.domain.service;

import com.schoolfeeding.sf_backend.domain.entity.Item;
import com.schoolfeeding.sf_backend.domain.repository.ItemRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;

    // ✅ Create
    public Item createItem(Item item) {
        item.setIsDeleted(false);
        item.setActive(true);
        return itemRepository.save(item);
    }

    // ✅ Get all (only active, non-deleted)
    public List<Item> getAllItems() {
        return itemRepository.findAllActive();
    }

    // ✅ Get one by ID
    public Item getItemById(UUID id) {
        return itemRepository.findById(id)
                .filter(i -> !i.getIsDeleted())
                .orElseThrow(() -> new EntityNotFoundException("Item not found or deleted"));
    }

    // ✅ Update
    public Item updateItem(UUID id, Item updatedItem) {
        Item existing = getItemById(id);
        existing.setName(updatedItem.getName());
        existing.setPerStudent(updatedItem.getPerStudent());
        existing.setDescription(updatedItem.getDescription());
        return itemRepository.save(existing);
    }

    // ✅ Soft Delete (mark as deleted)
    public void deleteItem(UUID id) {
        Item item = getItemById(id);
        item.setIsDeleted(true);
        item.setActive(false);
        itemRepository.save(item);
    }
}
