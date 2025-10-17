package com.schoolfeeding.sf_backend.domain.service;

import com.schoolfeeding.sf_backend.domain.entity.RequestItem;
import com.schoolfeeding.sf_backend.domain.repository.RequestItemRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RequestItemService {

    private final RequestItemRepository requestItemRepository;

    // ✅ Create a new RequestItem
    public RequestItem createRequestItem(RequestItem requestItem) {
        return requestItemRepository.save(requestItem);
    }

    // ✅ Get all active (non-deleted) request items
    public List<RequestItem> getAllRequestItems() {
        return requestItemRepository.findAllActive();
    }

    // ✅ Get one by ID
    public RequestItem getRequestItemById(UUID id) {
        return requestItemRepository.findById(id)
                .filter(r -> !r.getIsDeleted())
                .orElseThrow(() -> new EntityNotFoundException("Request item not found or deleted"));
    }

    // ✅ Update an existing RequestItem
    public RequestItem updateRequestItem(UUID id, RequestItem updatedRequest) {
        RequestItem existing = getRequestItemById(id);
        existing.setQuantity(updatedRequest.getQuantity());
        existing.setDescription(updatedRequest.getDescription());
        existing.setRequestStatus(updatedRequest.getRequestStatus());
        existing.setDistrict(updatedRequest.getDistrict());
        existing.setSchool(updatedRequest.getSchool());
        existing.setItems(updatedRequest.getItems());
        return requestItemRepository.save(existing);
    }

    // ✅ Soft Delete — change `isDeleted` to true
    public void deleteRequestItem(UUID id) {
        RequestItem requestItem = getRequestItemById(id);
        requestItem.setIsDeleted(true);
        requestItemRepository.save(requestItem);
    }
}
