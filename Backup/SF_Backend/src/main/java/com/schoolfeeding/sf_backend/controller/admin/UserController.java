package com.schoolfeeding.sf_backend.controller.admin;

import com.schoolfeeding.sf_backend.domain.entity.Users;
import com.schoolfeeding.sf_backend.service.admin.user.IUsersService;
import com.schoolfeeding.sf_backend.util.audit.EAction;
import com.schoolfeeding.sf_backend.util.audit.EActionStatus;
import com.schoolfeeding.sf_backend.util.audit.EResource;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final IUsersService usersService;

    @GetMapping({"","/all"})
    public ResponseEntity<List<Users>> getAllUsers() {
        try {

            List<Users> usersList = usersService.findUsersByActive(true);
            return ResponseEntity.ok(usersList);

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/register")
    public ResponseEntity<?> register(@RequestBody Users theUser) {
        try {
            if (theUser != null) {
                theUser.setAction(EAction.CREATE);
                theUser.setResource(EResource.ADMIN);
                theUser.setActionStatus(EActionStatus.SUCCESS);
                theUser.setDetails(theUser.getNames() + " Has Create User");
                Users users = usersService.save(theUser);
                return ResponseEntity.ok(users);
            }else {
                return ResponseEntity.badRequest().body("Invalid User Data");
            }
        }catch (Exception ex){
            return ResponseEntity.badRequest().body("Error User Registration: " + ex.getMessage());
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

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUsers(@PathVariable String id) {
        try {
            if (!Objects.isNull(id)) {
                Users theUsers = new Users();
                theUsers.setId(UUID.fromString(id));
                usersService.delete(theUsers);
                return ResponseEntity.ok("Users Deleted Successfully");
            } else {
                return ResponseEntity.badRequest().body("Invalid Users ID");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Users Delete: " + ex.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUsers(@PathVariable String id) {
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
}
