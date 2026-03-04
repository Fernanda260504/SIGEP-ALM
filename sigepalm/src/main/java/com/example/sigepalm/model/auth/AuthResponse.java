package com.example.sigepalm.model.auth;

public class AuthResponse {

    private String token;
    private String role;
    private String correo;

    public AuthResponse(String token, String role, String correo) {
        this.token = token;
        this.role = role;
        this.correo = correo;
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
}