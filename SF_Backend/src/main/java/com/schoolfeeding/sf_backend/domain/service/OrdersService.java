package com.schoolfeeding.sf_backend.domain.service;

import com.schoolfeeding.sf_backend.domain.entity.Orders;
import com.schoolfeeding.sf_backend.domain.repository.OrdersRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrdersService {

    private final OrdersRepository ordersRepository;

    // ✅ Create
    public Orders createOrder(Orders order) {
        return ordersRepository.save(order);
    }

    // ✅ Get all (only active)
    public List<Orders> getAllOrders() {
        return ordersRepository.findByIsDeletedFalse();
    }

    // ✅ Get by ID
    public Orders getOrderById(UUID id) {
        return ordersRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with id " + id));
    }

    // ✅ Update
    public Orders updateOrder(UUID id, Orders orderDetails) {
        Orders existingOrder = getOrderById(id);

        existingOrder.setRequestItem(orderDetails.getRequestItem());
        existingOrder.setSupplier(orderDetails.getSupplier());
        existingOrder.setDeliveryDate(orderDetails.getDeliveryDate());
        existingOrder.setDeliveryStatus(orderDetails.getDeliveryStatus());
        existingOrder.setOrderPrice(orderDetails.getOrderPrice());
        existingOrder.setOrderPayState(orderDetails.getOrderPayState());

        return ordersRepository.save(existingOrder);
    }

    // ✅ Soft Delete
    public void deleteOrder(UUID id) {
        Orders existingOrder = getOrderById(id);
        existingOrder.setIsDeleted(true);
        ordersRepository.save(existingOrder);
    }
}
