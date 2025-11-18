package com.schoolfeeding.sf_backend.service.gov.school;

import com.schoolfeeding.sf_backend.domain.entity.School;
import com.schoolfeeding.sf_backend.repository.gov.ISchoolRepository;
import com.schoolfeeding.sf_backend.util.address.EDistrict;
import com.schoolfeeding.sf_backend.util.address.EProvince;
import com.schoolfeeding.sf_backend.util.audit.Auditable;
import com.schoolfeeding.sf_backend.util.audit.EAction;
import com.schoolfeeding.sf_backend.util.audit.EResource;
import lombok.RequiredArgsConstructor;
import org.hibernate.ObjectNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SchoolServiceImpl implements ISchoolService {

    private final ISchoolRepository schoolRepository;

    @Override
    @Auditable(action = EAction.CREATE, resource = EResource.GOV)
    public School schoolSave(School theSchool) {
        return schoolRepository.save(theSchool);
    }

    @Override
    @Auditable(action = EAction.UPDATE, resource = EResource.GOV)
    public School schoolUpdate(School theSchool) {
        School found = findById(theSchool.getId());
        if (found != null) {
            found.setName(theSchool.getName());
            found.setDirectorNames(theSchool.getDirectorNames());
            found.setEmail(theSchool.getEmail());
            found.setPhone(theSchool.getPhone());
            found.setStudent(theSchool.getStudent());
            found.setDistrict(theSchool.getDistrict());
            found.setAddress(theSchool.getAddress());
            found.setBank(theSchool.getBank());
            found.setStatus(theSchool.getStatus());
            return schoolRepository.save(found);
        }
        throw new  ObjectNotFoundException(School.class,"School Not FOUND");
    }

    @Override
    @Auditable(action = EAction.DELETE, resource = EResource.GOV)
    public School schoolDelete(School theSchool) {
        School found = findById(theSchool.getId());
        if (found != null) {
            found.setActive(Boolean.FALSE);
            return schoolRepository.save(found);
        }
        throw new  ObjectNotFoundException(School.class,"School Not FOUND");
    }

    @Override
    public School findById(UUID theId) {
        School theSchool = schoolRepository.findSchoolByIdAndActive(theId, Boolean.TRUE)
                .orElseThrow( () -> new ObjectNotFoundException(School.class, "School Not Found"));
        return theSchool;
    }

    @Override
    public List<School> findAllByDistrict(EDistrict theDistrict) {
        return schoolRepository.findAllByDistrict_DistrictAndActive(theDistrict, Boolean.TRUE);
    }

    @Override
    public List<School> findAllByProvince(EProvince theProvince) {
        return schoolRepository.findAllByDistrict_ProvinceAndActive(theProvince, Boolean.TRUE);
    }

    @Override
    public List<School> findAllByState(Boolean state) {
        return schoolRepository.findAllByActive(Boolean.TRUE);
    }
}
