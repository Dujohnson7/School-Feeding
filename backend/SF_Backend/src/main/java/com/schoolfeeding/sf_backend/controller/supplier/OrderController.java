package com.schoolfeeding.sf_backend.controller.supplier;

import com.schoolfeeding.sf_backend.domain.entity.Orders;
import com.schoolfeeding.sf_backend.service.district.request.IRespondService;
import com.schoolfeeding.sf_backend.util.order.EDelivery;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/supplierOrder")
public class OrderController {

    private final IRespondService respondService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(@PathVariable String id) {
        try {
            Orders theOrder = respondService.findById(UUID.fromString(id));
            if (!Objects.isNull(theOrder)) {
                return ResponseEntity.ok(theOrder);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Order: " + ex.getMessage());
        }
    }



    @GetMapping("/all/{sId}")
    public ResponseEntity<List<Orders>> getAllOrder(@PathVariable String sId) {
        try {
            List<Orders> orderList = respondService.findAllBySupplierId(UUID.fromString(sId));
            if (orderList != null && !orderList.isEmpty()) {
                return ResponseEntity.ok(orderList);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }

}
