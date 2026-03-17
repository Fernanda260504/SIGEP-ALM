package com.example.sigepalm.model.auth;

public class AuthResponse {

    private String token;
    private String role;
    private String correo;
    private String nombre;

    public AuthResponse(String token, String role, String correo,String nombre) {
        this.token = token;
        this.role = role;
        this.correo = correo;
        this.nombre=nombre;
    }

    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }

    public String getCorreo() {
        return correo;
    }
    public String getNombre() {
        return nombre;
    }
}