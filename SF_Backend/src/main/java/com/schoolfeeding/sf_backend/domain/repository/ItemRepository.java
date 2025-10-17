package com.schoolfeeding.sf_backend.domain.repository;

import com.schoolfeeding.sf_backend.domain.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface ItemRepository extends JpaRepository<Item, UUID> {

    // ✅ Fetch only active items (not deleted)
    @Query("SELECT i FROM Item i WHERE i.isDeleted = false")
    List<Item> findAllActive();
}
