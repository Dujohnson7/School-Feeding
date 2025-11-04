package com.schoolfeeding.sf_backend.repository.school;

import com.schoolfeeding.sf_backend.domain.entity.RequestItem;
import com.schoolfeeding.sf_backend.util.order.ERequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface IRequestItemRepository extends JpaRepository<RequestItem, UUID> {
    Optional<RequestItem> findByIdAndActive(UUID id, Boolean active);
    List<RequestItem> findAllByActive(Boolean active);
    List<RequestItem> findBySchoolIdAndActive(UUID schoolId, Boolean active);
    List<RequestItem> findByDistrictIdAndActive(UUID districtId, Boolean active);
    List<RequestItem> findRequestItemsByRequestStatusAndActive(ERequest requestStatus, Boolean active);
    List<RequestItem> findRequestItemsByDistrictIdAndRequestStatusAndActive(UUID districtId, ERequest requestStatus, Boolean active);
    List<RequestItem> findRequestItemsBySchoolIdAndRequestStatusAndActive(UUID schoolId, ERequest requestStatus, Boolean active);
    long countRequestItemsByRequestStatusAndActive(ERequest requestStatus, Boolean active);
    long countRequestItemsByDistrictIdAndActive(UUID districtId, Boolean active);
    long countRequestItemsByRequestStatusAndActiveAndCreatedBetween(ERequest requestStatus, Boolean active, Date start, Date end);

}
