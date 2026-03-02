import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import PermissionTable from "../components/PermissionTable";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Managerapproval.css";

function ManagerApproval() {
  const [stats, setStats] = useState({
    pending: 5,
    approvedToday: 2,
    rejectedToday: 1,
    totalThisWeek: 12
  });

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Layout role="manager">
      <div className="manager-approval-container">
        {/* Header Section */}
        <div className="approval-header mb-4">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div>
              <h1 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                <i className="bi bi-clipboard-check text-danger"></i>
                Panel de Aprobaciones
              </h1>
              <p className="text-muted mb-0">
                Gestiona y revisa las solicitudes de permisos del personal
              </p>
            </div>
            
            <div className="d-flex gap-2">
              <button className="btn btn-outline-danger btn-sm">
                <i className="bi bi-download me-2"></i>
                Exportar
              </button>
              <button className="btn btn-wurth-red btn-sm">
                <i className="bi bi-bell me-2"></i>
                Notificaciones
                <span className="badge bg-white text-danger ms-2">3</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="row g-3 mb-4">
          {/* Pendientes */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card stat-card-danger">
              <div className="stat-card-icon">
                <i className="bi bi-hourglass-split"></i>
              </div>
              <div className="stat-card-content">
                <h6 className="stat-card-label">Pendientes</h6>
                <h2 className="stat-card-value">{stats.pending}</h2>
                <p className="stat-card-subtitle">
                  <i className="bi bi-clock-history me-1"></i>
                  Requieren atención
                </p>
              </div>
            </div>
          </div>

          {/* Aprobadas Hoy */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card stat-card-success">
              <div className="stat-card-icon">
                <i className="bi bi-check-circle"></i>
              </div>
              <div className="stat-card-content">
                <h6 className="stat-card-label">Aprobadas Hoy</h6>
                <h2 className="stat-card-value">{stats.approvedToday}</h2>
                <p className="stat-card-subtitle">
                  <i className="bi bi-arrow-up me-1"></i>
                  +20% vs ayer
                </p>
              </div>
            </div>
          </div>

          {/* Rechazadas Hoy */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card stat-card-warning">
              <div className="stat-card-icon">
                <i className="bi bi-x-circle"></i>
              </div>
              <div className="stat-card-content">
                <h6 className="stat-card-label">Rechazadas Hoy</h6>
                <h2 className="stat-card-value">{stats.rejectedToday}</h2>
                <p className="stat-card-subtitle">
                  <i className="bi bi-arrow-down me-1"></i>
                  -50% vs ayer
                </p>
              </div>
            </div>
          </div>

          {/* Total Semana */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card stat-card-info">
              <div className="stat-card-icon">
                <i className="bi bi-graph-up"></i>
              </div>
              <div className="stat-card-content">
                <h6 className="stat-card-label">Esta Semana</h6>
                <h2 className="stat-card-value">{stats.totalThisWeek}</h2>
                <p className="stat-card-subtitle">
                  <i className="bi bi-calendar3 me-1"></i>
                  Total procesadas
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-center">
              <div className="col-12 col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Buscar por empleado, fecha o motivo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="d-flex gap-2 flex-wrap">
                  <button 
                    className={`btn btn-sm ${filter === 'all' ? 'btn-wurth-red' : 'btn-outline-secondary'}`}
                    onClick={() => setFilter('all')}
                  >
                    <i className="bi bi-list-ul me-1"></i>
                    Todas
                  </button>
                  <button 
                    className={`btn btn-sm ${filter === 'pending' ? 'btn-wurth-red' : 'btn-outline-secondary'}`}
                    onClick={() => setFilter('pending')}
                  >
                    <i className="bi bi-hourglass me-1"></i>
                    Pendientes
                  </button>
                  <button 
                    className={`btn btn-sm ${filter === 'approved' ? 'btn-wurth-red' : 'btn-outline-secondary'}`}
                    onClick={() => setFilter('approved')}
                  >
                    <i className="bi bi-check-circle me-1"></i>
                    Aprobadas
                  </button>
                  <button 
                    className={`btn btn-sm ${filter === 'rejected' ? 'btn-wurth-red' : 'btn-outline-secondary'}`}
                    onClick={() => setFilter('rejected')}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Rechazadas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Table Card */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white border-bottom py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-table text-danger me-2"></i>
                Solicitudes de Permisos
              </h5>
              <div className="d-flex gap-2 align-items-center">
                <span className="badge bg-danger-subtle text-danger">
                  {stats.pending} pendientes
                </span>
                <button className="btn btn-sm btn-link text-danger text-decoration-none">
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="card-body p-0">
            <PermissionTable mode="approval" filter={filter} searchTerm={searchTerm} />
          </div>

          <div className="card-footer bg-light border-top py-3">
            <div className="d-flex justify-content-between align-items-center text-muted small">
              <span>
                <i className="bi bi-info-circle me-1"></i>
                Última actualización: hace 2 minutos
              </span>
              <span>
                Mostrando {stats.pending + stats.approvedToday + stats.rejectedToday} solicitudes
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm bg-danger-subtle">
              <div className="card-body">
                <h6 className="fw-bold text-danger mb-3">
                  <i className="bi bi-lightning-charge me-2"></i>
                  Acciones Rápidas
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  <button className="btn btn-sm btn-outline-danger">
                    <i className="bi bi-check-all me-1"></i>
                    Aprobar Todas
                  </button>
                  <button className="btn btn-sm btn-outline-danger">
                    <i className="bi bi-file-earmark-text me-1"></i>
                    Generar Reporte
                  </button>
                  <button className="btn btn-sm btn-outline-danger">
                    <i className="bi bi-envelope me-1"></i>
                    Enviar Recordatorio
                  </button>
                  <button className="btn btn-sm btn-outline-danger">
                    <i className="bi bi-gear me-1"></i>
                    Configurar Alertas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ManagerApproval;