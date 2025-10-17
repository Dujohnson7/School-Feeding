package com.schoolfeeding.sf_backend.service.admin.user;

import com.schoolfeeding.sf_backend.domain.entity.Users;
import com.schoolfeeding.sf_backend.util.role.ERole;

import java.util.List;
import java.util.UUID;

public interface IUsersService {
    Users save(Users theUser);
    Users update(Users theUser);
    Users delete(Users theUser);
    Users findByIdAndActive(UUID theId);
    Users findUserByEmailAndActive(String email, Boolean state);
    List<Users> findAllByDistrictId(UUID districtId);
    List<Users> findUsersBySchoolId(UUID schoolId);
    List<Users> findUsersByRole(ERole role);
    List<Users> findUsersByActive(Boolean state);

}
