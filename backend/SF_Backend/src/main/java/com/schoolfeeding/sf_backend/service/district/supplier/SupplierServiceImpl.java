package com.schoolfeeding.sf_backend.service.district.supplier;

import com.schoolfeeding.sf_backend.domain.entity.Item;
import com.schoolfeeding.sf_backend.domain.entity.Supplier;
import com.schoolfeeding.sf_backend.repository.district.ISupplierRepository;
import com.schoolfeeding.sf_backend.util.audit.Auditable;
import com.schoolfeeding.sf_backend.util.audit.EAction;
import com.schoolfeeding.sf_backend.util.audit.EResource;
import com.schoolfeeding.sf_backend.util.role.ERole;
import lombok.RequiredArgsConstructor;
import org.hibernate.ObjectNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SupplierServiceImpl implements ISupplierService{

    private final ISupplierRepository supplierRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Auditable(action = EAction.CREATE, resource = EResource.DISTRICT)
    public Supplier saveSupplier(Supplier theSupplier) {
        theSupplier.setPassword(passwordEncoder.encode(theSupplier.getPassword()));
        theSupplier.setRole(ERole.SUPPLIER);
        return supplierRepository.save(theSupplier);
    }

    @Override
    @Auditable(action = EAction.UPDATE, resource = EResource.DISTRICT)
    public Supplier updateSupplier(Supplier theSupplier) {
        Supplier foundSupplier = findByIdAndState(theSupplier.getId(), Boolean.TRUE);
        if (Objects.nonNull(foundSupplier)) {
            foundSupplier.setNames(theSupplier.getNames());
            foundSupplier.setEmail(theSupplier.getEmail());
            foundSupplier.setPhone(theSupplier.getPhone());
            foundSupplier.setProfile(theSupplier.getProfile());
            foundSupplier.setAddress(theSupplier.getAddress());
            foundSupplier.setItems(theSupplier.getItems());
            foundSupplier.setBankAccount(theSupplier.getBankAccount());
            foundSupplier.setTinNumber(theSupplier.getTinNumber());

            if (theSupplier.getPassword() != null && !theSupplier.getPassword().isEmpty()) {
                foundSupplier.setPassword(passwordEncoder.encode(theSupplier.getPassword()));
            }

            if (theSupplier.getDistrict() != null)  {
                foundSupplier.setDistrict(theSupplier.getDistrict());
            }

            if (theSupplier.getProfile() != null)  {
                foundSupplier.setProfile(theSupplier.getProfile());
            }
            return supplierRepository.save(theSupplier);
        }
        throw new ObjectNotFoundException(Supplier.class,"SUPPLIER NOT FOUND");
    }

    @Override
    @Auditable(action = EAction.DELETE, resource = EResource.DISTRICT)
    public Supplier deleteSupplier(Supplier theSupplier) {
        Supplier foundSupplier = findByIdAndState(theSupplier.getId(), Boolean.TRUE);
        if (Objects.nonNull(foundSupplier)) {
            foundSupplier.setActive(Boolean.FALSE);
            return supplierRepository.save(theSupplier);
        }
        throw new ObjectNotFoundException(Supplier.class,"SUPPLIER NOT FOUND");
    }

    @Override
    public List<Item> findItemBySupplierId(UUID id, Boolean state) {
        return supplierRepository.findSupplierItemByActive(id, Boolean.TRUE);
    }

    @Override
    public Supplier findByIdAndState(UUID id, Boolean state) {
        return supplierRepository.findByIdAndActive(id, Boolean.TRUE)
                .orElseThrow( () -> new ObjectNotFoundException(Supplier.class,"SUPPLIER NOT FOUND"));

    }

    @Override
    public List<Supplier> findAllByState(Boolean state) {
        return supplierRepository.findAllByActive(Boolean.TRUE);
    }

    @Override
    public List<Supplier> findAllByDistrictAndAState(UUID districtId, Boolean state) {
        return  supplierRepository.findAllByDistrict_IdAndActive(districtId, Boolean.TRUE);
    }
}
