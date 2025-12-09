package com.schoolfeeding.sf_backend.controller.district;

import com.schoolfeeding.sf_backend.service.admin.district.IDistrictService;
import com.schoolfeeding.sf_backend.service.district.request.IRespondService;
import com.schoolfeeding.sf_backend.service.district.supplier.ISupplierService;
import com.schoolfeeding.sf_backend.service.gov.budget.IBudgetGovService;
import com.schoolfeeding.sf_backend.service.gov.school.ISchoolService;
import com.schoolfeeding.sf_backend.service.school.requestItem.IRequestItemService;
import com.schoolfeeding.sf_backend.util.order.EDelivery;
import com.schoolfeeding.sf_backend.util.order.ERequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/districtDashboard")
public class DistrictDashboardController {

    private final ISchoolService schoolService;
    private final IRequestItemService  requestItemService;
    private final ISupplierService  supplierService;
    private final IRespondService orderService;

    @GetMapping("/totalSchool/{dId}")
    public ResponseEntity<Long> getTotalSchoolDistrict(@PathVariable String dId) {
        try {
            long totalSchool = schoolService.countSchoolByDistricts(UUID.fromString(dId));
            return ResponseEntity.ok(totalSchool);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/totalRequest/{dId}")
    public ResponseEntity<Long> getTotalRequestDistrict(@PathVariable String dId) {
        try {
            long totalRequest = requestItemService.countAllRequestItemsByDistrictAndRequestStatus(UUID.fromString(dId), ERequest.PENDING);
            return ResponseEntity.ok(totalRequest);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/totalSupplier/{dId}")
    public ResponseEntity<Long> getTotalDistrictSupplier(@PathVariable String dId) {
        try {
            long totalSupplier = supplierService.countSuppliersByDistrict(UUID.fromString(dId));
            return ResponseEntity.ok(totalSupplier);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/totalFoodDistributed/{dId}")
    public ResponseEntity<Long> getTotalFoodDistributed(@PathVariable String dId) {
        try {
            long totalDistributed = orderService.countOrdersByDistrictIdAndDeliveryStatusAndActive(UUID.fromString(dId), EDelivery.DELIVERED);
            return ResponseEntity.ok(totalDistributed);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
