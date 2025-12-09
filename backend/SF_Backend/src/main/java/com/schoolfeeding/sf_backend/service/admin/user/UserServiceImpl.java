package com.schoolfeeding.sf_backend.service.admin.user;

import com.schoolfeeding.sf_backend.domain.entity.Users;
import com.schoolfeeding.sf_backend.repository.admin.IUsersRepository;
import com.schoolfeeding.sf_backend.util.audit.Auditable;
import com.schoolfeeding.sf_backend.util.audit.EAction;
import com.schoolfeeding.sf_backend.util.audit.EResource;
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

    private final IUsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;


    @Override
    @Auditable(action = EAction.CREATE, resource = EResource.ADMIN)
    public Users save(Users theUser) {
        theUser.setPassword(passwordEncoder.encode(theUser.getPassword()));
        theUser.setProfile("userIcon.png");
        return usersRepository.save(theUser);
    }

    @Override
    @Auditable(action = EAction.UPDATE, resource = EResource.ADMIN)
    public Users update(Users theUser) {

        Users foundUser = findByIdAndActive(theUser.getId());
        if (Objects.nonNull(foundUser)) {
            foundUser.setNames(theUser.getNames());
            foundUser.setRole(theUser.getRole());
            foundUser.setActive(theUser.getActive());
            foundUser.setEmail(theUser.getEmail());
            foundUser.setPhone(theUser.getPhone());
            foundUser.setProfile(theUser.getProfile());

            if (theUser.getPassword() != null &&  !theUser.getPassword().isEmpty()) {
                foundUser.setPassword(passwordEncoder.encode(theUser.getPassword()));
            }

            if (theUser.getDistrict() != null)  {
                foundUser.setDistrict(theUser.getDistrict());
            }

            if (theUser.getSchool() != null && (foundUser.getSchool() == null || !theUser.getSchool().getId().equals(foundUser.getSchool().getId()))) {
                foundUser.setSchool(theUser.getSchool());
            }

            if (theUser.getProfile() != null)  {
                foundUser.setProfile(theUser.getProfile());
            }

            return usersRepository.save(foundUser);
        }
        throw new ObjectNotFoundException(Users.class, "USER NOT FOUND");
    }


    @Override
    @Auditable(action = EAction.DELETE, resource = EResource.ADMIN)
    public Users delete(Users theUser) {
        Users foundUser = findByIdAndActive(theUser.getId());
        if (Objects.nonNull(foundUser)) {
            foundUser.setActive(Boolean.FALSE);
            return usersRepository.save(foundUser);
        }
        throw new ObjectNotFoundException(Users.class, "USER NOT FOUND");
    }

    @Override
    public Users suspend(Users theUser) {
        Users foundUser = findByIdAndActive(theUser.getId());
        if (Objects.nonNull(foundUser)) {
            foundUser.setUserStatus(Boolean.FALSE);
            return usersRepository.save(foundUser);
        }
        throw new ObjectNotFoundException(Users.class, "USER NOT FOUND");
    }

    @Override
    public Users findByIdAndActive(UUID theId) {
        Users  theUser = usersRepository.findUsersByIdAndActive(theId, Boolean.TRUE).orElseThrow(
                () -> new ObjectNotFoundException(Users.class, "USER NOT FOUND")
        );
        return theUser;
    }


    @Override
    public Users findUserWithPassword(UUID theId, String thePassword) {
        Users user = findByIdAndActive(theId);

        if (user != null && passwordEncoder.matches(thePassword, user.getPassword())) {
            return user;
        }

        return null;
    }


    @Override
    public Users changePassword(Users theUsers) {

        Users foundUser = findByIdAndActive(theUsers.getId());
        if (Objects.nonNull(foundUser)) {
            foundUser.setPassword(passwordEncoder.encode(theUsers.getPassword()));
            return usersRepository.save(foundUser);
        }
        throw new ObjectNotFoundException(Users.class, "USER NOT FOUND");
    }


    @Override
    public Users findUserByEmailAndActive(String email, Boolean state) {
        Users  theUser = usersRepository.findUsersByEmailAndActiveAndUserStatus(email, Boolean.TRUE, Boolean.TRUE).orElseThrow(
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
    @Auditable(action = EAction.FETCH, resource = EResource.ADMIN)
    public List<Users> findUsersByState(Boolean state) {
        return usersRepository.findAllByActive(Boolean.TRUE);
    }

    @Override
    public List<Users> findUsersBySchoolAndRoleAndState(UUID schoolId, ERole role, Boolean state) {
        return usersRepository.findUsersBySchool_IdAndRoleAndActive(schoolId, role, Boolean.TRUE);
    }

    @Override
    public long countAllUser(Boolean active) {
        return usersRepository.countUsersByActive(active);
    }
}
