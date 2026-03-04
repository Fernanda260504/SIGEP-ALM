package com.example.sigepalm.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    // 🔐 Encriptador de contraseña
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 🔐 Configuración de seguridad
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        // 🔓 Rutas públicas
                        .requestMatchers("/auth/**").permitAll()

                        // 👥 Empleados (ambos roles)
                        .requestMatchers("/api/empleados/**")
                        .hasAnyAuthority("ALMACENISTA", "JEFE_ALMACEN")

                        // 📄 Permisos (ambos roles)
                        .requestMatchers("/api/permisos/**")
                        .hasAnyAuthority("ALMACENISTA", "JEFE_ALMACEN")

                        // ✅ Autorizaciones (solo jefe)
                        .requestMatchers("/api/autorizaciones/**")
                        .hasAuthority("JEFE_ALMACEN")
                        //Reportes
                        .requestMatchers("/api/reportes/**")
                        .hasAuthority("JEFE_ALMACEN")

                        // 🔒 Todo lo demás requiere autenticación
                        .anyRequest().authenticated()
                )

                // 🔥 Sin sesiones (JWT)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );

        // 🔐 Filtro JWT antes del filtro de autenticación
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // 🔐 Authentication Manager
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}