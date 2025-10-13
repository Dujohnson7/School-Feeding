package com.schoolfeeding.sf_backend.domain.repository;

import com.schoolfeeding.sf_backend.domain.entity.Users;
import com.schoolfeeding.sf_backend.util.status.EStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {

    // Filter by not DELETED status for soft delete/suspension management
    Page<Users> findByStatusNot(EStatus status, Pageable pageable);

    // Find by UUID and not DELETED status
    Optional<Users> findByUuidAndStatusNot(UUID uuid, EStatus status);

    // Find by email for authentication
    Optional<Users> findByEmail(String email);

    // Filter, search, and soft delete (e.g., search by names or phone)
    Page<Users> findByStatusNotAndNamesContainingIgnoreCaseOrStatusNotAndPhoneContainingIgnoreCase(
            EStatus status1, String namesSearch,
            EStatus status2, String phoneSearch,
            Pageable pageable);
}