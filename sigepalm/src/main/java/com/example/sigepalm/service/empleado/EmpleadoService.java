package com.example.sigepalm.service.empleado;

import com.example.sigepalm.model.empleado.Empleado;
import com.example.sigepalm.model.empleado.EmpleadoRepository;
import com.example.sigepalm.model.empleado.TipoEmpleado;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmpleadoService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmpleadoRepository empleadoRepository;

    // 🔴 CREAR
    public Empleado registrar(Empleado empleado) {

        empleado.setPassword(
                passwordEncoder.encode(empleado.getPassword())
        );

        return empleadoRepository.save(empleado);
    }

    // 🔴 LISTAR
    public List<Empleado> listar() {
        return empleadoRepository.findAll();
    }

    // 🔴 BUSCAR
    public Empleado buscarPorId(Long id) {
        return empleadoRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Empleado no encontrado"));
    }

    // 🔴 ACTUALIZAR
    public Empleado actualizar(Long id, Empleado datos) {

        Empleado empleado = buscarPorId(id);

        empleado.setNombre(datos.getNombre());
        empleado.setCorreo(datos.getCorreo());

        if (datos.getPassword() != null && !datos.getPassword().isEmpty()) {
            empleado.setPassword(passwordEncoder.encode(datos.getPassword()));
        }

        if (datos.getTipo() != null) {
            empleado.setTipo(
                    TipoEmpleado.valueOf(datos.getTipo().name())
            );
        }

        return empleadoRepository.save(empleado);
    }

    // 🔴 ELIMINAR
    public void eliminar(Long id) {

        Empleado empleado = buscarPorId(id);

        empleadoRepository.delete(empleado);
    }
}