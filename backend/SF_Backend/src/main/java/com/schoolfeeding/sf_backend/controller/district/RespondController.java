package com.schoolfeeding.sf_backend.controller.district;

import com.schoolfeeding.sf_backend.domain.entity.Orders;
import com.schoolfeeding.sf_backend.domain.entity.RequestItem;
import com.schoolfeeding.sf_backend.service.district.request.IRespondService;
import com.schoolfeeding.sf_backend.service.school.requestItem.IRequestItemService;
import com.schoolfeeding.sf_backend.util.audit.Auditable;
import com.schoolfeeding.sf_backend.util.audit.EAction;
import com.schoolfeeding.sf_backend.util.audit.EResource;
import com.schoolfeeding.sf_backend.util.order.EDelivery;
import com.schoolfeeding.sf_backend.util.order.EOrderPay;
import com.schoolfeeding.sf_backend.util.order.ERequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/respondDistrict")
public class RespondController {

    private final IRequestItemService requestItemService;
    private final IRespondService respondService;

    @GetMapping("/districtRequestByRequestStatus")
    public ResponseEntity<List<RequestItem>> getAllRequestItemsByDistrictByERequest(@RequestParam String dId, @RequestParam String requestStatus) {
        try {
            List<RequestItem> requestItemList = requestItemService.findRequestItemsByDistrictIdAndRequestStatusAndState(UUID.fromString(dId), ERequest.valueOf(requestStatus) ,Boolean.TRUE);
            if (requestItemList != null && !requestItemList.isEmpty()) {
                return ResponseEntity.ok(requestItemList);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }


    @GetMapping("/districtRequest/{dId}")
    public ResponseEntity<List<RequestItem>> getAllRequestItemsByDistrict(@PathVariable String dId) {
        try {
            List<RequestItem> requestItemList = requestItemService.findAllRequestItemsByDistrictIdAndState(UUID.fromString(dId), Boolean.TRUE);
            if (requestItemList != null && !requestItemList.isEmpty()) {
                return ResponseEntity.ok(requestItemList);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }



    @GetMapping("/{id}")
    public ResponseEntity<?> getRequestItem(@PathVariable String id) {
        try {
            RequestItem theRequestItem = requestItemService.findByIdAndState(UUID.fromString(id), Boolean.TRUE);
            if (!Objects.isNull(theRequestItem)) {
                return ResponseEntity.ok(theRequestItem);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("RequestItem not found");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error RequestItem: " + ex.getMessage());
        }
    }




    @PutMapping("/approval/{id}")
    @Auditable(action = EAction.APPROVE, resource = EResource.DISTRICT)
    public ResponseEntity<?> approvalRequest(@PathVariable String id) {
        try {
            RequestItem existingRequest = requestItemService.findByIdAndState(UUID.fromString(id), Boolean.TRUE);

                if (Objects.nonNull(existingRequest)) {
                existingRequest.setRequestStatus(ERequest.COMPLETED);
                requestItemService.repondRequest(existingRequest);
                return ResponseEntity.ok("Request Approved");
            } else {
                return ResponseEntity.badRequest().body("RequestItem not found with id: " + id);
            }

        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error RESPOND: " + ex.getMessage());
        }
    }


    @PutMapping("/reject/{id}")
    @Auditable(action = EAction.REJECT, resource = EResource.DISTRICT)
    public ResponseEntity<?> rejectRequest(@PathVariable String id) {
        try {
            RequestItem existingRequest = requestItemService.findByIdAndState(UUID.fromString(id), Boolean.TRUE);

            if (Objects.nonNull(existingRequest)) {
                existingRequest.setRequestStatus(ERequest.REJECTED);
                requestItemService.repondRequest(existingRequest);
                return ResponseEntity.ok("Request Rejected");
            } else {
                return ResponseEntity.badRequest().body("RequestItem not found with id: " + id);
            }

        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error RESPOND: " + ex.getMessage());
        }
    }



    @PostMapping("/assignOrder")
    public ResponseEntity<?> assignOrderSupplier(@RequestBody Orders theOrders) {
        try {
            if (Objects.nonNull(theOrders)) {
                theOrders.setDeliveryStatus(EDelivery.SCHEDULED);
                theOrders.setOrderPayState(EOrderPay.PENDING);
                Orders assignOrder = respondService.saveOrders(theOrders);
                return ResponseEntity.ok(assignOrder);
            }else {
                return ResponseEntity.badRequest().body("Invalid Order Data");
            }
        }catch (Exception ex){
            return ResponseEntity.badRequest().body("Error Order: " + ex.getMessage());
        }
    }

}
