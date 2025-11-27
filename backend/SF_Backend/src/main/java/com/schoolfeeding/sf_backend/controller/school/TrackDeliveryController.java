package com.schoolfeeding.sf_backend.controller.school;

import com.schoolfeeding.sf_backend.domain.entity.Orders;
import com.schoolfeeding.sf_backend.domain.entity.RequestItem;
import com.schoolfeeding.sf_backend.domain.entity.Users;
import com.schoolfeeding.sf_backend.service.district.request.IRespondService;
import com.schoolfeeding.sf_backend.service.school.requestItem.IRequestItemService;
import com.schoolfeeding.sf_backend.util.order.EDelivery;
import com.schoolfeeding.sf_backend.util.order.ERequest;
import com.schoolfeeding.sf_backend.util.role.ERole;
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
@RequestMapping("/api/track")
public class TrackDeliveryController {

    private final IRespondService  respondService;


    @GetMapping("/current/{id}")
    public ResponseEntity<List<Orders>> getCurrentOrder(@PathVariable String id) {
        try {
            List<Orders> theCurrentOrder =  respondService.findCurrentOrderBySchool(UUID.fromString(id));
            if (theCurrentOrder != null && !theCurrentOrder.isEmpty()) {
                return ResponseEntity.ok(theCurrentOrder);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }


    @GetMapping("/patDeliveries/{sId}")
    public ResponseEntity<List<Orders>> getAllRequestItemsBySchoolByERequest(@PathVariable String sId) {
        try {
            List<Orders> pastDeliveryList = respondService.findAllByRequestItemSchoolAndDeliveryStatus(UUID.fromString(sId), EDelivery.DELIVERED);
            if (pastDeliveryList != null && !pastDeliveryList.isEmpty()) {
                return ResponseEntity.ok(pastDeliveryList);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }
}
