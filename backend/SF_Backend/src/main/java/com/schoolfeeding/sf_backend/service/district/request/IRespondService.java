package com.schoolfeeding.sf_backend.service.district.request;

import com.schoolfeeding.sf_backend.domain.entity.Orders;
import com.schoolfeeding.sf_backend.util.order.EDelivery;
import com.schoolfeeding.sf_backend.util.order.EOrderPay;

import java.util.List;
import java.util.UUID;

public interface IRespondService {
    Orders findById(UUID id);
    Orders saveOrders(Orders theOrders);
    Orders updateOrders(Orders theOrders);
    Orders deleteOrders(Orders theOrders);
    List<Orders>  findCurrentOrderBySchool(UUID sId);

    Orders recieveOrders(Orders theOrders);

    List<Orders> findAllBySupplierId(UUID supplierId);
    List<Orders> findAllByRequestItemSchool(UUID schoolId);
    List<Orders>  findAllByRequestItemSchoolAndDeliveryStatus(UUID schoolId, EDelivery delivery );


    List<Orders> findAllByRequestItemDistrict(UUID districtId);
    List<Orders> findBySupplierIdAndDeliveryStatus(UUID supplierId, EDelivery deliveryStatus);

    List<Orders> findAllBySupplierIdAndOrderPayState(UUID supplierId, EOrderPay orderPayState);
    List<Orders> findAllBySupplierIdAndDeliveryStatus(UUID supplierId, EDelivery deliveryStatus);

}
