package com.schoolfeeding.sf_backend.domain.service;

import com.schoolfeeding.sf_backend.domain.dto.UserCreationDTO;
import com.schoolfeeding.sf_backend.domain.dto.UserUpdateDTO;
import com.schoolfeeding.sf_backend.domain.entity.District; // Assuming these exist
import com.schoolfeeding.sf_backend.domain.entity.School; // Assuming these exist
import com.schoolfeeding.sf_backend.domain.entity.Users;
import com.schoolfeeding.sf_backend.domain.repository.DistrictRepository; // Need these
import com.schoolfeeding.sf_backend.domain.repository.SchoolRepository; // Need these
import com.schoolfeeding.sf_backend.domain.repository.UsersRepository;
import com.schoolfeeding.sf_backend.util.role.ERole;
import com.schoolfeeding.sf_backend.util.status.EStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class UsersService {

    private final UsersRepository usersRepository;
    private final DistrictRepository districtRepository; // Assume these repositories exist
    private final SchoolRepository schoolRepository; // Assume these repositories exist
    private final AuditLogService auditLogService;
    // For a real app, inject PasswordEncoder, e.g., private final PasswordEncoder passwordEncoder;

    public UsersService(UsersRepository usersRepository,
                        DistrictRepository districtRepository,
                        SchoolRepository schoolRepository,
                        AuditLogService auditLogService
                        /*, PasswordEncoder passwordEncoder*/) {
        this.usersRepository = usersRepository;
        this.districtRepository = districtRepository;
        this.schoolRepository = schoolRepository;
        this.auditLogService = auditLogService;
        // this.passwordEncoder = passwordEncoder;
    }

    // Helper method to find a user by UUID and check for existence
    private Users findActiveUserByUuid(UUID uuid) {
        return usersRepository.findByUuidAndStatusNot(uuid, EStatus.DELETED)
                .orElseThrow(() -> new RuntimeException("User not found with UUID: " + uuid));
    }

    /**
     * CRUD: Create (Add New User)
     */
    public Users createUser(UserCreationDTO dto, String createdByActor) {
        Users user = new Users();
        user.setNames(dto.getNames());
        user.setPhone(dto.getPhone());
        user.setEmail(dto.getEmail());
        // In a real application, hash the password
        user.setPassword(dto.getPassword()); // Should be passwordEncoder.encode(dto.getPassword())
        user.setRole(dto.getRole());
        user.setStatus(EStatus.ACTIVE); // Default to active

        if (dto.getDistrictId() != null) {
            District district = districtRepository.findById(dto.getDistrictId())
                    .orElseThrow(() -> new RuntimeException("District not found"));
            user.setDistrict(district);
        }

        if (dto.getSchoolId() != null) {
            School school = schoolRepository.findById(dto.getSchoolId())
                    .orElseThrow(() -> new RuntimeException("School not found"));
            user.setSchool(school);
        }

        Users savedUser = usersRepository.save(user);
        auditLogService.createLog("USER_CREATED", createdByActor, "INFO", "New user created: " + savedUser.getEmail());
        return savedUser;
    }

    /**
     * CRUD: Read (List User) with Search/Filter/Pagination
     */
    public Page<Users> listUsers(String search, ERole role, EStatus status, Pageable pageable) {
        // Simple implementation: list all non-deleted users and apply search/filter in memory
        // A more advanced implementation would use specification or a native query for better DB performance
        if (search != null && !search.isEmpty()) {
             return usersRepository.findByStatusNotAndNamesContainingIgnoreCaseOrStatusNotAndPhoneContainingIgnoreCase(
                    EStatus.DELETED, search,
                    EStatus.DELETED, search,
                    pageable);
        }
        return usersRepository.findByStatusNot(EStatus.DELETED, pageable);
    }

    /**
     * CRUD: Update (Update User)
     */
    public Users updateUser(UUID uuid, UserUpdateDTO dto, String updatedByActor) {
        Users user = findActiveUserByUuid(uuid);

        if (dto.getNames() != null) user.setNames(dto.getNames());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        if (dto.getRole() != null) user.setRole(dto.getRole());
        if (dto.getProfile() != null) user.setProfile(dto.getProfile());

        if (dto.getDistrictId() != null) {
            District district = districtRepository.findById(dto.getDistrictId())
                    .orElseThrow(() -> new RuntimeException("District not found"));
            user.setDistrict(district);
        }

        if (dto.getSchoolId() != null) {
            School school = schoolRepository.findById(dto.getSchoolId())
                    .orElseThrow(() -> new RuntimeException("School not found"));
            user.setSchool(school);
        }

        Users updatedUser = usersRepository.save(user);
        auditLogService.createLog("USER_UPDATED", updatedByActor, "INFO", "User profile updated for: " + updatedUser.getEmail());
        return updatedUser;
    }

    /**
     * CRUD: Delete (Change Status to DELETED/Soft Delete)
     */
    public void deleteUserSoftly(UUID uuid, String deletedByActor) {
        Users user = findActiveUserByUuid(uuid);
        user.setStatus(EStatus.DELETED);
        usersRepository.save(user);
        auditLogService.createLog("USER_DELETED_SOFT", deletedByActor, "WARN", "User soft-deleted: " + user.getEmail());
    }

    /**
     * Management: Suspend User (Change Status to SUSPENDED)
     */
    public Users suspendUser(UUID uuid, String suspendedByActor) {
        Users user = findActiveUserByUuid(uuid);
        user.setStatus(EStatus.SUSPENDED);
        Users suspendedUser = usersRepository.save(user);
        auditLogService.createLog("USER_SUSPENDED", suspendedByActor, "WARN", "User suspended: " + user.getEmail());
        return suspendedUser;
    }

    /**
     * Management: Reset Password
     */
    public Users resetPassword(UUID uuid, String newPassword, String resetByActor) {
        Users user = findActiveUserByUuid(uuid);
        // In a real application, hash the new password
        user.setPassword(newPassword); // Should be passwordEncoder.encode(newPassword)
        Users updatedUser = usersRepository.save(user);
        auditLogService.createLog("PASSWORD_RESET", resetByActor, "INFO", "Password reset for user: " + user.getEmail());
        return updatedUser;
    }

    /**
     * Authentication: Check Credentials and Update lastLogin
     */
    public Users authenticateUser(String email, String password) {
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // In a real application, compare hashed passwords: passwordEncoder.matches(password, user.getPassword())
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid credentials");
        }

        if (user.getStatus() != EStatus.ACTIVE) {
            throw new RuntimeException("Account is inactive or suspended");
        }

        user.setLastLogin(LocalDateTime.now());
        usersRepository.save(user); // Update last login time

        auditLogService.createLog("USER_LOGIN", user.getEmail(), "INFO", "User logged in successfully.");
        return user;

    }
    public Optional<Users> findByEmail(String email) {
    return usersRepository.findByEmail(email);
}

}