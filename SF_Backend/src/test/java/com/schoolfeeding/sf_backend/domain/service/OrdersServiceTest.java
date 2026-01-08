package com.schoolfeeding.sf_backend.domain.service;

import com.schoolfeeding.sf_backend.domain.entity.Orders;
import com.schoolfeeding.sf_backend.domain.repository.OrdersRepository;
import com.schoolfeeding.sf_backend.util.order.EDelivery;
import com.schoolfeeding.sf_backend.util.order.EOrderPay;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrdersServiceTest {

    @Mock
    private OrdersRepository ordersRepository;

    @InjectMocks
    private OrdersService ordersService;

    private Orders order;
    private UUID orderId;

    @BeforeEach
    void setUp() {
        orderId = UUID.randomUUID();
        order = new Orders();
        order.setId(orderId);
        order.setOrderPrice(100.0);
        order.setDeliveryStatus(EDelivery.PENDING);
        order.setOrderPayState(EOrderPay.UNPAID);
    }

    @Test
    void createOrder_ShouldSaveOrder() {
        when(ordersRepository.save(any(Orders.class))).thenReturn(order);

        Orders savedOrder = ordersService.createOrder(new Orders());

        assertNotNull(savedOrder);
        assertEquals(orderId, savedOrder.getId());
        verify(ordersRepository, times(1)).save(any(Orders.class));
    }

    @Test
    void getAllOrders_ShouldReturnList() {
        when(ordersRepository.findByIsDeletedFalse()).thenReturn(Collections.singletonList(order));

        List<Orders> orders = ordersService.getAllOrders();

        assertFalse(orders.isEmpty());
        assertEquals(1, orders.size());
        verify(ordersRepository, times(1)).findByIsDeletedFalse();
    }

    @Test
    void getOrderById_ShouldReturnOrder_WhenExists() {
        when(ordersRepository.findById(orderId)).thenReturn(Optional.of(order));

        Orders foundOrder = ordersService.getOrderById(orderId);

        assertNotNull(foundOrder);
        assertEquals(orderId, foundOrder.getId());
    }

    @Test
    void getOrderById_ShouldThrowException_WhenNotFound() {
        when(ordersRepository.findById(orderId)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> ordersService.getOrderById(orderId));
    }

    @Test
    void updateOrder_ShouldUpdateAndSave() {
        when(ordersRepository.findById(orderId)).thenReturn(Optional.of(order));
        when(ordersRepository.save(any(Orders.class))).thenReturn(order);

        Orders updatedDetails = new Orders();
        updatedDetails.setOrderPrice(200.0);
        updatedDetails.setDeliveryStatus(EDelivery.DELIVERED);

        Orders result = ordersService.updateOrder(orderId, updatedDetails);

        assertNotNull(result);
        assertEquals(200.0, result.getOrderPrice());
        assertEquals(EDelivery.DELIVERED, result.getDeliveryStatus());
        verify(ordersRepository, times(1)).save(order);
    }

    @Test
    void deleteOrder_ShouldSetDeletedTrue() {
        when(ordersRepository.findById(orderId)).thenReturn(Optional.of(order));
        when(ordersRepository.save(any(Orders.class))).thenReturn(order);

        ordersService.deleteOrder(orderId);

        assertTrue(order.getIsDeleted());
        verify(ordersRepository, times(1)).save(order);
    }
}
