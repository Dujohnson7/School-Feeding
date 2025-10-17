package com.schoolfeeding.sf_backend.repository.admin;

import com.schoolfeeding.sf_backend.domain.entity.Users;
import com.schoolfeeding.sf_backend.util.role.ERole;
import org.springframework.data.domain.Limit;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IUsersRepository extends JpaRepository<Users, UUID> {

    Optional<Users> findUsersByEmailAndActive(String email,Boolean state);
    Optional<Users>  findUsersByIdAndActive(UUID theId, Boolean state);
    List<Users> findAllBySchoolIdAndActive(UUID schoolId, Boolean active);
    List<Users> findAllByDistrictIdAndActive(UUID districtId, Boolean active);
    List<Users> findAllByRoleAndActive(ERole role, Boolean state);
    List<Users> findAllByActive(Boolean state);
}
