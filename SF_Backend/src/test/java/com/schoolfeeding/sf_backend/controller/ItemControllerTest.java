package com.schoolfeeding.sf_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.schoolfeeding.sf_backend.domain.entity.Item;
import com.schoolfeeding.sf_backend.domain.service.ItemService;
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
class ItemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ItemService itemService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser
    void createItem_ShouldReturnOk() throws Exception {
        Item item = new Item();
        item.setName("Maize");
        item.setPerStudent(100.0);

        when(itemService.createItem(any(Item.class))).thenReturn(item);

        mockMvc.perform(post("/api/v1/items")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(item)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Maize"));
    }

    @Test
    @WithMockUser
    void getAllItems_ShouldReturnList() throws Exception {
        when(itemService.getAllItems()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/v1/items"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    @WithMockUser
    void getItemById_ShouldReturnItem() throws Exception {
        UUID id = UUID.randomUUID();
        Item item = new Item();
        item.setId(id);
        item.setName("Sugar");
        when(itemService.getItemById(id)).thenReturn(item);

        mockMvc.perform(get("/api/v1/items/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Sugar"));
    }

    @Test
    @WithMockUser
    void updateItem_ShouldReturnUpdated() throws Exception {
        UUID id = UUID.randomUUID();
        Item item = new Item();
        item.setName("Salt");

        when(itemService.updateItem(eq(id), any(Item.class))).thenReturn(item);

        mockMvc.perform(put("/api/v1/items/" + id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(item)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Salt"));
    }

    @Test
    @WithMockUser
    void deleteItem_ShouldReturnSuccess() throws Exception {
        UUID id = UUID.randomUUID();

        mockMvc.perform(delete("/api/v1/items/" + id))
                .andExpect(status().isOk())
                .andExpect(content().string("Item marked as deleted successfully."));
    }
}
