package com.schoolfeeding.sf_backend.controller.admin;

import com.schoolfeeding.sf_backend.domain.entity.Audit;
import com.schoolfeeding.sf_backend.domain.entity.District;
import com.schoolfeeding.sf_backend.domain.entity.Users;
import com.schoolfeeding.sf_backend.repository.admin.IAuditRepository;
import com.schoolfeeding.sf_backend.service.admin.audit.IAuditService;
import com.schoolfeeding.sf_backend.service.admin.district.IDistrictService;
import com.schoolfeeding.sf_backend.service.admin.user.IUsersService;
import com.schoolfeeding.sf_backend.service.gov.school.ISchoolService;
import com.schoolfeeding.sf_backend.service.school.requestItem.IRequestItemService;
import com.schoolfeeding.sf_backend.util.audit.EAction;
import com.schoolfeeding.sf_backend.util.order.ERequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/adminDashboard")
public class AdminDashboardController {

    private final IUsersService usersService;
    private final IDistrictService districtService;
    private final ISchoolService schoolService;
    private final IRequestItemService requestItemService;
    private final IAuditService  auditService;

    @GetMapping("/totalUser")
    public ResponseEntity<Long> getTotalUsers() {
        try {
            long totalUser = usersService.countAllUser(Boolean.TRUE);
            return ResponseEntity.ok(totalUser);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/totalSchool")
    public ResponseEntity<Long> getTotalSchool() {
        try {
            long totalSchool = schoolService.countAllSchools(Boolean.TRUE);
            return ResponseEntity.ok(totalSchool);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/totalDistrict")
    public ResponseEntity<Long> getTotalDistrict() {
        try {
            long totalDistrict = districtService.countDistrictsAndState(Boolean.TRUE);
            return ResponseEntity.ok(totalDistrict);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/totalRequestPending")
    public ResponseEntity<Long> getTotalRequest() {
        try {
            long totalRequest = requestItemService.countAllByRequestStatusAndActive(ERequest.PENDING,Boolean.TRUE);
            return ResponseEntity.ok(totalRequest);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/listTop4Audit")
    public ResponseEntity<List<Audit>> getAllAudit() {
        try {

            List<Audit> auditList = auditService.findTop4ByOrderByTimestampDesc();
            return ResponseEntity.ok(auditList);

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/totalUserLoginThisWeek")
    public ResponseEntity<Long> getTotalUserLoginThisWeek() {
        try {
            LocalDateTime start = getStartOfWeek();
            LocalDateTime end   = getEndOfWeek();   

            long total = auditService.countUserLoginhisWeek(EAction.LOGIN, start, end);
            return ResponseEntity.ok(total);
        } catch(Exception ex){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/countLoginsPerDayOfWeek")
    public ResponseEntity<List<Object[]>> getCountLoginsPerDayOfWeek() {
        try {
            LocalDateTime start = getStartOfWeek();
            LocalDateTime end = getEndOfWeek();

            return ResponseEntity.ok(
                    auditService.countLoginsPerDayOfWeek(EAction.LOGIN, start, end)
            );

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private LocalDateTime getStartOfWeek() {
        return LocalDate.now().with(DayOfWeek.MONDAY).atStartOfDay();
    }

    private LocalDateTime getEndOfWeek() {
        return LocalDate.now().with(DayOfWeek.SUNDAY).atTime(23, 59, 59);
    }



}
