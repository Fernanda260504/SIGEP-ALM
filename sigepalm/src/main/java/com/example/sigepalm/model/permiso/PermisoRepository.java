package com.example.sigepalm.model.permiso;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PermisoRepository extends JpaRepository<PermisoLaboral, Long> {
    List<PermisoLaboral> findByEmpleadoId(Long empleadoId);
}
