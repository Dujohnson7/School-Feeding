package com.schoolfeeding.sf_backend.domain.repository;

import com.schoolfeeding.sf_backend.domain.entity.Budget_Gov;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BudgetGovRepository extends JpaRepository<Budget_Gov, UUID> {
    
    List<Budget_Gov> findByIsDeletedFalse();
}
