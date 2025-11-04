package com.schoolfeeding.sf_backend.controller.admin;

import com.schoolfeeding.sf_backend.domain.entity.District;
import com.schoolfeeding.sf_backend.service.admin.district.IDistrictService;
import com.schoolfeeding.sf_backend.util.address.EDistrict;
import com.schoolfeeding.sf_backend.util.address.EProvince;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/district")
public class DistrictController {

    private final IDistrictService districtService;
    @GetMapping({"","/"})
    public ResponseEntity<List<District>> getAllDistricts() {
        try {
            List<District> districtList = districtService.findAllDistrictsAndState(Boolean.TRUE);
            return ResponseEntity.ok(districtList);
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PostMapping("/register")
    public ResponseEntity<?> registerDistrict(@RequestBody District theDistrict) {
        try {
            if (theDistrict != null) {
                District district =  districtService.saveDistrict(theDistrict);
                return ResponseEntity.ok(district);
            }else {
                return ResponseEntity.badRequest().body("Invalid district data");
            }
        } catch (Exception ex) {
            return  ResponseEntity.badRequest().body("Error " + ex.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateDistrict(@RequestBody District theDistrict, @PathVariable String id) {
        try {
            District existDistrict = districtService.findDistrictByIdAndState(UUID.fromString(id), Boolean.TRUE);
            if (existDistrict != null) {
                existDistrict.setId(UUID.fromString(id));
                District district = districtService.updateDistrict(existDistrict);
                return ResponseEntity.ok(district);
            }else  {
                return ResponseEntity.badRequest().body("Invalid district Id");
            }
        }catch (Exception ex){
            return ResponseEntity.badRequest().body("Error " + ex.getMessage());
        }
    }

    @DeleteMapping("/delet/{id}")
    public ResponseEntity<?> deleteDistrict(@PathVariable String id) {
        try {
            if (!Objects.isNull(id)) {
                District district = new District();
                district.setId(UUID.fromString(id));
                districtService.deleteDistrict(district);
                return ResponseEntity.ok().body("Delete Success");
            }else {
                return ResponseEntity.badRequest().body("Invalid district Id");
            }
        }catch (Exception ex){
            return ResponseEntity.badRequest().body("Error " + ex.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDistrictById(@PathVariable String id) {
        try {
            District theDistrict = districtService.findDistrictByIdAndState(UUID.fromString(id), Boolean.TRUE);
            if (theDistrict != null) {
                return ResponseEntity.ok(theDistrict);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error: "+ ex.getMessage());
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


}
