import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/MyPermissions.css";

// Fecha de hoy en formato YYYY-MM-DD local
const getTodayLocal = () => {
  const now = new Date();
  const year  = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day   = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const TODAY = getTodayLocal();

// ─── TIPOS DE PERMISO ───────────────────────────────────────────────────────
const permissionTypes = [
  { value: "personal",   label: "Permiso Personal", icon: "person"            },
  { value: "medico",     label: "Permiso Médico",   icon: "heart-pulse"       },
  { value: "legal",      label: "Trámite Legal",    icon: "file-earmark-text" },
  { value: "familiar",   label: "Asunto Familiar",  icon: "house-heart"       },
  { value: "vacaciones", label: "Vacaciones",        icon: "airplane"          },
  { value: "otro",       label: "Otro Motivo",       icon: "three-dots"        }
];

// ─── HELPERS DE COLOR POR ESTADO ────────────────────────────────────────────
const statusConfig = {
  pending:  { bg: "warning", icon: "hourglass-split",   text: "Pendiente", gradient: "#f59e0b, #d97706" },
  approved: { bg: "success", icon: "check-circle-fill", text: "Aprobado",  gradient: "#10b981, #059669" },
  rejected: { bg: "danger",  icon: "x-circle-fill",     text: "Rechazado", gradient: "#ef4444, #dc2626" }
};

const priorityConfig = {
  high:   { color: "danger",  text: "Alta",  icon: "exclamation-circle" },
  medium: { color: "warning", text: "Media", icon: "dash-circle"        },
  low:    { color: "info",    text: "Baja",  icon: "info-circle"        }
};

// ─── COMPONENTE PRINCIPAL ───────────────────────────────────────────────────
function MyPermissions() {

  // ── Lista y filtros ──────────────────────────────────────────────────────
  const [filterStatus,  setFilterStatus]  = useState("all");
  const [searchTerm,    setSearchTerm]    = useState("");
  const [myPermissions, setMyPermissions] = useState([]);

  // ── Modal Nueva Solicitud ────────────────────────────────────────────────
  const [showModal, setShowModal] = useState(false);

  // ── Modal Ver Detalles ───────────────────────────────────────────────────
  const [selectedPermission, setSelectedPermission] = useState(null);

  // ── Formulario ───────────────────────────────────────────────────────────
  const emptyForm = { type: "", reason: "", startDate: "", endDate: "", description: "" };
  const [formData,     setFormData]     = useState(emptyForm);
  const [errors,       setErrors]       = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess,  setShowSuccess]  = useState(false);

  // ── Mapeo estados back → front ───────────────────────────────────────────
  const mapStatus = (estado) => {
    switch (estado) {
      case "APROBADO":  return "approved";
      case "RECHAZADO": return "rejected";
      default:          return "pending";
    }
  };

  // ── Fetch permisos ───────────────────────────────────────────────────────
  const fetchPermisos = async () => {
    try {
      const id    = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      if (!id) return;

      const res = await fetch(`http://localhost:8080/api/permisos/empleado/${id}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;

      const result = await res.json();
      if (result.success) {
        setMyPermissions(result.data.map((p) => ({
          id:           p.id,
          type:         p.tipo,
          reason:       p.motivo,
          startDate:    p.fechaInicio,
          endDate:      p.fechaFin,
          duration:     `${p.totalDias} día${p.totalDias !== 1 ? "s" : ""}`,
          status:       mapStatus(p.estado),
          requestDate:  p.fechaSolicitud || p.fechaInicio,
          priority:     p.prioridad ? p.prioridad.toLowerCase() : "medium",
          comments:     p.comentario      || "",
          approvedBy:   p.aprobadoPor     || null,
          approvedDate: p.fechaAprobacion || null,
          rejectedBy:   p.rechazadoPor    || null,
          rejectedDate: p.fechaRechazo    || null
        })));
      }
    } catch (err) {
      console.error("Error cargando permisos:", err);
    }
  };

  useEffect(() => { fetchPermisos(); }, []);

  // ── Stats ────────────────────────────────────────────────────────────────
  const stats = {
    total:    myPermissions.length,
    pending:  myPermissions.filter(p => p.status === "pending").length,
    approved: myPermissions.filter(p => p.status === "approved").length,
    rejected: myPermissions.filter(p => p.status === "rejected").length
  };

  // ── Lista filtrada ───────────────────────────────────────────────────────
  const filteredPermissions = myPermissions.filter(p => {
    const okStatus = filterStatus === "all" || p.status === filterStatus;
    const okSearch =
      p.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.type.toLowerCase().includes(searchTerm.toLowerCase());
    return okStatus && okSearch;
  });

  // ── Badges ───────────────────────────────────────────────────────────────
  const getStatusBadge = (status) => {
    const b = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`status-badge status-${b.bg}`}>
        <i className={`bi bi-${b.icon}`}></i> {b.text}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const b = priorityConfig[priority] || priorityConfig.medium;
    return (
      <span className={`priority-badge priority-${b.color}`}>
        <i className={`bi bi-${b.icon}`}></i> {b.text}
      </span>
    );
  };

  // ── Duración calculada ───────────────────────────────────────────────────
  const calcDuration = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const diff = Math.abs(new Date(formData.endDate) - new Date(formData.startDate));
    return Math.ceil(diff / 86400000) + 1;
  };

  // ── Handlers formulario ──────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate" && formData.endDate && value > formData.endDate) {
      setFormData(prev => ({ ...prev, startDate: value, endDate: "" }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleTypeSelect = (value) => {
    setFormData(prev => ({ ...prev, type: value }));
    if (errors.type) setErrors(prev => ({ ...prev, type: "" }));
  };

  const validateForm = () => {
    const e = {};
    if (!formData.type)               e.type        = "Selecciona un tipo de permiso";
    if (!formData.reason.trim())      e.reason       = "El motivo es obligatorio";
    if (!formData.startDate)          e.startDate    = "La fecha de inicio es obligatoria";
    if (!formData.endDate)            e.endDate      = "La fecha de fin es obligatoria";
    if (formData.startDate && formData.endDate &&
        new Date(formData.endDate) < new Date(formData.startDate))
      e.endDate = "La fecha de fin no puede ser anterior a la de inicio";
    if (!formData.description.trim()) e.description  = "Proporciona una descripción detallada";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const userId = localStorage.getItem("id");
      const token  = localStorage.getItem("token");
      if (!userId) { alert("Error: usuario no autenticado"); return; }

      const payload = {
        motivo:      formData.reason,
        fechaInicio: formData.startDate,
        fechaFin:    formData.endDate,
        tipo:        formData.type.toUpperCase(),
        empleado:    { id: userId }
      };

      const res = await fetch("http://localhost:8080/api/permisos", {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify(payload)
      });

      if (!res.ok) { alert("Error al enviar solicitud"); return; }

      setShowSuccess(true);
      setFormData(emptyForm);
      fetchPermisos();
      setTimeout(() => { setShowSuccess(false); setShowModal(false); }, 2000);
    } catch (err) {
      console.error(err);
      alert("Error al enviar solicitud");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData(emptyForm);
    setErrors({});
    setShowSuccess(false);
  };

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <Layout role="warehouse">
      <div className="my-permissions-container">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="permissions-header mb-4">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div>
              <h1 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                <i className="bi bi-file-text text-danger"></i>
                Mis Permisos
              </h1>
              <p className="text-muted mb-0">
                Revisa el estado y historial de todas tus solicitudes
              </p>
            </div>
            <button className="btn btn-wurth-red" onClick={() => setShowModal(true)}>
              <i className="bi bi-plus-circle me-2"></i>
              Nueva Solicitud
            </button>
          </div>
        </div>

        {/* ── Stats Cards ─────────────────────────────────────────────────── */}
        <div className="row g-3 mb-4">
          {[
            { key: "total",    label: "Total",      icon: "file-earmark-text", cls: "stat-total"    },
            { key: "pending",  label: "Pendientes", icon: "hourglass-split",   cls: "stat-pending"  },
            { key: "approved", label: "Aprobadas",  icon: "check-circle",      cls: "stat-approved" },
            { key: "rejected", label: "Rechazadas", icon: "x-circle",          cls: "stat-rejected" }
          ].map(s => (
            <div key={s.key} className="col-6 col-md-3">
              <div className={`mini-stat-card ${s.cls}`}>
                <div className="mini-stat-icon">
                  <i className={`bi bi-${s.icon}`}></i>
                </div>
                <div className="mini-stat-content">
                  <h3>{stats[s.key]}</h3>
                  <p>{s.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filters ─────────────────────────────────────────────────────── */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-center">
              <div className="col-12 col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Buscar por motivo o tipo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="filter-buttons">
                  {[
                    { val: "all",      label: "Todas",      icon: "list-ul"      },
                    { val: "pending",  label: "Pendientes", icon: "hourglass"    },
                    { val: "approved", label: "Aprobadas",  icon: "check-circle" },
                    { val: "rejected", label: "Rechazadas", icon: "x-circle"     }
                  ].map(f => (
                    <button
                      key={f.val}
                      className={`filter-btn ${filterStatus === f.val ? "active" : ""}`}
                      onClick={() => setFilterStatus(f.val)}
                    >
                      <i className={`bi bi-${f.icon} me-1`}></i>{f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Permissions List ─────────────────────────────────────────────── */}
        <div className="permissions-list">
          {filteredPermissions.length === 0 ? (
            <div className="card shadow-sm border-0">
              <div className="card-body text-center py-5">
                <i className="bi bi-inbox text-muted" style={{ fontSize: "4rem" }}></i>
                <h4 className="mt-3 text-muted">No se encontraron solicitudes</h4>
                <p className="text-muted">Intenta cambiar los filtros de búsqueda</p>
              </div>
            </div>
          ) : (
            filteredPermissions.map((permission) => (
              <div key={permission.id} className="permission-card">
                <div className="permission-card-header">
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                    <div>
                      <h5 className="mb-1">
                        <i className="bi bi-calendar-event text-danger me-2"></i>
                        {permission.type}
                      </h5>
                      <p className="text-muted small mb-0">
                        <i className="bi bi-clock me-1"></i>
                        Solicitado el {permission.requestDate}
                      </p>
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                      {getPriorityBadge(permission.priority)}
                      {getStatusBadge(permission.status)}
                    </div>
                  </div>
                </div>

                <div className="permission-card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="info-item">
                        <i className="bi bi-chat-left-text text-danger"></i>
                        <div>
                          <small className="text-muted d-block">Motivo</small>
                          <strong>{permission.reason}</strong>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="info-item">
                        <i className="bi bi-calendar-range text-danger"></i>
                        <div>
                          <small className="text-muted d-block">Fecha</small>
                          <strong>{permission.startDate}</strong>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="info-item">
                        <i className="bi bi-hourglass text-danger"></i>
                        <div>
                          <small className="text-muted d-block">Duración</small>
                          <strong>{permission.duration}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {permission.comments && (
                    <div className="comments-section mt-3">
                      <div className="alert alert-info mb-0">
                        <i className="bi bi-chat-square-quote me-2"></i>
                        <strong>
                          {permission.status === "approved" ? "Comentario del Gerente:" :
                           permission.status === "rejected" ? "Motivo del Rechazo:"    :
                           "Comentarios:"}
                        </strong>
                        <p className="mb-0 mt-1">{permission.comments}</p>
                        {permission.approvedBy && (
                          <small className="d-block mt-1 text-muted">
                            — {permission.approvedBy} ({permission.approvedDate})
                          </small>
                        )}
                        {permission.rejectedBy && (
                          <small className="d-block mt-1 text-muted">
                            — {permission.rejectedBy} ({permission.rejectedDate})
                          </small>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="permission-card-footer">
                  {/* ── Ver Detalles → abre modal ── */}
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => setSelectedPermission(permission)}
                  >
                    <i className="bi bi-eye me-1"></i>Ver Detalles
                  </button>
                    
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL — Ver Detalles del Permiso
      ══════════════════════════════════════════════════════════════════════ */}
      {selectedPermission && (() => {
        const p  = selectedPermission;
        const sc = statusConfig[p.status]   || statusConfig.pending;
        const pc = priorityConfig[p.priority] || priorityConfig.medium;

        return (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedPermission(null); }}
          >
            <div className="modal-dialog modal-md modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 16 }}>

                {/* Header coloreado según estado */}
                <div
                  className="modal-header border-0"
                  style={{
                    background: `linear-gradient(135deg, ${sc.gradient})`,
                    borderRadius: "16px 16px 0 0",
                    padding: "1.25rem 1.5rem"
                  }}
                >
                  <div className="d-flex align-items-center gap-3 text-white">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: 48, height: 48, background: "rgba(255,255,255,0.2)" }}
                    >
                      <i className={`bi bi-${sc.icon} fs-4`}></i>
                    </div>
                    <div>
                      <h5 className="modal-title mb-0 fw-bold">{p.type}</h5>
                      <small style={{ opacity: 0.9 }}>
                        Solicitud #{p.id} · {sc.text}
                      </small>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-close btn-close-white ms-auto"
                    onClick={() => setSelectedPermission(null)}
                  ></button>
                </div>

                {/* Body */}
                <div className="modal-body p-4">

                  {/* Fila de badges */}
                  <div className="d-flex gap-2 flex-wrap mb-4">
                    <span className={`status-badge status-${sc.bg}`}>
                      <i className={`bi bi-${sc.icon}`}></i> {sc.text}
                    </span>
                    <span className={`priority-badge priority-${pc.color}`}>
                      <i className={`bi bi-${pc.icon}`}></i> Prioridad {pc.text}
                    </span>
                  </div>

                  {/* Grid de datos */}
                  <div className="row g-3 mb-3">

                    <div className="col-12">
                      <div className="detail-item p-3 rounded-3" style={{ background: "#f8f9fa" }}>
                        <div className="d-flex align-items-start gap-2">
                          <i className="bi bi-chat-left-text text-danger mt-1"></i>
                          <div>
                            <small className="text-muted fw-semibold text-uppercase" style={{ fontSize: "0.7rem", letterSpacing: 1 }}>
                              Motivo
                            </small>
                            <p className="mb-0 fw-semibold text-dark">{p.reason}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="detail-item p-3 rounded-3" style={{ background: "#f8f9fa" }}>
                        <div className="d-flex align-items-start gap-2">
                          <i className="bi bi-calendar-event text-danger mt-1"></i>
                          <div>
                            <small className="text-muted fw-semibold text-uppercase" style={{ fontSize: "0.7rem", letterSpacing: 1 }}>
                              Fecha Inicio
                            </small>
                            <p className="mb-0 fw-semibold text-dark">{p.startDate}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="detail-item p-3 rounded-3" style={{ background: "#f8f9fa" }}>
                        <div className="d-flex align-items-start gap-2">
                          <i className="bi bi-calendar-check text-danger mt-1"></i>
                          <div>
                            <small className="text-muted fw-semibold text-uppercase" style={{ fontSize: "0.7rem", letterSpacing: 1 }}>
                              Fecha Fin
                            </small>
                            <p className="mb-0 fw-semibold text-dark">{p.endDate || p.startDate}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="detail-item p-3 rounded-3" style={{ background: "#f8f9fa" }}>
                        <div className="d-flex align-items-start gap-2">
                          <i className="bi bi-hourglass-split text-danger mt-1"></i>
                          <div>
                            <small className="text-muted fw-semibold text-uppercase" style={{ fontSize: "0.7rem", letterSpacing: 1 }}>
                              Duración
                            </small>
                            <p className="mb-0 fw-semibold text-dark">{p.duration}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="detail-item p-3 rounded-3" style={{ background: "#f8f9fa" }}>
                        <div className="d-flex align-items-start gap-2">
                          <i className="bi bi-clock text-danger mt-1"></i>
                          <div>
                            <small className="text-muted fw-semibold text-uppercase" style={{ fontSize: "0.7rem", letterSpacing: 1 }}>
                              Fecha Solicitud
                            </small>
                            <p className="mb-0 fw-semibold text-dark">{p.requestDate}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sección aprobación / rechazo */}
                  {p.status === "approved" && p.approvedBy && (
                    <div className="alert alert-success d-flex gap-2 align-items-start mb-3">
                      <i className="bi bi-person-check-fill fs-5 flex-shrink-0 mt-1"></i>
                      <div>
                        <strong className="d-block">Aprobado por</strong>
                        <span>{p.approvedBy}</span>
                        {p.approvedDate && (
                          <small className="d-block text-muted mt-1">
                            <i className="bi bi-calendar2-check me-1"></i>{p.approvedDate}
                          </small>
                        )}
                      </div>
                    </div>
                  )}

                  {p.status === "rejected" && p.rejectedBy && (
                    <div className="alert alert-danger d-flex gap-2 align-items-start mb-3">
                      <i className="bi bi-person-x-fill fs-5 flex-shrink-0 mt-1"></i>
                      <div>
                        <strong className="d-block">Rechazado por</strong>
                        <span>{p.rejectedBy}</span>
                        {p.rejectedDate && (
                          <small className="d-block text-muted mt-1">
                            <i className="bi bi-calendar2-x me-1"></i>{p.rejectedDate}
                          </small>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Comentarios */}
                  {p.comments && (
                    <div className="alert alert-info d-flex gap-2 align-items-start mb-3">
                      <i className="bi bi-chat-square-quote-fill fs-5 flex-shrink-0 mt-1"></i>
                      <div>
                        <strong className="d-block mb-1">
                          {p.status === "approved" ? "Comentario del Gerente" :
                           p.status === "rejected" ? "Motivo del Rechazo"     :
                           "Comentarios"}
                        </strong>
                        <span>{p.comments}</span>
                      </div>
                    </div>
                  )}

                  {/* Timeline visual de estado */}
                  <div className="mt-3 pt-3 border-top">
                    <small className="text-muted fw-semibold text-uppercase d-block mb-3" style={{ fontSize: "0.7rem", letterSpacing: 1 }}>
                      <i className="bi bi-diagram-3 me-1"></i>Progreso de la Solicitud
                    </small>
                    <div className="d-flex align-items-center gap-2">

                      {/* Paso 1: Enviada */}
                      <div className="d-flex flex-column align-items-center" style={{ minWidth: 60 }}>
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: 36, height: 36, background: "#10b981", color: "#fff" }}
                        >
                          <i className="bi bi-send-fill"></i>
                        </div>
                        <small className="text-center mt-1 text-muted" style={{ fontSize: "0.65rem" }}>Enviada</small>
                      </div>

                      {/* Línea */}
                      <div
                        style={{
                          flex: 1, height: 3, borderRadius: 4,
                          background: p.status !== "pending" ? "#10b981" : "#e5e7eb"
                        }}
                      />

                      {/* Paso 2: En revisión */}
                      <div className="d-flex flex-column align-items-center" style={{ minWidth: 64 }}>
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: 36, height: 36,
                            background: p.status !== "pending" ? "#10b981" : "#f59e0b",
                            color: "#fff"
                          }}
                        >
                          <i className={`bi bi-${p.status !== "pending" ? "check" : "hourglass-split"}`}></i>
                        </div>
                        <small className="text-center mt-1 text-muted" style={{ fontSize: "0.65rem" }}>En revisión</small>
                      </div>

                      {/* Línea */}
                      <div
                        style={{
                          flex: 1, height: 3, borderRadius: 4,
                          background: p.status !== "pending" ? (p.status === "approved" ? "#10b981" : "#ef4444") : "#e5e7eb"
                        }}
                      />

                      {/* Paso 3: Resultado */}
                      <div className="d-flex flex-column align-items-center" style={{ minWidth: 64 }}>
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: 36, height: 36,
                            background: p.status === "approved" ? "#10b981"
                                      : p.status === "rejected" ? "#ef4444"
                                      : "#e5e7eb",
                            color: p.status !== "pending" ? "#fff" : "#9ca3af"
                          }}
                        >
                          <i className={`bi bi-${
                            p.status === "approved" ? "check-circle-fill"
                          : p.status === "rejected" ? "x-circle-fill"
                          : "circle"}`}></i>
                        </div>
                        <small className="text-center mt-1 text-muted" style={{ fontSize: "0.65rem" }}>
                          {p.status === "approved" ? "Aprobada"
                         : p.status === "rejected" ? "Rechazada"
                         : "Pendiente"}
                        </small>
                      </div>

                    </div>
                  </div>

                </div>

                {/* Footer */}
                <div className="modal-footer border-0 pt-0 px-4 pb-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={() => setSelectedPermission(null)}
                  >
                    <i className="bi bi-x-circle me-2"></i>Cerrar
                  </button>
                  
                </div>

              </div>
            </div>
          </div>
        );
      })()}

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL — Nueva Solicitud de Permiso
      ══════════════════════════════════════════════════════════════════════ */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 16 }}>

              <div
                className="modal-header border-0"
                style={{
                  background: "linear-gradient(135deg, #cc0000 0%, #8b0000 100%)",
                  borderRadius: "16px 16px 0 0",
                  padding: "1.25rem 1.5rem"
                }}
              >
                <div className="d-flex align-items-center gap-3 text-white">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: 44, height: 44, background: "rgba(255,255,255,0.2)" }}
                  >
                    <i className="bi bi-file-earmark-plus fs-4"></i>
                  </div>
                  <div>
                    <h5 className="modal-title mb-0 fw-bold">Nueva Solicitud de Permiso</h5>
                    <small style={{ opacity: 0.85 }}>
                      Completa el formulario para enviar tu solicitud
                    </small>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white ms-auto"
                  onClick={closeModal}
                ></button>
              </div>

              <div className="modal-body p-4">

                {showSuccess && (
                  <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
                    <i className="bi bi-check-circle-fill fs-5"></i>
                    <span>
                      <strong>¡Solicitud enviada correctamente!</strong> Cerrando formulario...
                    </span>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>

                  {/* Tipo de permiso */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark mb-3">
                      <i className="bi bi-grid text-danger me-2"></i>
                      Tipo de Permiso <span className="text-danger">*</span>
                    </label>
                    <div className="permission-types-grid">
                      {permissionTypes.map((t) => (
                        <div
                          key={t.value}
                          className={`permission-type-card ${formData.type === t.value ? "selected" : ""}`}
                          onClick={() => handleTypeSelect(t.value)}
                        >
                          <i className={`bi bi-${t.icon}`}></i>
                          <span>{t.label}</span>
                        </div>
                      ))}
                    </div>
                    {errors.type && (
                      <div className="invalid-feedback d-block mt-2">
                        <i className="bi bi-exclamation-circle me-1"></i>{errors.type}
                      </div>
                    )}
                  </div>

                  {/* Motivo */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">
                      <i className="bi bi-chat-left-text text-danger me-2"></i>
                      Motivo <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="reason"
                      className={`form-control ${errors.reason ? "is-invalid" : ""}`}
                      placeholder="Ej: Cita médica programada"
                      value={formData.reason}
                      onChange={handleChange}
                    />
                    {errors.reason && (
                      <div className="invalid-feedback">
                        <i className="bi bi-exclamation-circle me-1"></i>{errors.reason}
                      </div>
                    )}
                  </div>

                  {/* Fechas */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-dark">
                        <i className="bi bi-calendar-event text-danger me-2"></i>
                        Fecha de Inicio <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
                        value={formData.startDate}
                        onChange={handleChange}
                        min={TODAY}
                      />
                      {errors.startDate && (
                        <div className="invalid-feedback">
                          <i className="bi bi-exclamation-circle me-1"></i>{errors.startDate}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-dark">
                        <i className="bi bi-calendar-check text-danger me-2"></i>
                        Fecha de Fin <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
                        value={formData.endDate}
                        onChange={handleChange}
                        min={formData.startDate || TODAY}
                      />
                      {errors.endDate && (
                        <div className="invalid-feedback">
                          <i className="bi bi-exclamation-circle me-1"></i>{errors.endDate}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Duración calculada */}
                  {calcDuration() > 0 && (
                    <div
                      className="d-flex align-items-center gap-2 mb-3 px-3 py-2 rounded-3"
                      style={{ background: "#fff5f5", border: "1px solid #ffc8c8" }}
                    >
                      <i className="bi bi-hourglass-split text-danger"></i>
                      <span className="small">
                        Duración estimada:{" "}
                        <strong className="text-danger">
                          {calcDuration()} día{calcDuration() !== 1 ? "s" : ""}
                        </strong>
                      </span>
                    </div>
                  )}

                  {/* Descripción */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">
                      <i className="bi bi-card-text text-danger me-2"></i>
                      Descripción Detallada <span className="text-danger">*</span>
                    </label>
                    <textarea
                      name="description"
                      className={`form-control ${errors.description ? "is-invalid" : ""}`}
                      placeholder="Describe con detalle el motivo de tu solicitud..."
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                    />
                    {errors.description && (
                      <div className="invalid-feedback">
                        <i className="bi bi-exclamation-circle me-1"></i>{errors.description}
                      </div>
                    )}
                  </div>

                  {/* Botones */}
                  <div className="d-flex gap-2 justify-content-end pt-2 border-top">
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-4"
                      onClick={closeModal}
                      disabled={isSubmitting}
                    >
                      <i className="bi bi-x-circle me-2"></i>Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-wurth-red px-4"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send me-2"></i>Enviar Solicitud
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}

export default MyPermissions;