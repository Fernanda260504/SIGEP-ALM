package com.example.sigepalm.service.autorizacion;

import com.example.sigepalm.model.autorizacion.Autorizacion;
import com.example.sigepalm.model.autorizacion.AutorizacionRepository;
import com.example.sigepalm.model.empleado.Empleado;
import com.example.sigepalm.model.empleado.EmpleadoRepository;
import com.example.sigepalm.model.permiso.EstadoPermiso;
import com.example.sigepalm.model.permiso.PermisoLaboral;
import com.example.sigepalm.model.permiso.PermisoRepository;
import com.example.sigepalm.service.email.EmailService;
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

    @Autowired
    private EmailService emailService;

    public Autorizacion autorizar(Long permisoId, Autorizacion autorizacion) {

        PermisoLaboral permiso = permisoRepository.findById(permisoId)
                .orElseThrow(() -> new RuntimeException("Permiso no encontrado"));

        Empleado empleado = permiso.getEmpleado();

        if (autorizacion.getDecision() == EstadoPermiso.APROBADO) {

            // 🔎 VALIDAR QUE TENGA DÍAS DISPONIBLES
            if (empleado.getDiasDisponibles() < permiso.getTotalDias()) {
                throw new RuntimeException("El empleado no tiene días suficientes");
            }

            // 🔻 Descontar días
            empleado.setDiasDisponibles(
                    empleado.getDiasDisponibles() - permiso.getTotalDias());

            empleadoRepository.save(empleado);

            permiso.setEstado(EstadoPermiso.APROBADO);

            // 📧 ENVIAR CORREO A RH
            String asunto = "Permiso Aprobado - " + empleado.getNombre();
            String mensaje = """
                    Se ha aprobado un permiso laboral.

                    Empleado: %s
                    Fecha inicio: %s
                    Fecha fin: %s
                    Total días: %d

                    Sistema SIGEPALM
                    """.formatted(
                    empleado.getNombre(),
                    permiso.getFechaInicio(),
                    permiso.getFechaFin(),
                    permiso.getTotalDias()
            );

            emailService.enviarCorreoRH(asunto, mensaje);

        } else {
            permiso.setEstado(EstadoPermiso.RECHAZADO);
        }

        permisoRepository.save(permiso);

        autorizacion.setFechaDecision(LocalDate.now());
        autorizacion.setPermiso(permiso);

        return autorizacionRepository.save(autorizacion);
    }
}
