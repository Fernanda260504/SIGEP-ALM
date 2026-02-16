package com.example.sigepalm.model.empleado;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
@Repository
public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {

    boolean existsByCorreo(String correo);

}