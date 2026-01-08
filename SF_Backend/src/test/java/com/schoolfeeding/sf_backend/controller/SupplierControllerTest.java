package com.schoolfeeding.sf_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.schoolfeeding.sf_backend.domain.entity.Supplier;
import com.schoolfeeding.sf_backend.domain.service.SupplierService;
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
class SupplierControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SupplierService supplierService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser
    void createSupplier_ShouldReturnOk() throws Exception {
        Supplier supplier = new Supplier();
        supplier.setAddress("Test Address");
        supplier.setTinNumber(123);

        when(supplierService.createSupplier(any(Supplier.class))).thenReturn(supplier);

        mockMvc.perform(post("/api/v1/suppliers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(supplier)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.address").value("Test Address"));
    }

    @Test
    @WithMockUser
    void getAllSuppliers_ShouldReturnList() throws Exception {
        when(supplierService.getAllSuppliers()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/v1/suppliers"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    @WithMockUser
    void getSupplierById_ShouldReturnSupplier() throws Exception {
        UUID id = UUID.randomUUID();
        Supplier supplier = new Supplier();
        supplier.setId(id);
        supplier.setAddress("Main St");
        when(supplierService.getSupplierById(id)).thenReturn(supplier);

        mockMvc.perform(get("/api/v1/suppliers/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.address").value("Main St"));
    }

    @Test
    @WithMockUser
    void updateSupplier_ShouldReturnUpdated() throws Exception {
        UUID id = UUID.randomUUID();
        Supplier supplier = new Supplier();
        supplier.setAddress("New St");

        when(supplierService.updateSupplier(eq(id), any(Supplier.class))).thenReturn(supplier);

        mockMvc.perform(put("/api/v1/suppliers/" + id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(supplier)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.address").value("New St"));
    }

    @Test
    @WithMockUser
    void deleteSupplier_ShouldReturnSuccess() throws Exception {
        UUID id = UUID.randomUUID();

        mockMvc.perform(delete("/api/v1/suppliers/" + id))
                .andExpect(status().isOk())
                .andExpect(content().string("Supplier marked as deleted successfully."));
    }
}
