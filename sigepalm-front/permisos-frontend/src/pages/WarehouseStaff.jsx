import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import PermissionForm from "../components/PermissionForm";
import PermissionTable from "../components/PermissionTable";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/WarehouseStaff.css";

function WarehouseStaff() {
  const [activeTab, setActiveTab] = useState("solicitar");
  const [misPermisos, setMisPermisos] = useState([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    availableDays: 0
  });

  useEffect(() => {
    fetchMisPermisos();
  }, []);

  const fetchMisPermisos = async () => {
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      const res = await fetch(`http://localhost:8080/api/permisos/empleado/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setMisPermisos(result.data);
        calcularStats(result.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const calcularStats = (lista) => {
    setStats({
      totalRequests: lista.length,
      pending: lista.filter(p => p.estado === "PENDIENTE").length,
      approved: lista.filter(p => p.estado === "APROBADO").length,
      rejected: lista.filter(p => p.estado === "RECHAZADO").length,
      availableDays: lista[0]?.empleado?.diasDisponibles || 0
    });
  };

  const handleCrearPermiso = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/permisos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        console.error("Error al crear permiso");
        return;
      }
      fetchMisPermisos();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout role="warehouse">
      <div className="warehouse-staff-container">

        {/* Header Section */}
        <div className="staff-header mb-4">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div>
              <h1 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                <i className="bi bi-box-seam text-danger"></i>
                Solicitud de descansos
              </h1>
              <p className="text-muted mb-0">
                Gestiona tus solicitudes de permisos y consulta tu historial
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="row g-3 mb-4">

          {/* Días Disponibles */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card stat-card-primary">
              <div className="stat-card-icon">
                <i className="bi bi-calendar-check"></i>
              </div>
              <div className="stat-card-content">
                <h6 className="stat-card-label">Días Disponibles</h6>
                <h2 className="stat-card-value">{stats.availableDays}</h2>
                <p className="stat-card-subtitle">
                  <i className="bi bi-info-circle me-1"></i>
                  De 15 días totales
                </p>
              </div>
            </div>
          </div>

          {/* Total Solicitudes */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card stat-card-info">
              <div className="stat-card-icon">
                <i className="bi bi-file-text"></i>
              </div>
              <div className="stat-card-content">
                <h6 className="stat-card-label">Mis Solicitudes</h6>
                <h2 className="stat-card-value">{stats.totalRequests}</h2>
                <p className="stat-card-subtitle">
                  <i className="bi bi-graph-up me-1"></i>
                  Total este año
                </p>
              </div>
            </div>
          </div>

          {/* Pendientes */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card stat-card-warning">
              <div className="stat-card-icon">
                <i className="bi bi-hourglass-split"></i>
              </div>
              <div className="stat-card-content">
                <h6 className="stat-card-label">En Revisión</h6>
                <h2 className="stat-card-value">{stats.pending}</h2>
                <p className="stat-card-subtitle">
                  <i className="bi bi-clock-history me-1"></i>
                  Esperando aprobación
                </p>
              </div>
            </div>
          </div>

          {/* Aprobadas */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card stat-card-success">
              <div className="stat-card-icon">
                <i className="bi bi-check-circle"></i>
              </div>
              <div className="stat-card-content">
                <h6 className="stat-card-label">Aprobadas</h6>
                <h2 className="stat-card-value">{stats.approved}</h2>
                <p className="stat-card-subtitle">
                  <i className="bi bi-arrow-up me-1"></i>
                  Este mes
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body p-0">
            <div className="tab-navigation">
              <button
                className={`tab-button ${activeTab === "solicitar" ? "active" : ""}`}
                onClick={() => setActiveTab("solicitar")}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Nueva Solicitud
              </button>
              <button
                className={`tab-button ${activeTab === "historial" ? "active" : ""}`}
                onClick={() => setActiveTab("historial")}
              >
                <i className="bi bi-clock-history me-2"></i>
                Mi Historial
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content-wrapper">
          {activeTab === "solicitar" ? (
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-bottom py-3">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-pencil-square text-danger me-2"></i>
                  Solicitar Nuevo Permiso
                </h5>
                <p className="text-muted small mb-0 mt-1">
                  Completa el formulario para enviar tu solicitud al gerente
                </p>
              </div>
              <div className="card-body p-4">
                <PermissionForm onSubmit={handleCrearPermiso} />
              </div>
            </div>
          ) : (
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-bottom py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0 fw-bold">
                      <i className="bi bi-list-ul text-danger me-2"></i>
                      Historial de Solicitudes
                    </h5>
                    <p className="text-muted small mb-0 mt-1">
                      Consulta el estado de todas tus solicitudes
                    </p>
                  </div>
                  <button className="btn btn-sm btn-outline-danger">
                    <i className="bi bi-filter me-1"></i>
                    Filtrar
                  </button>
                </div>
              </div>
              <div className="card-body p-0">
                <PermissionTable permisos={misPermisos} mode="view" />
              </div>
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm bg-info-subtle">
              <div className="card-body">
                <h6 className="fw-bold text-info mb-3">
                  <i className="bi bi-info-circle me-2"></i>
                  Información Importante
                </h6>
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="info-item">
                      <i className="bi bi-calendar-range text-info"></i>
                      <div>
                        <strong>Planifica con anticipación</strong>
                        <p className="small mb-0 text-muted">
                          Solicita tus permisos con al menos 48 horas de anticipación
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="info-item">
                      <i className="bi bi-clock text-info"></i>
                      <div>
                        <strong>Tiempo de respuesta</strong>
                        <p className="small mb-0 text-muted">
                          Las solicitudes se revisan en un máximo de 24 horas
                        </p>
                      </div>
                    </div>
                  </div>
                 
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}

export default WarehouseStaff;