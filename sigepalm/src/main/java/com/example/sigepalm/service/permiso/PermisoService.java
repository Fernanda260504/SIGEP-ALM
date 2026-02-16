package com.example.sigepalm.service.permiso;

import com.example.sigepalm.model.empleado.EmpleadoRepository;
import com.example.sigepalm.model.permiso.EstadoPermiso;
import com.example.sigepalm.model.permiso.PermisoLaboral;
import com.example.sigepalm.model.permiso.PermisoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class PermisoService {
    @Autowired
    private PermisoRepository permisoRepository;

    @Autowired
    private EmpleadoRepository empleadoRepository;

    public PermisoLaboral solicitar(PermisoLaboral permiso) {

        int dias = (int) ChronoUnit.DAYS.between(
                permiso.getFechaInicio(),
                permiso.getFechaFin()) + 1;

        permiso.setTotalDias(dias);
        permiso.setEstado(EstadoPermiso.PENDIENTE);
        permiso.setFechaSolicitud(LocalDate.now());

        return permisoRepository.save(permiso);
    }

    public List<PermisoLaboral> permisosPorEmpleado(Long idEmpleado) {
        return permisoRepository.findByEmpleadoId(idEmpleado);
    }

    public List<PermisoLaboral> listarTodos() {
        return permisoRepository.findAll();
    }

}
