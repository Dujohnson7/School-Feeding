package com.schoolfeeding.sf_backend.domain.service;

import com.schoolfeeding.sf_backend.domain.entity.Item;
import com.schoolfeeding.sf_backend.domain.repository.ItemRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ItemServiceTest {

    @Mock
    private ItemRepository itemRepository;

    @InjectMocks
    private ItemService itemService;

    private Item item;
    private UUID itemId;

    @BeforeEach
    void setUp() {
        itemId = UUID.randomUUID();
        item = new Item();
        item.setId(itemId);
        item.setName("Rice");
        item.setPerStudent(50.0);
        item.setDescription("Daily rice ration");
        item.setIsDeleted(false);
        item.setActive(true);
    }

    @Test
    void createItem_ShouldSaveItem() {
        when(itemRepository.save(any(Item.class))).thenReturn(item);

        Item savedItem = itemService.createItem(new Item());

        assertNotNull(savedItem);
        assertFalse(savedItem.getIsDeleted());
        assertTrue(savedItem.getActive());
        verify(itemRepository).save(any(Item.class));
    }

    @Test
    void getAllItems_ShouldReturnActiveItems() {
        when(itemRepository.findAllActive()).thenReturn(Collections.singletonList(item));

        List<Item> items = itemService.getAllItems();

        assertEquals(1, items.size());
        verify(itemRepository).findAllActive();
    }

    @Test
    void getItemById_ShouldReturnItem_WhenExistsAndNotDeleted() {
        when(itemRepository.findById(itemId)).thenReturn(Optional.of(item));

        Item foundItem = itemService.getItemById(itemId);

        assertNotNull(foundItem);
        assertEquals(itemId, foundItem.getId());
    }

    @Test
    void getItemById_ShouldThrowException_WhenDeleted() {
        item.setIsDeleted(true);
        when(itemRepository.findById(itemId)).thenReturn(Optional.of(item));

        assertThrows(EntityNotFoundException.class, () -> itemService.getItemById(itemId));
    }

    @Test
    void updateItem_ShouldUpdateFields() {
        when(itemRepository.findById(itemId)).thenReturn(Optional.of(item));
        when(itemRepository.save(any(Item.class))).thenReturn(item);

        Item updateDetails = new Item();
        updateDetails.setName("Beans");
        updateDetails.setPerStudent(30.0);

        Item updated = itemService.updateItem(itemId, updateDetails);

        assertEquals("Beans", updated.getName());
        assertEquals(30.0, updated.getPerStudent());
        verify(itemRepository).save(any(Item.class));
    }

    @Test
    void deleteItem_ShouldMarkAsDeleted() {
        when(itemRepository.findById(itemId)).thenReturn(Optional.of(item));
        when(itemRepository.save(any(Item.class))).thenReturn(item);

        itemService.deleteItem(itemId);

        assertTrue(item.getIsDeleted());
        assertFalse(item.getActive());
        verify(itemRepository).save(item);
    }
}
