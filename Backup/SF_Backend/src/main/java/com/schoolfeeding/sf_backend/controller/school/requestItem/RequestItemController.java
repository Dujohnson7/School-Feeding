package com.schoolfeeding.sf_backend.controller.school.requestItem;

import com.schoolfeeding.sf_backend.domain.entity.RequestItem;
import com.schoolfeeding.sf_backend.service.school.requestItem.IRequestItemService;
import com.schoolfeeding.sf_backend.util.order.ERequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/requestRequestItem")
public class RequestItemController {

    private final IRequestItemService requestItemService;

    @GetMapping({"","/all"})
    public ResponseEntity<List<RequestItem>> getAllRequestItems (){
        try {
            List<RequestItem> requestItemList = requestItemService.findAllRequestItemsByState(Boolean.TRUE);
            return ResponseEntity.ok(requestItemList);

        }catch (Exception ex){
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerRequestItem(@RequestBody RequestItem theRequestItem){
        try {
            if (theRequestItem != null) {
                RequestItem itemSave = requestItemService.saveRequestItem(theRequestItem);
                return ResponseEntity.ok(itemSave);
            }else {
                return ResponseEntity.badRequest().body("Invalid RequestItem Data");
            }
        }catch (Exception ex){
            return ResponseEntity.badRequest().body("Error RequestItem Registration: " + ex.getMessage());
        }
    }



    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateRequestItem(@RequestBody RequestItem theRequestItem, @PathVariable String id) {
        try {
            RequestItem existRequestItem = requestItemService.findByIdAndState(UUID.fromString(id), Boolean.TRUE);
            if (!Objects.isNull(existRequestItem)) {
                theRequestItem.setId(UUID.fromString(id));
                RequestItem updatedRequestItem = requestItemService.updateRequestItem(existRequestItem);
                return ResponseEntity.ok(updatedRequestItem);
            } else {
                return ResponseEntity.badRequest().body("Invalid RequestItem ID");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error RequestItem Update: " + ex.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteRequestItem(@PathVariable String id) {
        try {
            if (!Objects.isNull(id)) {
                RequestItem theRequestItem = new RequestItem();
                theRequestItem.setId(UUID.fromString(id));
                requestItemService.deleteRequestItem(theRequestItem);
                return ResponseEntity.ok("RequestItem Deleted Successfully");
            } else {
                return ResponseEntity.badRequest().body("Invalid RequestItem ID");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error RequestItem Delete: " + ex.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRequestItem(@PathVariable String id) {
        try {
            RequestItem theRequestItem = requestItemService.findByIdAndState(UUID.fromString(id), Boolean.TRUE);
            if (!Objects.isNull(theRequestItem)) {
                return ResponseEntity.ok(theRequestItem);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("RequestItem not found");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error RequestItem: " + ex.getMessage());
        }
    }


    @GetMapping("/districtRequest/{dId}")
    public ResponseEntity<List<RequestItem>> getAllRequestItemsByDistrict(@PathVariable String dId) {
        try {
            List<RequestItem> requestItemList = requestItemService.findAllRequestItemsByDistrictIdAndState(UUID.fromString(dId), Boolean.TRUE);
            if (requestItemList != null && !requestItemList.isEmpty()) {
                return ResponseEntity.ok(requestItemList);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }


    @GetMapping("/schoolRequest/{sId}")
    public ResponseEntity<List<RequestItem>> getAllRequestItemsBySchool(@PathVariable String sId) {
        try {
            List<RequestItem> requestItemList = requestItemService.findAllRequestItemsBySchoolIdAndState(UUID.fromString(sId), Boolean.TRUE);
            if (requestItemList != null && !requestItemList.isEmpty()) {
                return ResponseEntity.ok(requestItemList);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }


    @GetMapping("/districtRequestByRequestStatus")
    public ResponseEntity<List<RequestItem>> getAllRequestItemsByDistrictByERequest(@RequestParam String dId, @RequestParam String requestStatus) {
        try {
            List<RequestItem> requestItemList = requestItemService.findRequestItemsByDistrictIdAndRequestStatusAndState(UUID.fromString(dId), ERequest.valueOf(requestStatus) ,Boolean.TRUE);
            if (requestItemList != null && !requestItemList.isEmpty()) {
                return ResponseEntity.ok(requestItemList);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }


    @GetMapping("/schoolRequestByRequestStatus")
    public ResponseEntity<List<RequestItem>> getAllRequestItemsBySchoolByERequest(  @RequestParam String sId, @RequestParam String requestStatus) {
        try {
            List<RequestItem> requestItemList = requestItemService.findRequestItemsBySchoolIdAndRequestStatusAndState(UUID.fromString(sId), ERequest.valueOf(requestStatus) ,Boolean.TRUE);
            if (requestItemList != null && !requestItemList.isEmpty()) {
                return ResponseEntity.ok(requestItemList);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }


}
