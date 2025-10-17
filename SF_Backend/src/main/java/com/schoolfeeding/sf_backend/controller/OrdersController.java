package com.schoolfeeding.sf_backend.controller;

import com.schoolfeeding.sf_backend.domain.entity.Orders;
import com.schoolfeeding.sf_backend.domain.service.OrdersService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrdersController {

    private final OrdersService ordersService;

    // ✅ Create
    @PostMapping
    public ResponseEntity<Orders> createOrder(@RequestBody Orders order) {
        return ResponseEntity.ok(ordersService.createOrder(order));
    }

    // ✅ Get all active
    @GetMapping
    public ResponseEntity<List<Orders>> getAllOrders() {
        return ResponseEntity.ok(ordersService.getAllOrders());
    }

    // ✅ Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<Orders> getOrderById(@PathVariable UUID id) {
        return ResponseEntity.ok(ordersService.getOrderById(id));
    }

    // ✅ Update
    @PutMapping("/{id}")
    public ResponseEntity<Orders> updateOrder(
            @PathVariable UUID id,
            @RequestBody Orders order) {
        return ResponseEntity.ok(ordersService.updateOrder(id, order));
    }

    // ✅ Soft Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable UUID id) {
        ordersService.deleteOrder(id);
        return ResponseEntity.ok("Order marked as deleted successfully.");
    }
}
