import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import PermissionTable from "../components/PermissionTable";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Managerapproval.css";

function ManagerApproval() {

  const [permisos, setPermisos] = useState([]);

  const [stats, setStats] = useState({
    pending: 0,
    approvedToday: 0,
    rejectedToday: 0,
    totalThisWeek: 0
  });

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPermisos();
  }, []);

  // 🔹 Obtener permisos del backend
  const fetchPermisos = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8080/api/permisos",{
        method:"GET",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        }
      });

      if(!response.ok){
        console.error("Error HTTP:",response.status);
        return;
      }

      const result = await response.json();

      if(result.success){

        setPermisos(result.data);
        actualizarEstadisticas(result.data);

      }

    } catch (error) {

      console.error("Error cargando permisos",error);

    }

  };

  // 🔹 Calcular estadísticas
  const actualizarEstadisticas = (lista) => {

    const pendientes = lista.filter(p => p.estado === "PENDIENTE").length;
    const aprobados = lista.filter(p => p.estado === "APROBADO").length;
    const rechazados = lista.filter(p => p.estado === "RECHAZADO").length;

    setStats({
      pending: pendientes,
      approvedToday: aprobados,
      rejectedToday: rechazados,
      totalThisWeek: lista.length
    });

  };

  // 🔹 Aprobar o rechazar
  const decidirPermiso = async (permisoId, estado) => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/autorizaciones/${permisoId}`,
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
          },
          body:JSON.stringify({
            decision:estado
          })
        }
      );

      if(!response.ok){
        console.error("Error HTTP:",response.status);
        return;
      }

      const result = await response.json();

      if(result.success){
        fetchPermisos();
      }

    } catch (error) {

      console.error("Error autorizando permiso",error);

    }

  };

  return (

    <Layout role="manager">

      <div className="manager-approval-container">

        {/* Header */}
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


          </div>
        </div>

        {/* Statistics */}
        <div className="row g-3 mb-4">

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
                  Procesadas
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card stat-card-warning">
              <div className="stat-card-icon">
                <i className="bi bi-x-circle"></i>
              </div>

              <div className="stat-card-content">
                <h6 className="stat-card-label">Rechazadas</h6>
                <h2 className="stat-card-value">{stats.rejectedToday}</h2>
                <p className="stat-card-subtitle">
                  <i className="bi bi-arrow-down me-1"></i>
                  No aprobadas
                </p>
              </div>
            </div>
          </div>

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

        {/* Search */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">

            <div className="row g-3 align-items-center">

              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar permiso..."
                  value={searchTerm}
                  onChange={(e)=>setSearchTerm(e.target.value)}
                />
              </div>

              <div className="col-md-6 d-flex gap-2 flex-wrap">

                <button
                  className={`btn btn-sm ${filter === "all" ? "btn-wurth-red":"btn-outline-secondary"}`}
                  onClick={()=>setFilter("all")}
                >
                  Todas
                </button>

                <button
                  className={`btn btn-sm ${filter === "pending" ? "btn-wurth-red":"btn-outline-secondary"}`}
                  onClick={()=>setFilter("pending")}
                >
                  Pendientes
                </button>

                <button
                  className={`btn btn-sm ${filter === "approved" ? "btn-wurth-red":"btn-outline-secondary"}`}
                  onClick={()=>setFilter("approved")}
                >
                  Aprobadas
                </button>

                <button
                  className={`btn btn-sm ${filter === "rejected" ? "btn-wurth-red":"btn-outline-secondary"}`}
                  onClick={()=>setFilter("rejected")}
                >
                  Rechazadas
                </button>

              </div>

            </div>

          </div>
        </div>

        {/* Table */}
        <div className="card shadow-sm border-0">

          <div className="card-header bg-white border-bottom py-3">
            <h5 className="fw-bold mb-0">
              <i className="bi bi-table text-danger me-2"></i>
              Solicitudes de Permisos
            </h5>
          </div>

          <div className="card-body p-0">

            <PermissionTable
              permisos={permisos}
              mode="approval"
              filter={filter}
              searchTerm={searchTerm}
              onApprove={(id)=>decidirPermiso(id,"APROBADO")}
              onReject={(id)=>decidirPermiso(id,"RECHAZADO")}
            />

          </div>

        </div>

      </div>

    </Layout>

  );

}

export default ManagerApproval;