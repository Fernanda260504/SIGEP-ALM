package com.example.sigepalm.service.empleado;

import com.example.sigepalm.model.empleado.Empleado;
import com.example.sigepalm.model.empleado.EmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmpleadoService {
    @Autowired
    private EmpleadoRepository empleadoRepository;

    public Empleado registrar(Empleado empleado) {
        return empleadoRepository.save(empleado);
    }

    public List<Empleado> listar() {
        return empleadoRepository.findAll();
    }
}
