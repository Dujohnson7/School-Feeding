package com.schoolfeeding.sf_backend.controller.client;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class ClinetController {

    @GetMapping("/")
    public ResponseEntity<?> getIndex(){
        return ResponseEntity.ok("****  SCHOOL FEEDING SYSTEM    ****");
    }
}
