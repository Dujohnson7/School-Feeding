package com.schoolfeeding.sf_backend.controller.supplier;

import com.schoolfeeding.sf_backend.domain.entity.Orders;
import com.schoolfeeding.sf_backend.service.district.request.IRespondService;
import com.schoolfeeding.sf_backend.util.order.EDelivery;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/supplierDelivery")
public class DeliveryController {

    private final IRespondService respondService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(@PathVariable String id) {
        try {
            Orders theDelivery = respondService.findById(UUID.fromString(id));
            if (!Objects.isNull(theDelivery)) {
                return ResponseEntity.ok(theDelivery);
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


    @PutMapping("/processOrder/{id}")
    public ResponseEntity<?> processOrder(@PathVariable String id) {
        try {
            Orders existOrder = respondService.findById(UUID.fromString(id));
            if (existOrder != null) {
                existOrder.setId(UUID.fromString(id));
                existOrder.setDeliveryStatus(EDelivery.PROCESSING);
                existOrder.setDeliveryDate(new Date());
                Orders saveProcess = respondService.updateOrders(existOrder);
                return ResponseEntity.ok(saveProcess);
            }else  {
                return ResponseEntity.badRequest().body("Invalid Delivery Id");
            }
        }catch (Exception ex){
            return ResponseEntity.badRequest().body("Error " + ex.getMessage());
        }
    }


    @PutMapping("/deliveryOrder/{id}")
    public ResponseEntity<?> deliveryOrder(@PathVariable String id) {
        try {
            Orders existOrder = respondService.findById(UUID.fromString(id));
            if (existOrder != null) {
                existOrder.setId(UUID.fromString(id));
                existOrder.setDeliveryStatus(EDelivery.DELIVERED);
                existOrder.setDeliveryDate(new Date());
                Orders saveProcess = respondService.updateOrders(existOrder);
                return ResponseEntity.ok(saveProcess);
            }else  {
                return ResponseEntity.badRequest().body("Invalid Delivery Id");
            }
        }catch (Exception ex){
            return ResponseEntity.badRequest().body("Error " + ex.getMessage());
        }
    }


}
