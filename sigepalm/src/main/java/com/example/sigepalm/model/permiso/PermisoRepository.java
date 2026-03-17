package com.example.sigepalm.model.permiso;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PermisoRepository extends JpaRepository<PermisoLaboral, Long> {

    // permisos por empleado
    List<PermisoLaboral> findByEmpleadoId(Long empleadoId);

    // conteo por estado
    long countByEstado(EstadoPermiso estado);


    // solicitudes por mes
    @Query("""
        SELECT MONTH(p.fechaInicio), COUNT(p)
        FROM PermisoLaboral p
        GROUP BY MONTH(p.fechaInicio)
        ORDER BY MONTH(p.fechaInicio)
    """)
    List<Object[]> countPermisosPorMes();


    // aprobadas por mes
    @Query("""
        SELECT MONTH(p.fechaInicio), COUNT(p)
        FROM PermisoLaboral p
        WHERE p.estado = 'APROBADO'
        GROUP BY MONTH(p.fechaInicio)
        ORDER BY MONTH(p.fechaInicio)
    """)
    List<Object[]> countAprobadasPorMes();


    // rechazadas por mes
    @Query("""
        SELECT MONTH(p.fechaInicio), COUNT(p)
        FROM PermisoLaboral p
        WHERE p.estado = 'RECHAZADO'
        GROUP BY MONTH(p.fechaInicio)
        ORDER BY MONTH(p.fechaInicio)
    """)
    List<Object[]> countRechazadasPorMes();


    // motivos más usados
    @Query("""
        SELECT p.motivo, COUNT(p)
        FROM PermisoLaboral p
        GROUP BY p.motivo
        ORDER BY COUNT(p) DESC
    """)
    List<Object[]> motivosMasUsados();
}