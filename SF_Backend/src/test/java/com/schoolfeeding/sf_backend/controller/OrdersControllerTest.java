package com.schoolfeeding.sf_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.schoolfeeding.sf_backend.domain.entity.Orders;
import com.schoolfeeding.sf_backend.domain.service.OrdersService;
import com.schoolfeeding.sf_backend.util.order.EDelivery;
import com.schoolfeeding.sf_backend.util.order.EOrderPay;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class OrdersControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrdersService ordersService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser
    void createOrder_ShouldReturnOk() throws Exception {
        Orders order = new Orders();
        order.setOrderPrice(150.0);
        order.setDeliveryStatus(EDelivery.PENDING);
        order.setOrderPayState(EOrderPay.UNPAID);

        when(ordersService.createOrder(any(Orders.class))).thenReturn(order);

        mockMvc.perform(post("/api/v1/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(order)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderPrice").value(150.0));
    }

    @Test
    @WithMockUser
    void getAllOrders_ShouldReturnList() throws Exception {
        when(ordersService.getAllOrders()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/v1/orders"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    @WithMockUser
    void getOrderById_ShouldReturnOrder() throws Exception {
        UUID id = UUID.randomUUID();
        Orders order = new Orders();
        order.setId(id);
        when(ordersService.getOrderById(id)).thenReturn(order);

        mockMvc.perform(get("/api/v1/orders/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id.toString()));
    }

    @Test
    @WithMockUser
    void updateOrder_ShouldReturnUpdatedOrder() throws Exception {
        UUID id = UUID.randomUUID();
        Orders order = new Orders();
        order.setOrderPrice(200.0);

        when(ordersService.updateOrder(eq(id), any(Orders.class))).thenReturn(order);

        mockMvc.perform(put("/api/v1/orders/" + id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(order)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderPrice").value(200.0));
    }

    @Test
    @WithMockUser
    void deleteOrder_ShouldReturnSuccessMessage() throws Exception {
        UUID id = UUID.randomUUID();

        mockMvc.perform(delete("/api/v1/orders/" + id))
                .andExpect(status().isOk())
                .andExpect(content().string("Order marked as deleted successfully."));
    }
}
