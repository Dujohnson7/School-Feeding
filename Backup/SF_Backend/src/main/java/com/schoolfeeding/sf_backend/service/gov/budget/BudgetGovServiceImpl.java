package com.schoolfeeding.sf_backend.service.gov.budget;

import com.schoolfeeding.sf_backend.domain.entity.Budget_District;
import com.schoolfeeding.sf_backend.domain.entity.Budget_Gov;
import com.schoolfeeding.sf_backend.repository.gov.IBudgetGovRepository;
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
public class BudgetGovServiceImpl implements IBudgetGovService {

    private final IBudgetGovRepository budgetRepository;

    @Override
    @Auditable(action = EAction.CREATE, resource = EResource.GOV)
    public Budget_Gov budgetSave(Budget_Gov theBudget_gov) {
        return budgetRepository.save(theBudget_gov);
    }

    @Override
    @Auditable(action = EAction.UPDATE, resource = EResource.GOV)
    public Budget_Gov budgetUpdate(Budget_Gov theBudget_gov) {
        Budget_Gov found = findByIdAndState(theBudget_gov.getId(), Boolean.TRUE);
        if(Objects.isNull(found)){
            found.setFiscalYear(theBudget_gov.getFiscalYear());
            found.setDescription(theBudget_gov.getDescription());
            found.setBudget(theBudget_gov.getBudget());
            found.setStatus(theBudget_gov.getStatus());
            return budgetRepository.save(found);
        }
        throw new ObjectNotFoundException(Budget_Gov.class, "BUDGET NOT FOUND");
    }

    @Override
    @Auditable(action = EAction.DELETE, resource = EResource.GOV)
    public Budget_Gov budgetDelete(Budget_Gov theBudget_gov) {
        Budget_Gov found = findByIdAndState(theBudget_gov.getId(), Boolean.TRUE);
        if(Objects.isNull(found)){
            found.setActive(Boolean.FALSE);
            return budgetRepository.save(found);
        }
        throw new ObjectNotFoundException(Budget_Gov.class, "BUDGET NOT FOUND");
    }

    @Override
    public Budget_Gov findByIdAndState(UUID id, Boolean state) {
        Budget_Gov theBudget = budgetRepository.findByIdAndActive(id, state).orElseThrow( () -> new ObjectNotFoundException(Budget_Gov.class, "Budget Not Found"));
        return theBudget;
    }

    @Override
    public List<Budget_Gov> findAllByActive(Boolean active) {
        return budgetRepository.findAllByActive(Boolean.TRUE);
    }
}
