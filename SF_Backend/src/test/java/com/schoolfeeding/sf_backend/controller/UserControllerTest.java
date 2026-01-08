package com.schoolfeeding.sf_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.schoolfeeding.sf_backend.domain.dto.UserCreationDTO;
import com.schoolfeeding.sf_backend.domain.entity.Users;
import com.schoolfeeding.sf_backend.domain.service.UsersService;
import com.schoolfeeding.sf_backend.util.role.ERole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UsersService usersService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(roles = "ADMIN")
    void createUser_ShouldReturnCreated() throws Exception {
        // Arrange
        UserCreationDTO dto = new UserCreationDTO();
        dto.setNames("Jane Doe");
        dto.setEmail("jane@example.com");
        dto.setPhone("0987654321");
        dto.setRole(ERole.ADMIN);
        dto.setPassword("password123");

        Users createdUser = new Users();
        createdUser.setId(UUID.randomUUID());
        createdUser.setEmail("jane@example.com");
        createdUser.setNames("Jane Doe");

        when(usersService.createUser(any(UserCreationDTO.class), eq("ADMIN_CONSOLE"))).thenReturn(createdUser);

        // Act & Assert
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("jane@example.com"))
                .andExpect(jsonPath("$.names").value("Jane Doe"));
    }
}
