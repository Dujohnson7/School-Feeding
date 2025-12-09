package com.schoolfeeding.sf_backend.repository.supplier;

import com.schoolfeeding.sf_backend.domain.entity.Orders;
import com.schoolfeeding.sf_backend.util.order.EDelivery;
import com.schoolfeeding.sf_backend.util.order.EOrderPay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IOrderRepository extends JpaRepository<Orders, UUID> {
    List<Orders> findAllByActive(Boolean active);


    Optional<Orders> findOrderByIdAndActive(UUID id, Boolean active);
    @Query("SELECT o FROM Orders o WHERE o.requestItem.school.id = :sId AND o.active = :active AND o.deliveryStatus != 'DELIVERED' ORDER BY o.id DESC")
    List<Orders> findCurrentOrderBySchoolAndActive(@Param("sId") UUID sId, @Param("active") Boolean active);

    List<Orders> findAllBySupplierIdAndActive(UUID supplierId, Boolean active);
    List<Orders> findBySupplierIdAndDeliveryStatusAndActive(UUID supplierId, EDelivery deliveryStatus, Boolean active);
    List<Orders> findAllBySupplierIdAndOrderPayStateAndActive(UUID supplierId, EOrderPay orderPayState, Boolean active);

    List<Orders>  findAllByRequestItem_District_IdAndActive(UUID districtId, Boolean active);
    List<Orders>  findAllByRequestItem_School_IdAndActive(UUID schoolId, Boolean active);
    List<Orders>  findAllByRequestItem_School_IdAndDeliveryStatusAndActive(UUID schoolId, EDelivery delivery, Boolean active);
    long countOrdersByRequestItem_DistrictIdAndDeliveryStatusAndActive(UUID requestItemDistrictId, EDelivery deliveryStatus, Boolean active);


}
