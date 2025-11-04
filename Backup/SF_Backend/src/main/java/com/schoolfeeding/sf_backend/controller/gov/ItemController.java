package com.schoolfeeding.sf_backend.controller.gov;

import com.schoolfeeding.sf_backend.domain.entity.Item;
import com.schoolfeeding.sf_backend.service.gov.item.IItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/item")
public class ItemController {

    private final IItemService itemService;

    @GetMapping({"","/all"})
    public ResponseEntity<List<Item>> getAllItems (){
        try {
            List<Item> itemList = itemService.findAllByActive(Boolean.TRUE);
            return ResponseEntity.ok(itemList);

        }catch (Exception ex){
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerItem(@RequestBody Item theItem){
        try {
            if (theItem != null) {
                Item itemSave = itemService.saveItem(theItem);
                return ResponseEntity.ok(itemSave);
            }else {
                return ResponseEntity.badRequest().body("Invalid Item Data");
            }
        }catch (Exception ex){
            return ResponseEntity.badRequest().body("Error Item Registration: " + ex.getMessage());
        }
    }



    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateItem(@RequestBody Item theItem, @PathVariable String id) {
        try {
            Item existItem = itemService.findByIdAndState(UUID.fromString(id), Boolean.TRUE);
            if (!Objects.isNull(existItem)) {
                theItem.setId(UUID.fromString(id));
                Item updatedItem = itemService.updateItem(existItem);
                return ResponseEntity.ok(updatedItem);
            } else {
                return ResponseEntity.badRequest().body("Invalid Item ID");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Item Update: " + ex.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable String id) {
        try {
            if (!Objects.isNull(id)) {
                Item theItem = new Item();
                theItem.setId(UUID.fromString(id));
                itemService.deleteItem(theItem);
                return ResponseEntity.ok("Item Deleted Successfully");
            } else {
                return ResponseEntity.badRequest().body("Invalid Item ID");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Item Delete: " + ex.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getItem(@PathVariable String id) {
        try {
            Item theItem = itemService.findByIdAndState(UUID.fromString(id), Boolean.TRUE);
            if (!Objects.isNull(theItem)) {
                return ResponseEntity.ok(theItem);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Item not found");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Item: " + ex.getMessage());
        }
    }
}
