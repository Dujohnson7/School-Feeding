package com.schoolfeeding.sf_backend.service.district.request;

import com.schoolfeeding.sf_backend.domain.entity.Orders;
import com.schoolfeeding.sf_backend.domain.entity.RequestItemDetail;
import com.schoolfeeding.sf_backend.domain.entity.StockIn;
import com.schoolfeeding.sf_backend.repository.supplier.IOrderRepository;
import com.schoolfeeding.sf_backend.service.stock.stockIn.IStockInService;
import com.schoolfeeding.sf_backend.util.order.EDelivery;
import com.schoolfeeding.sf_backend.util.order.EOrderPay;
import lombok.RequiredArgsConstructor;
import org.hibernate.ObjectNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RespondServiceImpl implements IRespondService {

    private final IOrderRepository  orderRepository;
    private final IStockInService  stockInService;

    @Override
    public Orders findById(UUID id) {
        Orders theOrder = orderRepository.findOrderByIdAndActive(id, Boolean.TRUE)
                .orElseThrow(()-> new RuntimeException("Order Not Found"));
        return theOrder;
    }

    @Override
    public Orders saveOrders(Orders theOrders) {
        return orderRepository.save(theOrders);
    }

    @Override
    public Orders updateOrders(Orders theOrders) {
        Orders found = findById(theOrders.getId());
        if (Objects.nonNull(found)) {
            found.setSupplier(theOrders.getSupplier());
            found.setDeliveryStatus(theOrders.getDeliveryStatus());
            found.setDeliveryDate(theOrders.getDeliveryDate());
            found.setOrderPrice(theOrders.getOrderPrice());
            found.setOrderPayState(theOrders.getOrderPayState());
            found.setRating(theOrders.getRating());
            return orderRepository.save(found);
        }
        throw new ObjectNotFoundException(Orders.class,"Order Not Found");
    }

    @Override
    public Orders deleteOrders(Orders theOrders) {
        Orders found = findById(theOrders.getId());
        if (Objects.nonNull(found)) {
            found.setActive(Boolean.FALSE);
            return orderRepository.save(found);
        }
        throw new ObjectNotFoundException(Orders.class,"Order Not Found");
    }


    @Override
    public List<Orders> findCurrentOrderBySchool(UUID sId) {
        return orderRepository.findCurrentOrderBySchoolAndActive(sId, Boolean.TRUE);
    }

    @Override
    public Orders recieveOrders(Orders theOrders) {
        Orders found = findById(theOrders.getId());
        if (Objects.nonNull(found)) {

            List<RequestItemDetail> details = theOrders.getRequestItem().getRequestItemDetails();
            for (RequestItemDetail detail : details) {
                StockIn theStockIn = new StockIn();
                theStockIn.setOrders(theOrders);
                theStockIn.setItem(detail.getItem());
                theStockIn.setQuantity(detail.getQuantity());
                theStockIn.setSchool(theOrders.getRequestItem().getSchool());
                stockInService.saveStockIn(theStockIn);
            }


            found.setDeliveryStatus(EDelivery.APPROVED);
            found.setDeliveryDate(theOrders.getDeliveryDate());
            return orderRepository.save(found);
        }
        throw new ObjectNotFoundException(Orders.class,"Order Not Found");
    }

    @Override
    public List<Orders> findAllBySupplierId(UUID supplierId) {
        return orderRepository.findAllBySupplierIdAndActive(supplierId, Boolean.TRUE);
    }

    @Override
    public List<Orders> findAllByRequestItemSchool(UUID schoolId) {
        return orderRepository.findAllByRequestItem_School_IdAndActive(schoolId, Boolean.TRUE);
    }

    @Override
    public List<Orders> findAllByRequestItemSchoolAndDeliveryStatus(UUID schoolId, EDelivery delivery) {
        return orderRepository.findAllByRequestItem_School_IdAndDeliveryStatusAndActive(schoolId,EDelivery.DELIVERED, Boolean.TRUE);
    }

    @Override
    public List<Orders> findAllByRequestItemDistrict(UUID districtId) {
        return orderRepository.findAllByRequestItem_District_IdAndActive(districtId, Boolean.TRUE);
    }

    @Override
    public List<Orders> findBySupplierIdAndDeliveryStatus(UUID supplierId, EDelivery deliveryStatus) {
        return orderRepository.findBySupplierIdAndDeliveryStatusAndActive(supplierId, deliveryStatus, Boolean.TRUE);
    }

    @Override
    public List<Orders> findAllBySupplierIdAndOrderPayState(UUID supplierId, EOrderPay orderPayState) {
        return orderRepository.findAllBySupplierIdAndOrderPayStateAndActive(supplierId, orderPayState, Boolean.TRUE);
    }

    @Override
    public List<Orders> findAllBySupplierIdAndDeliveryStatus(UUID supplierId, EDelivery deliveryStatus) {
        return orderRepository.findBySupplierIdAndDeliveryStatusAndActive(supplierId, deliveryStatus, Boolean.TRUE);
    }
}
