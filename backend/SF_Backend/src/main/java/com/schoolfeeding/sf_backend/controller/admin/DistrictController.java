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

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/district")
public class DistrictController {

    private final IDistrictService districtService;
    @GetMapping({"","/all"})
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
                theDistrict.setId(UUID.fromString(id));
                District district = districtService.updateDistrict(theDistrict);
                return ResponseEntity.ok(district);
            }else  {
                return ResponseEntity.badRequest().body("Invalid district Id");
            }
        }catch (Exception ex){
            return ResponseEntity.badRequest().body("Error " + ex.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
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
    public ResponseEntity<List<EDistrict>> getDistrictsByProvince(@RequestParam EProvince province) {
        try {
            List<EDistrict> filteredDistricts = Arrays.stream(EDistrict.values())
                    .filter(d -> d.getProvince().equals(province))
                    .toList();

            return ResponseEntity.ok(filteredDistricts);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().build();
        }
    }




}
