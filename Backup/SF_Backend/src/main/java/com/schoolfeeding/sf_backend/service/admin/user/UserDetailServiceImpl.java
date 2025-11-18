package com.schoolfeeding.sf_backend.service.admin.user;

import com.schoolfeeding.sf_backend.domain.entity.Users;
import com.schoolfeeding.sf_backend.repository.admin.IUsersRepository;
import com.schoolfeeding.sf_backend.util.audit.Auditable;
import com.schoolfeeding.sf_backend.util.audit.EAction;
import com.schoolfeeding.sf_backend.util.audit.EResource;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserDetailServiceImpl implements UserDetailsService {

    private final IUsersRepository usersRepository;

    @Override
    @Auditable(action = EAction.LOGIN, resource = EResource.SYSTEM)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Users user = usersRepository.findUsersByEmailAndActiveAndUserStatus(email, Boolean.TRUE, Boolean.TRUE)
                .orElseThrow(() -> new UsernameNotFoundException("USER NOT FOUND " + email));

        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());

        return new UserDetailsImpl(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(authority),
                user.getId()
        );
    }
}
