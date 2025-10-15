package com.schoolfeeding.sf_backend.config;

import com.schoolfeeding.sf_backend.domain.entity.Users;
import com.schoolfeeding.sf_backend.domain.service.UsersService;
import com.schoolfeeding.sf_backend.util.status.EStatus;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;


public class UsersServiceUserDetailsService implements UserDetailsService {

    private final UsersService usersService;

    public UsersServiceUserDetailsService(UsersService usersService) {
        this.usersService = usersService;
    }

    @Override
public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    Users user = usersService.findByEmail(email) 
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    if (user.getStatus() == EStatus.DELETED) {
        throw new UsernameNotFoundException("User deleted");
    }

    return User.builder()
            .username(user.getEmail())
            .password(user.getPassword())
            .authorities(user.getRole().name())
            .accountLocked(user.getStatus() == EStatus.SUSPENDED)
            .disabled(user.getStatus() == EStatus.DELETED)
            .build();
}

}
 