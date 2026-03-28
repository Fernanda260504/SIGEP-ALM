package com.example.sigepalm.model.auth;

public class AuthResponse {

    private Long id;
    private String token;
    private String role;
    private String correo;
    private String nombre;

    public AuthResponse( String token, String role, String correo, String nombre,Long id) {

        this.token = token;
        this.role = role;
        this.correo = correo;
        this.nombre = nombre;
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}