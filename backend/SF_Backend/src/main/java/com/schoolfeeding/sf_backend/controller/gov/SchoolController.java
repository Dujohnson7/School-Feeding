package com.schoolfeeding.sf_backend.controller.gov;

import com.schoolfeeding.sf_backend.domain.dto.SchoolDto;
import com.schoolfeeding.sf_backend.domain.dto.UserDto;
import com.schoolfeeding.sf_backend.domain.entity.District;
import com.schoolfeeding.sf_backend.domain.entity.School;
import com.schoolfeeding.sf_backend.service.admin.district.IDistrictService;
import com.schoolfeeding.sf_backend.service.gov.school.ISchoolService;
import com.schoolfeeding.sf_backend.util.accounting.EBank;
import com.schoolfeeding.sf_backend.util.address.EProvince;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/school")
public class SchoolController {

    private final ISchoolService schoolService;
    private final IDistrictService districtService;

    @GetMapping({"","/all"})
    public ResponseEntity<List<School>> getAllSchools(){
        try {

            List<School> schoolList = schoolService.findAllByState(Boolean.TRUE);
            return ResponseEntity.ok(schoolList);

        }catch (Exception ex){
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerSchool(@Valid @RequestBody SchoolDto schoolDto){

        try {
            if (schoolDto != null) {
                School school = new School();
                school.setName(schoolDto.getName());
                school.setDirectorNames(schoolDto.getDirectorNames());
                school.setEmail(schoolDto.getEmail());
                school.setPhone(schoolDto.getPhone());
                school.setStudent(schoolDto.getStudent());
                school.setDistrict(schoolDto.getDistrict());
                school.setAddress(schoolDto.getAddress());
                school.setBank(schoolDto.getBank());
                school.setBankAccount(schoolDto.getBankAccount());
                school.setStatus(schoolDto.getStatus());
                schoolDto.setMessage("Successfully registered School");
                School savedSchool = schoolService.schoolSave(school);
                return ResponseEntity.ok(savedSchool);
            }else {
                UserDto errorResponse = new UserDto();
                errorResponse.setMessage("Fail registered School");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }catch (Exception ex){
            return ResponseEntity.badRequest().body("Error School Registration: " + ex.getMessage());
        }
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateSchool(@RequestBody School theSchool, @PathVariable String id) {
        try {
            School existSchool = schoolService.findById(UUID.fromString(id));
            if (!Objects.isNull(existSchool)) {
                theSchool.setId(UUID.fromString(id));
                School updatedSchool = schoolService.schoolUpdate(theSchool);
                return ResponseEntity.ok(updatedSchool);
            } else {
                return ResponseEntity.badRequest().body("Invalid School ID");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error School Update: " + ex.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteSchool(@PathVariable String id) {
        try {
            if (!Objects.isNull(id)) {
                School theSchool = new School();
                theSchool.setId(UUID.fromString(id));
                schoolService.schoolDelete(theSchool);
                return ResponseEntity.ok("School Deleted Successfully");
            } else {
                return ResponseEntity.badRequest().body("Invalid School ID");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error School Delete: " + ex.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSchool(@PathVariable String id) {
        try {
            School theSchool = schoolService.findById(UUID.fromString(id));
            if (!Objects.isNull(theSchool)) {
                return ResponseEntity.ok(theSchool);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("School not found");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error School: " + ex.getMessage());
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

}
