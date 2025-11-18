package com.schoolfeeding.sf_backend.service.school.requestItem;

import com.schoolfeeding.sf_backend.domain.entity.RequestItem;
import com.schoolfeeding.sf_backend.domain.entity.RequestItemDetail;
import com.schoolfeeding.sf_backend.repository.school.IRequestItemRepository;
import com.schoolfeeding.sf_backend.util.audit.Auditable;
import com.schoolfeeding.sf_backend.util.audit.EAction;
import com.schoolfeeding.sf_backend.util.audit.EResource;
import com.schoolfeeding.sf_backend.util.order.ERequest;
import lombok.RequiredArgsConstructor;
import org.hibernate.ObjectNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RequestItemServiceImpl implements IRequestItemService {

    private final IRequestItemRepository requestItemRepository;

    @Override
    @Auditable(action = EAction.CREATE, resource = EResource.SCHOOL)
    public RequestItem saveRequestItem(RequestItem theRequestItem) {
        theRequestItem.setRequestStatus(ERequest.PENDING);
        if (theRequestItem.getRequestItemDetails() != null) {
            for (RequestItemDetail detail : theRequestItem.getRequestItemDetails()) {
                detail.setRequestItem(theRequestItem);
               // detail.setRequest_id(theRequestItem.getId());
            }
        }
        return requestItemRepository.save(theRequestItem);
    }

    @Override
    @Auditable(action = EAction.UPDATE, resource = EResource.SCHOOL)
    public RequestItem updateRequestItem(RequestItem theRequestItem) {
        RequestItem found = findByIdAndState(theRequestItem.getId(), Boolean.TRUE);
        if (Objects.nonNull(found)) {
            found.setRequestItemDetails(theRequestItem.getRequestItemDetails());
            found.setRequestStatus(theRequestItem.getRequestStatus());
            found.setDescription(theRequestItem.getDescription());
            found.setRequestItemDetails(theRequestItem.getRequestItemDetails());
            return requestItemRepository.save(found);
        }
        throw new ObjectNotFoundException(RequestItem.class,"RequestItem NOT FOUND");
    }

    @Override
    @Auditable(action = EAction.DELETE, resource = EResource.SCHOOL)
    public RequestItem deleteRequestItem(RequestItem theRequestItem) {
        RequestItem found = findByIdAndState(theRequestItem.getId(), Boolean.TRUE);
        if (Objects.nonNull(found)) {
            found.setActive(Boolean.FALSE);
            return requestItemRepository.save(found);
        }
        throw new ObjectNotFoundException(RequestItem.class,"RequestItem NOT FOUND");
    }

    @Override
    public RequestItem repondRequest(RequestItem theRequestItem) {
        RequestItem found = findByIdAndState(theRequestItem.getId(), Boolean.TRUE);
        if (Objects.nonNull(found)) {
            found.setRequestStatus(theRequestItem.getRequestStatus());
            return requestItemRepository.save(found);
        }
        throw new ObjectNotFoundException(RequestItem.class,"RequestItem NOT FOUND");
    }

    @Override
    public RequestItem findByIdAndState(UUID requestItemId, Boolean state) {
        return requestItemRepository.findByIdAndActive(requestItemId, Boolean.TRUE)
                .orElseThrow(() -> new ObjectNotFoundException(RequestItem.class,"REQUEST NOT FOUND"));

    }

    @Override
    public RequestItem findRequestItemBySchool_IdAndRequestStatusAndActiveOrderByCreatedByDesc(UUID schoolId, Boolean active) {
        return requestItemRepository.findRequestItemBySchool_IdAndRequestStatusAndActiveOrderByCreatedByDesc(schoolId, ERequest.COMPLETED,Boolean.TRUE)
                .orElseThrow(() -> new ObjectNotFoundException(RequestItem.class,"REQUEST NOT FOUND"));

    }

    @Override
    public List<RequestItem> findAllRequestItemsByState(Boolean state) {
        return requestItemRepository.findAllByActive(Boolean.TRUE);
    }

    @Override
    public List<RequestItem> findAllRequestItemsBySchoolIdAndState(UUID schoolId, Boolean state) {
        return requestItemRepository.findBySchoolIdAndActive(schoolId, Boolean.TRUE);
    }

    @Override
    public List<RequestItem> findAllRequestItemsByDistrictIdAndState(UUID districtId, Boolean state) {
        return requestItemRepository.findByDistrictIdAndActive(districtId, Boolean.TRUE);
    }

    @Override
    public List<RequestItem> findRequestItemsByRequestStatusAndState(ERequest requestStatus, Boolean state) {
        return requestItemRepository.findRequestItemsByRequestStatusAndActive(requestStatus, Boolean.TRUE);
    }

    @Override
    public List<RequestItem> findRequestItemsByDistrictIdAndRequestStatusAndState(UUID districtId, ERequest requestStatus, Boolean state) {
        return requestItemRepository.findRequestItemsByDistrictIdAndRequestStatusAndActive(districtId, requestStatus, Boolean.TRUE);
    }

    @Override
    public List<RequestItem> findRequestItemsBySchoolIdAndRequestStatusAndState(UUID schoolId, ERequest requestStatus, Boolean state) {
        return requestItemRepository.findRequestItemsBySchoolIdAndRequestStatusAndActiveOrderByCreatedByDesc(schoolId, requestStatus, Boolean.TRUE);
    }
}
