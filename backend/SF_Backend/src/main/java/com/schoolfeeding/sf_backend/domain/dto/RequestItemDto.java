package com.schoolfeeding.sf_backend.domain.dto;

import com.schoolfeeding.sf_backend.domain.entity.*;
import com.schoolfeeding.sf_backend.util.order.ERequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestItemDto  extends AbstractCommonEntityDto {

    private District district;

    private School school;

    private List<RequestItemDetail> requestItemDetails;

    private String description;

    private ERequest requestStatus;


    private RequestItem requestItem;

    private Item item;

    private double quantity;

}
