package com.schoolfeeding.sf_backend.repository.district;

import com.schoolfeeding.sf_backend.domain.entity.Item;
import com.schoolfeeding.sf_backend.domain.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ISupplierRepository extends JpaRepository<Supplier, UUID> {
    Optional<Supplier> findByIdAndActive(UUID id, Boolean active);
    List<Supplier> findAllByActive(Boolean active);
    List<Supplier> findAllByDistrict_IdAndActive(UUID districtId, Boolean active);
    @Query("SELECT i FROM Supplier s JOIN s.items i WHERE s.id = :sId AND s.active = :active")
    List<Item> findSupplierItemByActive(@Param("sId") UUID sId, @Param("active") Boolean active);
    long countSuppliersByDistrictIdAndActive(UUID districtId, Boolean active);

}
