import { useState } from "react";
import Layout from "../components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/MyPermissions.css";

function MyPermissions() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const myPermissions = [
    {
      id: 1,
      type: "Permiso Personal",
      reason: "Cita médica programada",
      startDate: "2026-03-05",
      endDate: "2026-03-05",
      duration: "4 horas",
      status: "pending",
      requestDate: "2026-03-01",
      priority: "medium",
      comments: ""
    },
    {
      id: 2,
      type: "Vacaciones",
      reason: "Vacaciones familiares",
      startDate: "2026-03-10",
      endDate: "2026-03-15",
      duration: "5 días",
      status: "approved",
      requestDate: "2026-02-28",
      priority: "high",
      approvedBy: "Carlos Ramírez",
      approvedDate: "2026-03-02",
      comments: "Aprobado. Disfruta tus vacaciones."
    },
    {
      id: 3,
      type: "Permiso con Goce",
      reason: "Trámite legal urgente",
      startDate: "2026-02-20",
      endDate: "2026-02-20",
      duration: "8 horas",
      status: "approved",
      requestDate: "2026-02-18",
      priority: "high",
      approvedBy: "Carlos Ramírez",
      approvedDate: "2026-02-19",
      comments: "Aprobado por urgencia."
    },
    {
      id: 4,
      type: "Permiso Personal",
      reason: "Asunto personal",
      startDate: "2026-02-15",
      endDate: "2026-02-15",
      duration: "3 horas",
      status: "rejected",
      requestDate: "2026-02-14",
      priority: "low",
      rejectedBy: "Carlos Ramírez",
      rejectedDate: "2026-02-14",
      comments: "No se puede aprobar por falta de personal ese día."
    },
    {
      id: 5,
      type: "Incapacidad",
      reason: "Enfermedad general",
      startDate: "2026-01-25",
      endDate: "2026-01-27",
      duration: "3 días",
      status: "approved",
      requestDate: "2026-01-25",
      priority: "high",
      approvedBy: "Carlos Ramírez",
      approvedDate: "2026-01-25",
      comments: "Aprobado. Recuperate pronto."
    }
  ];

  const filteredPermissions = myPermissions.filter(permission => {
    const matchesStatus = filterStatus === "all" || permission.status === filterStatus;
    const matchesSearch = 
      permission.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: "warning", icon: "hourglass-split", text: "Pendiente" },
      approved: { bg: "success", icon: "check-circle-fill", text: "Aprobado" },
      rejected: { bg: "danger", icon: "x-circle-fill", text: "Rechazado" }
    };
    const badge = badges[status] || badges.pending;
    
    return (
      <span className={`status-badge status-${badge.bg}`}>
        <i className={`bi bi-${badge.icon}`}></i>
        {badge.text}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: { color: "danger", text: "Alta", icon: "exclamation-circle" },
      medium: { color: "warning", text: "Media", icon: "dash-circle" },
      low: { color: "info", text: "Baja", icon: "info-circle" }
    };
    const badge = badges[priority] || badges.medium;
    
    return (
      <span className={`priority-badge priority-${badge.color}`}>
        <i className={`bi bi-${badge.icon}`}></i>
        {badge.text}
      </span>
    );
  };

  const stats = {
    total: myPermissions.length,
    pending: myPermissions.filter(p => p.status === "pending").length,
    approved: myPermissions.filter(p => p.status === "approved").length,
    rejected: myPermissions.filter(p => p.status === "rejected").length
  };

  return (
    <Layout role="warehouse">
      <div className="my-permissions-container">
        {/* Header */}
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
            
            <button className="btn btn-wurth-red">
              <i className="bi bi-plus-circle me-2"></i>
              Nueva Solicitud
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="mini-stat-card stat-total">
              <div className="mini-stat-icon">
                <i className="bi bi-file-earmark-text"></i>
              </div>
              <div className="mini-stat-content">
                <h3>{stats.total}</h3>
                <p>Total</p>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="mini-stat-card stat-pending">
              <div className="mini-stat-icon">
                <i className="bi bi-hourglass-split"></i>
              </div>
              <div className="mini-stat-content">
                <h3>{stats.pending}</h3>
                <p>Pendientes</p>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="mini-stat-card stat-approved">
              <div className="mini-stat-icon">
                <i className="bi bi-check-circle"></i>
              </div>
              <div className="mini-stat-content">
                <h3>{stats.approved}</h3>
                <p>Aprobadas</p>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="mini-stat-card stat-rejected">
              <div className="mini-stat-icon">
                <i className="bi bi-x-circle"></i>
              </div>
              <div className="mini-stat-content">
                <h3>{stats.rejected}</h3>
                <p>Rechazadas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
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
                  <button 
                    className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('all')}
                  >
                    <i className="bi bi-list-ul me-1"></i>
                    Todas
                  </button>
                  <button 
                    className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('pending')}
                  >
                    <i className="bi bi-hourglass me-1"></i>
                    Pendientes
                  </button>
                  <button 
                    className={`filter-btn ${filterStatus === 'approved' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('approved')}
                  >
                    <i className="bi bi-check-circle me-1"></i>
                    Aprobadas
                  </button>
                  <button 
                    className={`filter-btn ${filterStatus === 'rejected' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('rejected')}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Rechazadas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Permissions List */}
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
                          {permission.status === 'approved' ? 'Comentario del Gerente:' : 
                           permission.status === 'rejected' ? 'Motivo del Rechazo:' : 
                           'Comentarios:'}
                        </strong>
                        <p className="mb-0 mt-1">{permission.comments}</p>
                        {permission.approvedBy && (
                          <small className="d-block mt-1 text-muted">
                            - {permission.approvedBy} ({permission.approvedDate})
                          </small>
                        )}
                        {permission.rejectedBy && (
                          <small className="d-block mt-1 text-muted">
                            - {permission.rejectedBy} ({permission.rejectedDate})
                          </small>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="permission-card-footer">
                  <button className="btn btn-sm btn-outline-danger">
                    <i className="bi bi-eye me-1"></i>
                    Ver Detalles
                  </button>
                  {permission.status === 'pending' && (
                    <button className="btn btn-sm btn-outline-secondary">
                      <i className="bi bi-x-circle me-1"></i>
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}

export default MyPermissions;