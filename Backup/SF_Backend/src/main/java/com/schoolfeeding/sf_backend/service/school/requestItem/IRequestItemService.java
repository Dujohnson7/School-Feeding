package com.schoolfeeding.sf_backend.service.school.requestItem;

import com.schoolfeeding.sf_backend.domain.entity.RequestItem;
import com.schoolfeeding.sf_backend.util.order.ERequest;

import java.util.List;
import java.util.UUID;

public interface IRequestItemService {
    RequestItem saveRequestItem(RequestItem theRequestItem);
    RequestItem updateRequestItem(RequestItem theRequestItem);
    RequestItem deleteRequestItem(RequestItem theRequestItem);
    RequestItem findByIdAndState(UUID requestItemId, Boolean state);
    List<RequestItem> findAllRequestItemsByState(Boolean state);
    List<RequestItem> findAllRequestItemsBySchoolIdAndState(UUID schoolId, Boolean state);
    List<RequestItem> findAllRequestItemsByDistrictIdAndState(UUID districtId, Boolean state);
    List<RequestItem> findRequestItemsByRequestStatusAndState(ERequest requestStatus, Boolean state);
    List<RequestItem> findRequestItemsByDistrictIdAndRequestStatusAndState(UUID districtId,ERequest requestStatus, Boolean state);
    List<RequestItem> findRequestItemsBySchoolIdAndRequestStatusAndState(UUID schoolId,ERequest requestStatus, Boolean state);
}
