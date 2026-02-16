package com.example.sigepalm.model.autorizacion;

import com.example.sigepalm.model.permiso.EstadoPermiso;
import com.example.sigepalm.model.permiso.PermisoLaboral;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "autorizaciones")
public class Autorizacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    private String jefeNombre;
    private String comentario;
    private LocalDate fechaDecision;

    @Enumerated(EnumType.STRING)
    private EstadoPermiso decision;

    @OneToOne
    private PermisoLaboral permiso;

    public Autorizacion() {
    }

    public Autorizacion(Long id, String jefeNombre, String comentario, LocalDate fechaDecision, EstadoPermiso decision, PermisoLaboral permiso) {
        this.id = id;
        this.jefeNombre = jefeNombre;
        this.comentario = comentario;
        this.fechaDecision = fechaDecision;
        this.decision = decision;
        this.permiso = permiso;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getJefeNombre() {
        return jefeNombre;
    }

    public void setJefeNombre(String jefeNombre) {
        this.jefeNombre = jefeNombre;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public LocalDate getFechaDecision() {
        return fechaDecision;
    }

    public void setFechaDecision(LocalDate fechaDecision) {
        this.fechaDecision = fechaDecision;
    }

    public EstadoPermiso getDecision() {
        return decision;
    }

    public void setDecision(EstadoPermiso decision) {
        this.decision = decision;
    }

    public PermisoLaboral getPermiso() {
        return permiso;
    }

    public void setPermiso(PermisoLaboral permiso) {
        this.permiso = permiso;
    }
}
