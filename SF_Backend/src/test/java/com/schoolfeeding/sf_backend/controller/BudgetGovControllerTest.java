package com.schoolfeeding.sf_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.schoolfeeding.sf_backend.domain.entity.Budget_Gov;
import com.schoolfeeding.sf_backend.domain.service.BudgetGovService;
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
class BudgetGovControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BudgetGovService budgetGovService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser
    void createBudget_ShouldReturnOk() throws Exception {
        Budget_Gov budget = new Budget_Gov();
        budget.setFiscalYear("2025");
        budget.setBudget(10000.0);

        when(budgetGovService.createBudget(any(Budget_Gov.class))).thenReturn(budget);

        mockMvc.perform(post("/api/budgets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(budget)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fiscalYear").value("2025"));
    }

    @Test
    @WithMockUser
    void getAllBudgets_ShouldReturnList() throws Exception {
        when(budgetGovService.getAllBudgets()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/budgets"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    @WithMockUser
    void getBudgetById_ShouldReturnBudget() throws Exception {
        UUID id = UUID.randomUUID();
        Budget_Gov budget = new Budget_Gov();
        budget.setId(id);
        budget.setFiscalYear("2025");
        when(budgetGovService.getBudgetById(id)).thenReturn(budget);

        mockMvc.perform(get("/api/budgets/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fiscalYear").value("2025"));
    }

    @Test
    @WithMockUser
    void updateBudget_ShouldReturnUpdated() throws Exception {
        UUID id = UUID.randomUUID();
        Budget_Gov budget = new Budget_Gov();
        budget.setFiscalYear("2026");

        when(budgetGovService.updateBudget(eq(id), any(Budget_Gov.class))).thenReturn(budget);

        mockMvc.perform(put("/api/budgets/" + id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(budget)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fiscalYear").value("2026"));
    }

    @Test
    @WithMockUser
    void deleteBudget_ShouldReturnSuccess() throws Exception {
        UUID id = UUID.randomUUID();

        mockMvc.perform(delete("/api/budgets/" + id))
                .andExpect(status().isOk())
                .andExpect(content().string("Budget deleted (soft delete)"));
    }
}
