package com.schoolfeeding.sf_backend.repository.gov;

import com.schoolfeeding.sf_backend.domain.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IItemRepository extends JpaRepository<Item, UUID> {
    List<Item> findAllByActive(Boolean active);
    Optional<Item> findByIdAndActive(UUID id, Boolean active);
}
