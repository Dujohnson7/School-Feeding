package com.schoolfeeding.sf_backend.service.admin.district;

import com.schoolfeeding.sf_backend.domain.entity.District;
import com.schoolfeeding.sf_backend.repository.admin.IDistrictRepository;
import com.schoolfeeding.sf_backend.util.address.EProvince;
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
public class DistrictServiceImpl implements IDistrictService {

    private final IDistrictRepository districtRepository;

    @Override
    @Auditable(action = EAction.CREATE, resource = EResource.ADMIN)
    public District saveDistrict(District theDistrict) {
        return districtRepository.save(theDistrict);
    }

    @Override
    @Auditable(action = EAction.UPDATE, resource = EResource.ADMIN)
    public District updateDistrict(District theDistrict) {
        District found = findDistrictByIdAndState(theDistrict.getId(), Boolean.TRUE);
        if (Objects.isNull(found)) {
            found.setProvince(theDistrict.getProvince());
            found.setDistrict(theDistrict.getDistrict());
            return districtRepository.save(found);
        }

        throw new ObjectNotFoundException(District.class, "District not found");
    }

    @Override
    @Auditable(action = EAction.DELETE, resource = EResource.ADMIN)
    public District deleteDistrict(District theDistrict) {
        District found = findDistrictByIdAndState(theDistrict.getId(), Boolean.TRUE);
        if (Objects.isNull(found)) {
            found.setActive(Boolean.FALSE);
            return districtRepository.save(found);
        }

        throw new ObjectNotFoundException(District.class, "District not found");
    }

    @Override
    public District findDistrictByIdAndState(UUID theId, Boolean state) {
        District theDistrict = districtRepository.findDistrictByIdAndActive(theId, Boolean.TRUE)
                .orElseThrow( () -> new ObjectNotFoundException(District.class, "DISTRICT NOT FOUND"));
        return theDistrict;
    }

    @Override
    public List<District> findAllDistrictsAndState(Boolean state) {
        return districtRepository.findDistrictByActive(Boolean.TRUE);
    }

    @Override
    public List<District> findDistrictsByProvinceAndState(EProvince province, Boolean state) {
        return districtRepository.findDistrictByProvinceAndActive(province, Boolean.TRUE);
    }

    @Override
    public long countDistrictsAndState(Boolean state) {
        return districtRepository.countAllByActive(Boolean.TRUE);
    }
}
