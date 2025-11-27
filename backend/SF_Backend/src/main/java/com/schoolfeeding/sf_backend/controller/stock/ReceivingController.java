package com.schoolfeeding.sf_backend.controller.stock;

import com.schoolfeeding.sf_backend.domain.entity.Orders;
import com.schoolfeeding.sf_backend.service.district.request.IRespondService;
import com.schoolfeeding.sf_backend.util.order.EDelivery;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/receiving")
public class ReceivingController {

    private final IRespondService respondService;


    @GetMapping("/all/{sId}")
    public ResponseEntity<List<Orders>> getAllReceiving(@PathVariable String sId) {
        try {
            List<Orders> theReceivingList = respondService.findAllByRequestItemSchool(UUID.fromString(sId));
            if (theReceivingList != null && !theReceivingList.isEmpty()) {
                return ResponseEntity.ok(theReceivingList);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }




    @PutMapping("/receivingOrder/{id}")
    public ResponseEntity<?> receivingOrder(
            @PathVariable String id,
            @RequestParam int rating) {

        try {
            Orders existOrder = respondService.findById(UUID.fromString(id));
            if (Objects.nonNull(existOrder)) {
                existOrder.setRating(rating);
                Orders saveProcess = respondService.recieveOrders(existOrder);
                return ResponseEntity.ok(saveProcess);
            } else {
                return ResponseEntity.badRequest().body("Invalid Delivery Id");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error " + ex.getMessage());
        }
    }

}
