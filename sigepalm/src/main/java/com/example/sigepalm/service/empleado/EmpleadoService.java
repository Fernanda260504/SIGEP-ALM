package com.example.sigepalm.service.empleado;

import com.example.sigepalm.model.empleado.Empleado;
import com.example.sigepalm.model.empleado.EmpleadoRepository;
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

    public Empleado registrar(Empleado empleado) {

        // Encriptar contraseña
        empleado.setPassword(
                passwordEncoder.encode(empleado.getPassword())
        );

        return empleadoRepository.save(empleado);
    }

    public List<Empleado> listar() {
        return empleadoRepository.findAll();
    }

    public Empleado buscarPorId(Long id) {
        return empleadoRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Empleado no encontrado"));
    }
}