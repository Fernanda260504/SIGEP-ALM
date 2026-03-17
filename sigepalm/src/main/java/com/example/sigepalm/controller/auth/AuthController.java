package com.example.sigepalm.controller.auth;

import com.example.sigepalm.model.auth.AuthRequest;
import com.example.sigepalm.model.auth.AuthResponse;
import com.example.sigepalm.model.empleado.Empleado;
import com.example.sigepalm.model.empleado.EmpleadoRepository;
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
                empleado.getNombre()
        );
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody AuthRequest request){

        if(
                empleadoRepository
                        .findByCorreo(request.getCorreo())
                        .isPresent()
        ){
            return ResponseEntity.badRequest()
                    .body("El correo ya está registrado");
        }

        Empleado empleado = new Empleado();

        empleado.setCorreo(request.getCorreo());

        empleado.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        Rol rol = rolRepository
                .findByNombre(request.getRole())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Rol no encontrado"
                        ));

        empleado.setRol(rol);

        empleadoRepository.save(empleado);

        return ResponseEntity.ok(
                "Empleado registrado correctamente"
        );
    }
}