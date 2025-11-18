package com.schoolfeeding.sf_backend.repository.gov;

import com.schoolfeeding.sf_backend.domain.entity.Budget_Gov;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IBudgetGovRepository extends JpaRepository <Budget_Gov, UUID> {
    Optional<Budget_Gov> findByIdAndActive(UUID id, Boolean active);
    Optional<Budget_Gov> findByFiscalYear(String fiscalYear);
    List<Budget_Gov> findAllByActive(Boolean active);
}
