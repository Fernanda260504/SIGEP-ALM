package com.example.sigepalm.controller.empleado;

import com.example.sigepalm.config.ApiResponse;
import com.example.sigepalm.model.empleado.Empleado;
import com.example.sigepalm.service.empleado.EmpleadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/api/empleados")
public class EmpleadoController {

    @Autowired
    private EmpleadoService empleadoService;

    @PostMapping
    public ResponseEntity<ApiResponse<Empleado>> crear(@RequestBody Empleado empleado) {
        Empleado nuevo = empleadoService.registrar(empleado);

        return new ResponseEntity<>(
                ApiResponse.success(
                        "Empleado registrado correctamente",
                        nuevo,
                        HttpStatus.CREATED
                ),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Empleado>>> listar() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Lista de empleados",
                        empleadoService.listar(),
                        HttpStatus.OK
                )
        );
    }
}
