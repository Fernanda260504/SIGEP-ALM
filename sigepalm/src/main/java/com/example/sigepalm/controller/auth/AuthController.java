package com.example.sigepalm.controller.auth;

import com.example.sigepalm.model.auth.AuthRequest;
import com.example.sigepalm.model.auth.AuthResponse;
import com.example.sigepalm.model.empleado.Empleado;
import com.example.sigepalm.model.empleado.EmpleadoRepository;
import com.example.sigepalm.model.empleado.TipoEmpleado;
import com.example.sigepalm.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.sigepalm.model.rol.Rol;
import com.example.sigepalm.model.rol.RolRepository;

import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request){

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getCorreo(),
                        request.getPassword()
                )
        );

        Empleado empleado =
                empleadoRepository
                        .findByCorreo(request.getCorreo())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Empleado no encontrado"
                                ));

        String role = empleado.getRol().getNombre();

        String token =
                jwtUtil.generateToken(
                        empleado.getCorreo(),
                        role
                );

        return new AuthResponse(

                token,
                role,
                empleado.getCorreo(),
                empleado.getNombre(),
                empleado.getId()
        );
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request){

        if(empleadoRepository.findByCorreo(request.getCorreo()).isPresent()){
            return ResponseEntity.badRequest()
                    .body("El correo ya está registrado");
        }

        Empleado empleado = new Empleado();

        empleado.setCorreo(request.getCorreo());

        empleado.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        // 🔥 GUARDAR NOMBRE
        empleado.setNombre(request.getNombre());

        // 🔥 12 DÍAS POR DEFAULT
        empleado.setDiasDisponibles(12);

        // 🔥 GUARDAR TIPO (SEGURO)
        empleado.setTipo(
                TipoEmpleado.valueOf(request.getTipo().toUpperCase())
        );

        Rol rol = rolRepository
                .findByNombre(request.getRole())
                .orElseThrow(() ->
                        new RuntimeException("Rol no encontrado")
                );

        empleado.setRol(rol);

        empleadoRepository.save(empleado);

        return ResponseEntity.ok("Empleado registrado correctamente");
    }
    @PutMapping("/empleado/{id}")
    public ResponseEntity<?> updateEmpleado(
            @PathVariable Long id,
            @RequestBody AuthRequest request){

        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        // 🔥 actualizar datos básicos
        empleado.setNombre(request.getNombre());
        empleado.setCorreo(request.getCorreo());

        if(request.getPassword() != null && !request.getPassword().isEmpty()){
            empleado.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        empleado.setTipo(
                TipoEmpleado.valueOf(request.getTipo().toUpperCase())
        );

        empleadoRepository.save(empleado);

        return ResponseEntity.ok("Empleado actualizado correctamente");
    }

    @DeleteMapping("/empleado/{id}")
    public ResponseEntity<?> deleteEmpleado(@PathVariable Long id){

        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        empleadoRepository.delete(empleado);

        return ResponseEntity.ok("Empleado eliminado correctamente");
    }
}