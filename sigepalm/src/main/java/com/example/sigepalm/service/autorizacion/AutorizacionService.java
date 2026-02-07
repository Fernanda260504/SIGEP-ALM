package com.example.sigepalm.service.autorizacion;

import com.example.sigepalm.model.autorizacion.Autorizacion;
import com.example.sigepalm.model.autorizacion.AutorizacionRepository;
import com.example.sigepalm.model.empleado.Empleado;
import com.example.sigepalm.model.empleado.EmpleadoRepository;
import com.example.sigepalm.model.permiso.EstadoPermiso;
import com.example.sigepalm.model.permiso.PermisoLaboral;
import com.example.sigepalm.model.permiso.PermisoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class AutorizacionService {
    @Autowired
    private AutorizacionRepository autorizacionRepository;

    @Autowired
    private PermisoRepository permisoRepository;

    @Autowired
    private EmpleadoRepository empleadoRepository;

    public Autorizacion autorizar(Long permisoId, Autorizacion autorizacion) {

        PermisoLaboral permiso = permisoRepository.findById(permisoId)
                .orElseThrow();

        Empleado empleado = permiso.getEmpleado();

        if (autorizacion.getDecision() == EstadoPermiso.APROBADO) {
            empleado.setDiasDisponibles(
                    empleado.getDiasDisponibles() - permiso.getTotalDias());
            empleadoRepository.save(empleado);
            permiso.setEstado(EstadoPermiso.APROBADO);
        } else {
            permiso.setEstado(EstadoPermiso.RECHAZADO);
        }

        permisoRepository.save(permiso);

        autorizacion.setFechaDecision(LocalDate.now());
        autorizacion.setPermiso(permiso);

        return autorizacionRepository.save(autorizacion);
    }
}
