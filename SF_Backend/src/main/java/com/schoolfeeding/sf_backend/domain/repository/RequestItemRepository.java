package com.schoolfeeding.sf_backend.domain.repository;

import com.schoolfeeding.sf_backend.domain.entity.RequestItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface RequestItemRepository extends JpaRepository<RequestItem, UUID> {

    // ✅ Return only non-deleted items
    @Query("SELECT r FROM RequestItem r WHERE r.isDeleted = false")
    List<RequestItem> findAllActive();
}
