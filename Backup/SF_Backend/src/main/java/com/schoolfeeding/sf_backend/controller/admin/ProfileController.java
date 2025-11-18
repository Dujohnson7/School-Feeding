package com.schoolfeeding.sf_backend.controller.admin;

import com.schoolfeeding.sf_backend.domain.entity.Users;
import com.schoolfeeding.sf_backend.service.admin.user.IUsersService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
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


    @PutMapping(value = "/update/{id}", consumes = "multipart/form-data")
    public ResponseEntity<?> updateUsers(
            @PathVariable String id,
            @RequestParam("names") String names,
            @RequestParam("phone") String phone,
            @RequestParam("email") String email,
            @RequestParam(value = "userProfile", required = false) MultipartFile userProfile) {

        try {
            Users existUsers = usersService.findByIdAndActive(UUID.fromString(id));

            if (existUsers != null) {

                existUsers.setNames(names);
                existUsers.setPhone(phone);
                existUsers.setEmail(email);

                String uploadDir = System.getProperty("user.dir") + "/uploads/";
                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                if (userProfile != null && !userProfile.isEmpty()) {
                    String fileName = UUID.randomUUID() + "_" + userProfile.getOriginalFilename();
                    userProfile.transferTo(new File(uploadDir + fileName));
                    existUsers.setProfile(fileName);
                }

                Users updatedUsers = usersService.update(existUsers);
                return ResponseEntity.ok(updatedUsers);

            } else {
                return ResponseEntity.badRequest().body("Invalid User ID");
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


    @PostMapping("/checkPassword")
    public ResponseEntity<?> checkPassword(
            @RequestParam String id,
            @RequestParam String password) {
        try {
            Users user = usersService.findUserWithPassword(UUID.fromString(id), password);

            if (user != null) {
                return ResponseEntity.ok("Password is correct");
            } else {
                return ResponseEntity.badRequest().body("Password does not match");
            }

        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error: " + ex.getMessage());
        }
    }

}
