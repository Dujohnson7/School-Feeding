package com.schoolfeeding.sf_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.schoolfeeding.sf_backend.domain.entity.StockIn;
import com.schoolfeeding.sf_backend.domain.service.StockInService;
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
class StockInControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StockInService stockInService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser
    void createStockIn_ShouldReturnOk() throws Exception {
        StockIn stockIn = new StockIn();
        stockIn.setQuantity(50.0);

        when(stockInService.createStockIn(any(StockIn.class))).thenReturn(stockIn);

        mockMvc.perform(post("/api/v1/stock-ins")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(stockIn)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(50.0));
    }

    @Test
    @WithMockUser
    void getAllStockIns_ShouldReturnList() throws Exception {
        when(stockInService.getAllStockIns()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/v1/stock-ins"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    @WithMockUser
    void getStockInById_ShouldReturnStockIn() throws Exception {
        UUID id = UUID.randomUUID();
        StockIn stockIn = new StockIn();
        stockIn.setId(id);
        stockIn.setQuantity(75.0);
        when(stockInService.getStockInById(id)).thenReturn(stockIn);

        mockMvc.perform(get("/api/v1/stock-ins/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(75.0));
    }

    @Test
    @WithMockUser
    void updateStockIn_ShouldReturnUpdated() throws Exception {
        UUID id = UUID.randomUUID();
        StockIn stockIn = new StockIn();
        stockIn.setQuantity(120.0);

        when(stockInService.updateStockIn(eq(id), any(StockIn.class))).thenReturn(stockIn);

        mockMvc.perform(put("/api/v1/stock-ins/" + id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(stockIn)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(120.0));
    }

    @Test
    @WithMockUser
    void deleteStockIn_ShouldReturnSuccess() throws Exception {
        UUID id = UUID.randomUUID();

        mockMvc.perform(delete("/api/v1/stock-ins/" + id))
                .andExpect(status().isOk())
                .andExpect(content().string("StockIn marked as deleted successfully."));
    }
}
