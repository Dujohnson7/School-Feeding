package com.schoolfeeding.sf_backend.controller.admin;

import com.schoolfeeding.sf_backend.domain.entity.Users;
import com.schoolfeeding.sf_backend.service.admin.user.IUsersService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final IUsersService usersService;


    @GetMapping("/{id}")
    public ResponseEntity<?> getProfile(@PathVariable String id) {
        try {
            Users theUsers = usersService.findByIdAndActive(UUID.fromString(id));
            if (!Objects.isNull(theUsers)) {
                return ResponseEntity.ok(theUsers);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Users not found");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Users: " + ex.getMessage());
        }
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUsers(@RequestBody Users theUsers, @PathVariable String id) {
        try {
            Users existUsers = usersService.findByIdAndActive(UUID.fromString(id));
            if (!Objects.isNull(existUsers)) {
                theUsers.setId(UUID.fromString(id));
                Users updatedUsers = usersService.update(theUsers);
                return ResponseEntity.ok(updatedUsers);
            } else {
                return ResponseEntity.badRequest().body("Invalid Users ID");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Users Update: " + ex.getMessage());
        }
    }



    @PutMapping("/changePassword/{id}")
    public ResponseEntity<?> changePassword(@RequestBody Users theUsers, @PathVariable String id) {
        try {
            Users checkPassword = usersService.findByIdAndActive(UUID.fromString(id));
            if (!Objects.isNull(checkPassword)) {
                theUsers.setId(UUID.fromString(id));
                Users updatedUsers = usersService.changePassword(theUsers);
                return ResponseEntity.ok(updatedUsers);
            } else {
                return ResponseEntity.badRequest().body("Invalid Users ID");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Users Update: " + ex.getMessage());
        }
    }




    @GetMapping("/checkPassword/{id}/{password}")
    public ResponseEntity<?> checkPassword( @PathVariable String id, @PathVariable String password) {
        try {
            Users checkPassword = usersService.findUserWithPassword(UUID.fromString(id), password);
            if (!Objects.isNull(checkPassword)) {
                return ResponseEntity.ok(checkPassword);
            } else {
                return ResponseEntity.badRequest().body("Password does not match");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Users: " + ex.getMessage());
        }
    }

}
