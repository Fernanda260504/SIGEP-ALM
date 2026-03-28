package com.example.sigepalm.model.auth;

public class AuthRequest {

    private String correo;
    private String password;
    private String role;

    // 🔥 NUEVOS
    private String nombre;
    private String tipo;
    private Long id;

    // getters y setters


    public AuthRequest(String correo, String password, String role, String nombre, String tipo, Long id) {
        this.correo = correo;
        this.password = password;
        this.role = role;
        this.nombre = nombre;
        this.tipo = tipo;
        this.id = id;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}