package com.schoolfeeding.sf_backend.controller.admin;

import com.schoolfeeding.sf_backend.domain.entity.*;
import com.schoolfeeding.sf_backend.service.admin.district.IDistrictService;
import com.schoolfeeding.sf_backend.service.admin.user.IUsersService;
import com.schoolfeeding.sf_backend.service.gov.item.IItemService;
import com.schoolfeeding.sf_backend.service.gov.school.ISchoolService;
import com.schoolfeeding.sf_backend.util.accounting.EBank;
import com.schoolfeeding.sf_backend.util.address.EDistrict;
import com.schoolfeeding.sf_backend.util.address.EProvince;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final IUsersService usersService;
    private final ISchoolService schoolService;
    private final IDistrictService districtService;
    private final IItemService itemService;
    
    @GetMapping({"","/all"})
    public ResponseEntity<List<Users>> getAllUsers() {
        try {

            List<Users> usersList = usersService.findUsersByState(Boolean.TRUE);
            return ResponseEntity.ok(usersList);

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Users theUser) {
        try {
            if (theUser != null) {
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


    @PutMapping("/suspend/{id}")
    public ResponseEntity<?> suspendUsers(@PathVariable String id) {
        try {
            if (!Objects.isNull(id)) {
                Users theUsers = new Users();
                theUsers.setId(UUID.fromString(id));
                usersService.suspend(theUsers);
                return ResponseEntity.ok("Users Suspend Successfully");
            } else {
                return ResponseEntity.badRequest().body("Invalid Users ID");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Users Suspend: " + ex.getMessage());
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

    @GetMapping("/province")
    @ResponseBody
    public ResponseEntity<List<EProvince>> getProvince() {
        try {
            List<EProvince> provinceList = Arrays.asList(EProvince.values());
            return ResponseEntity.ok(provinceList);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().build();
        }
    }



    @GetMapping("/districts-by-province")
    @ResponseBody
    public ResponseEntity<List<District>> getDistrictsByProvince(@RequestParam EProvince province) {
        try {
            List<District> districts = districtService.findDistrictsByProvinceAndState(province, Boolean.TRUE);
            return ResponseEntity.ok(districts);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().build();
        }
    }


    @GetMapping("/schoolByDistrict")
    @ResponseBody
    public ResponseEntity<List<School>> getAllSchoolsByDistrict(@RequestParam EDistrict district){
        try {
            List<School> schoolList = schoolService.findAllByDistrict(district);
            if (schoolList != null && !schoolList.isEmpty()) {
                return ResponseEntity.ok(schoolList);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }



    @GetMapping("/bankName")
    @ResponseBody
    public ResponseEntity<List<EBank>> getAllBanks() {
        try {
            List<EBank> bankList = Arrays.asList(EBank.values());
            return ResponseEntity.ok(bankList);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().build();
        }
    }



    @GetMapping("itemSupplier")
    public ResponseEntity<List<Item>> getAllItems (){
        try {
            List<Item> itemList = itemService.findAllByActive(Boolean.TRUE);
            return ResponseEntity.ok(itemList);

        }catch (Exception ex){
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
