package com.example.sigepalm.controller.permiso;

import com.example.sigepalm.config.ApiResponse;
import com.example.sigepalm.model.permiso.PermisoLaboral;
import com.example.sigepalm.service.permiso.PermisoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/api/permisos")
public class PermisoController {

    @Autowired
    private PermisoService permisoService;

    // 🔹 Solicitar permiso
    @PostMapping
    public ResponseEntity<ApiResponse<PermisoLaboral>> solicitar(
            @RequestBody PermisoLaboral permiso) {

        PermisoLaboral nuevo = permisoService.solicitar(permiso);

        return new ResponseEntity<>(
                ApiResponse.success(
                        "Permiso solicitado correctamente",
                        nuevo,
                        HttpStatus.CREATED
                ),
                HttpStatus.CREATED
        );
    }

    // 🔹 Consultar todos los permisos
    @GetMapping
    public ResponseEntity<ApiResponse<List<PermisoLaboral>>> listarTodos() {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Lista de todos los permisos",
                        permisoService.listarTodos(),
                        HttpStatus.OK
                )
        );
    }

    // 🔹 Consultar permisos por empleado
    @GetMapping("/empleado/{id}")
    public ResponseEntity<ApiResponse<List<PermisoLaboral>>> porEmpleado(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Permisos del empleado",
                        permisoService.permisosPorEmpleado(id),
                        HttpStatus.OK
                )
        );
    }
}
