package com.schoolfeeding.sf_backend.controller;

import com.schoolfeeding.sf_backend.domain.entity.RequestItem;
import com.schoolfeeding.sf_backend.domain.service.RequestItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/request-items")
@RequiredArgsConstructor
public class RequestItemController {

    private final RequestItemService requestItemService;

    // ✅ Create
    @PostMapping
    public ResponseEntity<RequestItem> createRequestItem(@RequestBody RequestItem requestItem) {
        return ResponseEntity.ok(requestItemService.createRequestItem(requestItem));
    }

    // ✅ Get all (only active)
    @GetMapping
    public ResponseEntity<List<RequestItem>> getAllRequestItems() {
        return ResponseEntity.ok(requestItemService.getAllRequestItems());
    }

    // ✅ Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<RequestItem> getRequestItemById(@PathVariable UUID id) {
        return ResponseEntity.ok(requestItemService.getRequestItemById(id));
    }

    // ✅ Update
    @PutMapping("/{id}")
    public ResponseEntity<RequestItem> updateRequestItem(
            @PathVariable UUID id,
            @RequestBody RequestItem requestItem) {
        return ResponseEntity.ok(requestItemService.updateRequestItem(id, requestItem));
    }

    // ✅ Soft Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRequestItem(@PathVariable UUID id) {
        requestItemService.deleteRequestItem(id);
        return ResponseEntity.ok("Request item marked as deleted successfully.");
    }
}
