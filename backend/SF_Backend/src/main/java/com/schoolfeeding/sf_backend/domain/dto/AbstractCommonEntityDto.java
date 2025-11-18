package com.schoolfeeding.sf_backend.domain.dto;


import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public abstract  class AbstractCommonEntityDto {

    private UUID id;
    private Boolean active = Boolean.TRUE;
    private String createdBy;
    private LocalDateTime created;
    private String updatedBy;
    private LocalDateTime updated;
    private String token;
    private String message;
}
