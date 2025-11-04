package com.schoolfeeding.sf_backend.service.school.requestItem;

import com.schoolfeeding.sf_backend.domain.entity.RequestItem;
import com.schoolfeeding.sf_backend.repository.school.IRequestItemRepository;
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
    public RequestItem saveRequestItem(RequestItem theRequestItem) {
        return requestItemRepository.save(theRequestItem);
    }

    @Override
    public RequestItem updateRequestItem(RequestItem theRequestItem) {
        RequestItem found = findByIdAndState(theRequestItem.getId(), Boolean.TRUE);
        if (Objects.isNull(found)) {
            found.setItems(theRequestItem.getItems());
            found.setRequestStatus(theRequestItem.getRequestStatus());
            found.setDescription(theRequestItem.getDescription());
            found.setQuantity(theRequestItem.getQuantity());
            requestItemRepository.save(found);
        }
        throw new ObjectNotFoundException(RequestItem.class,"RequestItem NOT FOUND");
    }

    @Override
    public RequestItem deleteRequestItem(RequestItem theRequestItem) {
        RequestItem found = findByIdAndState(theRequestItem.getId(), Boolean.TRUE);
        if (Objects.isNull(found)) {
            found.setActive(Boolean.FALSE);
            requestItemRepository.save(found);
        }
        throw new ObjectNotFoundException(RequestItem.class,"RequestItem NOT FOUND");
    }

    @Override
    public RequestItem findByIdAndState(UUID requestItemId, Boolean state) {
        RequestItem theRequestItem = requestItemRepository.findByIdAndActive(requestItemId, Boolean.TRUE)
                .orElseThrow(() -> new ObjectNotFoundException(RequestItem.class,"REQUEST NOT FOUND"));
        return theRequestItem;
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
        return requestItemRepository.findRequestItemsBySchoolIdAndRequestStatusAndActive(schoolId, requestStatus, Boolean.TRUE);
    }
}
