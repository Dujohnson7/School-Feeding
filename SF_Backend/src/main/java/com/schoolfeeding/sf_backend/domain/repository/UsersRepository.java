package com.schoolfeeding.sf_backend.domain.repository;

import com.schoolfeeding.sf_backend.domain.entity.Users;
import com.schoolfeeding.sf_backend.util.status.EStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UsersRepository extends JpaRepository<Users, UUID> { 

    Optional<Users> findByIdAndStatusNot(UUID id, EStatus status); // ✅ fixed

    Optional<Users> findByEmail(String email);

    Page<Users> findByStatusNot(EStatus status, Pageable pageable);

    Page<Users> findByStatusNotAndNamesContainingIgnoreCaseOrStatusNotAndPhoneContainingIgnoreCase(
            EStatus status1, String name,
            EStatus status2, String phone,
            Pageable pageable
    );
}
