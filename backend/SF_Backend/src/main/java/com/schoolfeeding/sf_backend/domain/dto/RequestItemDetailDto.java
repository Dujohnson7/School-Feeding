package com.schoolfeeding.sf_backend.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestItemDetailDto  extends AbstractCommonEntityDto {

    private UUID requestItemId;
    private UUID itemId;
    private double quantity;

}
