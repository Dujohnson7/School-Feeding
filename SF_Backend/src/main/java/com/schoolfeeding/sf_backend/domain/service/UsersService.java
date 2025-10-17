package com.schoolfeeding.sf_backend.domain.service;

import com.schoolfeeding.sf_backend.domain.dto.UserCreationDTO;
import com.schoolfeeding.sf_backend.domain.dto.UserUpdateDTO;
import com.schoolfeeding.sf_backend.domain.entity.District;
import com.schoolfeeding.sf_backend.domain.entity.School;
import com.schoolfeeding.sf_backend.domain.entity.Users;
import com.schoolfeeding.sf_backend.domain.repository.DistrictRepository;
import com.schoolfeeding.sf_backend.domain.repository.SchoolRepository;
import com.schoolfeeding.sf_backend.domain.repository.UsersRepository;
import com.schoolfeeding.sf_backend.util.role.ERole;
import com.schoolfeeding.sf_backend.util.status.EStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class UsersService {

    private final UsersRepository usersRepository;
    private final DistrictRepository districtRepository;
    private final SchoolRepository schoolRepository;
    private final AuditLogService auditLogService;

    public UsersService(UsersRepository usersRepository,
                        DistrictRepository districtRepository,
                        SchoolRepository schoolRepository,
                        AuditLogService auditLogService) {
        this.usersRepository = usersRepository;
        this.districtRepository = districtRepository;
        this.schoolRepository = schoolRepository;
        this.auditLogService = auditLogService;
    }

    // ✅ Updated to use id instead of uuid
    private Users findActiveUserById(UUID id) {
        return usersRepository.findByIdAndStatusNot(id, EStatus.DELETED)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }

    public Users createUser(UserCreationDTO dto, String createdByActor) {
        Users user = new Users();
        user.setNames(dto.getNames());
        user.setPhone(dto.getPhone());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setRole(dto.getRole());
        user.setStatus(EStatus.ACTIVE);

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
        auditLogService.createLog("USER_CREATED", createdByActor, "INFO",
                "New user created: " + savedUser.getEmail());
        return savedUser;
    }

    public Page<Users> listUsers(String search, ERole role, EStatus status, Pageable pageable) {
        if (search != null && !search.isEmpty()) {
            return usersRepository.findByStatusNotAndNamesContainingIgnoreCaseOrStatusNotAndPhoneContainingIgnoreCase(
                    EStatus.DELETED, search,
                    EStatus.DELETED, search,
                    pageable);
        }
        return usersRepository.findByStatusNot(EStatus.DELETED, pageable);
    }

    // ✅ Updated to use id
    public Users getUserById(UUID id) {
        return findActiveUserById(id);
    }

    // ✅ Updated to use id
    public Users updateUser(UUID id, UserUpdateDTO dto, String updatedByActor) {
        Users user = findActiveUserById(id);

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
        auditLogService.createLog("USER_UPDATED", updatedByActor, "INFO",
                "User profile updated for: " + updatedUser.getEmail());
        return updatedUser;
    }

    // ✅ Updated to use id
    public void deleteUserSoftly(UUID id, String deletedByActor) {
        Users user = findActiveUserById(id);
        user.setStatus(EStatus.DELETED);
        usersRepository.save(user);
        auditLogService.createLog("USER_DELETED_SOFT", deletedByActor, "WARN",
                "User soft-deleted: " + user.getEmail());
    }

    // ✅ Updated to use id
    public Users suspendUser(UUID id, String suspendedByActor) {
        Users user = findActiveUserById(id);
        user.setStatus(EStatus.SUSPENDED);
        Users suspendedUser = usersRepository.save(user);
        auditLogService.createLog("USER_SUSPENDED", suspendedByActor, "WARN",
                "User suspended: " + user.getEmail());
        return suspendedUser;
    }

    // ✅ Updated to use id
    public Users resetPassword(UUID id, String newPassword, String resetByActor) {
        Users user = findActiveUserById(id);
        user.setPassword(newPassword);
        Users updatedUser = usersRepository.save(user);
        auditLogService.createLog("PASSWORD_RESET", resetByActor, "INFO",
                "Password reset for user: " + user.getEmail());
        return updatedUser;
    }

    public Users authenticateUser(String email, String password) {
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid credentials");
        }

        if (user.getStatus() != EStatus.ACTIVE) {
            throw new RuntimeException("Account is inactive or suspended");
        }

        user.setLastLogin(LocalDateTime.now());
        usersRepository.save(user);
        auditLogService.createLog("USER_LOGIN", user.getEmail(), "INFO",
                "User logged in successfully.");
        return user;
    }

    public Optional<Users> findByEmail(String email) {
        return usersRepository.findByEmail(email);
    }
}
