package com.schoolfeeding.sf_backend.domain.service;

import com.schoolfeeding.sf_backend.domain.dto.UserCreationDTO;
import com.schoolfeeding.sf_backend.domain.entity.Users;
import com.schoolfeeding.sf_backend.domain.repository.DistrictRepository;
import com.schoolfeeding.sf_backend.domain.repository.SchoolRepository;
import com.schoolfeeding.sf_backend.domain.repository.UsersRepository;
import com.schoolfeeding.sf_backend.util.role.ERole;
import com.schoolfeeding.sf_backend.util.status.EStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsersServiceTest {

    @Mock
    private UsersRepository usersRepository;
    @Mock
    private DistrictRepository districtRepository;
    @Mock
    private SchoolRepository schoolRepository;
    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private UsersService usersService;

    private UserCreationDTO userCreationDTO;

    @BeforeEach
    void setUp() {
        userCreationDTO = new UserCreationDTO();
        userCreationDTO.setNames("John Doe");
        userCreationDTO.setEmail("john@example.com");
        userCreationDTO.setPhone("1234567890");
        userCreationDTO.setRole(ERole.ADMIN);
        userCreationDTO.setPassword("password123");
    }

    @Test
    void createUser_ShouldSaveUser() {
        // Arrange
        Users user = new Users();
        user.setEmail(userCreationDTO.getEmail());
        when(usersRepository.save(any(Users.class))).thenReturn(user);

        // Act
        Users savedUser = usersService.createUser(userCreationDTO, "ADMIN_CONSOLE");

        // Assert
        assertNotNull(savedUser);
        assertEquals("john@example.com", savedUser.getEmail());
        verify(usersRepository, times(1)).save(any(Users.class));
        verify(auditLogService, times(1)).createLog(eq("USER_CREATED"), anyString(), eq("INFO"), anyString());
    }

    @Test
    void getUserById_ShouldReturnUser_WhenExists() {
        // Arrange
        UUID id = UUID.randomUUID();
        Users user = new Users();
        user.setId(id);
        user.setStatus(EStatus.ACTIVE);
        when(usersRepository.findByIdAndStatusNot(id, EStatus.DELETED)).thenReturn(Optional.of(user));

        // Act
        Users foundUser = usersService.getUserById(id);

        // Assert
        assertNotNull(foundUser);
        assertEquals(id, foundUser.getId());
    }

    @Test
    void getUserById_ShouldThrowException_WhenNotFound() {
        // Arrange
        UUID id = UUID.randomUUID();
        when(usersRepository.findByIdAndStatusNot(id, EStatus.DELETED)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> usersService.getUserById(id));
    }
}
