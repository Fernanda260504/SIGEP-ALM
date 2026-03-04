package com.example.sigepalm.security;

import com.example.sigepalm.model.empleado.Empleado;
import com.example.sigepalm.model.empleado.EmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Override
    public UserDetails loadUserByUsername(String correo)
            throws UsernameNotFoundException {

        Empleado empleado = empleadoRepository
                .findByCorreo(correo)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Empleado no encontrado"));

        return new User(
                empleado.getCorreo(),
                empleado.getPassword(),
                Collections.singleton(
                        new SimpleGrantedAuthority(
                                empleado.getRol().getNombre()
                        )
                )
        );
    }
}