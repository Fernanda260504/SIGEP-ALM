package com.example.sigepalm.controller.autorizacion;

import com.example.sigepalm.config.ApiResponse;
import com.example.sigepalm.model.autorizacion.Autorizacion;
import com.example.sigepalm.service.autorizacion.AutorizacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/api/autorizaciones")
public class AutorizacionController {

    @Autowired
    private AutorizacionService autorizacionService;

    @PostMapping("/{permisoId}")
    public ApiResponse<Autorizacion> decidir(
            @PathVariable Long permisoId,
            @RequestBody Autorizacion autorizacion) {

        Autorizacion resultado =
                autorizacionService.autorizar(permisoId, autorizacion);

        return ApiResponse.success(
                "Permiso evaluado",
                resultado,
                HttpStatus.CREATED
        );
    }

}
