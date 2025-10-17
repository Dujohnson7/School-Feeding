package com.schoolfeeding.sf_backend.service.admin.user;

import com.schoolfeeding.sf_backend.domain.entity.Users;
import com.schoolfeeding.sf_backend.repository.admin.IUsersRepository;
import com.schoolfeeding.sf_backend.util.audit.EAction;
import com.schoolfeeding.sf_backend.util.role.ERole;
import lombok.RequiredArgsConstructor;
import org.hibernate.ObjectNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUsersService {
    private  final IUsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Users save(Users theUser) {
        theUser.setPassword(passwordEncoder.encode(theUser.getPassword()));
        return usersRepository.save(theUser);
    }

    @Override
    public Users update(Users theUser) {
        Users foundUser = findByIdAndActive(theUser.getId());
        if (Objects.nonNull(foundUser)) {
            foundUser.setNames(theUser.getNames());
            foundUser.setRole(theUser.getRole());
            foundUser.setActive(theUser.getActive());
            foundUser.setEmail(theUser.getEmail());
            foundUser.setPhone(theUser.getPhone());
            foundUser.setProfile(theUser.getProfile());
            foundUser.setActionStatus(theUser.getActionStatus());
            foundUser.setAction(EAction.UPDATE);
            foundUser.setDetails(theUser.getDetails());

            if (theUser.getPassword() != null &&  !theUser.getPassword().isEmpty()) {
                foundUser.setPassword(passwordEncoder.encode(theUser.getPassword()));
            }

            if (theUser.getDistrict() != null)  {
                foundUser.setDistrict(theUser.getDistrict());
            }

            if (theUser.getSchool() != null && !theUser.getSchool().getId().equals(theUser.getSchool().getId()))  {
                foundUser.setSchool(theUser.getSchool());
            }

             return usersRepository.save(foundUser);
        }
        throw new ObjectNotFoundException(Users.class, "USER NOT FOUND");
    }

    @Override
    public Users delete(Users theUser) {
        return null;
    }

    @Override
    public Users findByIdAndActive(UUID theId) {
        Users  theUser = usersRepository.findUsersByIdAndActive(theId, Boolean.TRUE).orElseThrow(
                () -> new ObjectNotFoundException(Users.class, "USER NOT FOUND")
        );
        return theUser;
    }

    @Override
    public Users findUserByEmailAndActive(String email, Boolean state) {
        Users  theUser = usersRepository.findUsersByEmailAndActive(email, Boolean.TRUE).orElseThrow(
                () -> new ObjectNotFoundException(Users.class, "USER NOT FOUND")
        );
        return theUser;
    }


    @Override
    public List<Users> findAllByDistrictId(UUID districtId) {
        return usersRepository.findAllByDistrictIdAndActive(districtId, Boolean.TRUE);
    }

    @Override
    public List<Users> findUsersBySchoolId(UUID schoolId) {
        return usersRepository.findAllBySchoolIdAndActive(schoolId, Boolean.TRUE);
    }

    @Override
    public List<Users> findUsersByRole(ERole role) {
        return usersRepository.findAllByRoleAndActive(role, Boolean.TRUE);
    }

    @Override
    public List<Users> findUsersByActive(Boolean state) {
        return usersRepository.findAllByActive(Boolean.TRUE);
    }
}
