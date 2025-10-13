package com.schoolfeeding.sf_backend.controller;

import com.schoolfeeding.sf_backend.domain.dto.UserCreationDTO;
import com.schoolfeeding.sf_backend.domain.dto.UserUpdateDTO;
import com.schoolfeeding.sf_backend.domain.entity.Users;
import com.schoolfeeding.sf_backend.domain.service.UsersService;
import com.schoolfeeding.sf_backend.util.role.ERole;
import com.schoolfeeding.sf_backend.util.status.EStatus;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UsersService usersService;

    // A placeholder for the actor (the user performing the action)
    private static final String SYSTEM_ACTOR = "ADMIN_CONSOLE";

    public UserController(UsersService usersService) {
        this.usersService = usersService;
    }

    // POST /api/users (Add New Users)
    @PostMapping
    public ResponseEntity<Users> createUser(@Valid @RequestBody UserCreationDTO dto) {
        Users user = usersService.createUser(dto, SYSTEM_ACTOR);
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    // GET /api/users (List User, search/filter)
    @GetMapping
    public ResponseEntity<Page<Users>> listUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ERole role,
            @RequestParam(required = false) EStatus status,
            Pageable pageable) {

        Page<Users> users = usersService.listUsers(search, role, status, pageable);
        return ResponseEntity.ok(users);
    }

    // PUT /api/users/{uuid} (Update User)
    @PutMapping("/{uuid}")
    public ResponseEntity<Users> updateUser(@PathVariable UUID uuid, @Valid @RequestBody UserUpdateDTO dto) {
        Users updatedUser = usersService.updateUser(uuid, dto, SYSTEM_ACTOR);
        return ResponseEntity.ok(updatedUser);
    }

    // DELETE /api/users/{uuid} (Soft Delete/Change Status)
    @DeleteMapping("/{uuid}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUserSoftly(@PathVariable UUID uuid) {
        usersService.deleteUserSoftly(uuid, SYSTEM_ACTOR);
    }

    // POST /api/users/{uuid}/suspend (Suspend User)
    @PostMapping("/{uuid}/suspend")
    public ResponseEntity<Users> suspendUser(@PathVariable UUID uuid) {
        Users suspendedUser = usersService.suspendUser(uuid, SYSTEM_ACTOR);
        return ResponseEntity.ok(suspendedUser);
    }

    // POST /api/users/{uuid}/reset-password (Reset Password)
    @PostMapping("/{uuid}/reset-password")
    public ResponseEntity<Users> resetPassword(@PathVariable UUID uuid, @RequestBody String newPassword) {
        Users updatedUser = usersService.resetPassword(uuid, newPassword, SYSTEM_ACTOR);
        // Note: For security, only return a success message in a real application, not the updated user.
        return ResponseEntity.ok(updatedUser);
    }
}