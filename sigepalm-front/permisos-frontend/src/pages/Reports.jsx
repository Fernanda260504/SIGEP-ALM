import { useState } from "react";
import Layout from "../components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Reports.css";

function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const stats = {
    totalRequests: 45,
    approved: 32,
    rejected: 8,
    pending: 5,
    approvalRate: 71,
    avgResponseTime: 18
  };

  const monthlyData = [
    { month: "Ene", requests: 12, approved: 10, rejected: 2 },
    { month: "Feb", requests: 15, approved: 12, rejected: 3 },
    { month: "Mar", requests: 18, approved: 10, rejected: 8 }
  ];

  const departmentData = [
    { name: "Almacén", total: 20, approved: 15, pending: 3, rejected: 2 },
    { name: "Logística", total: 15, approved: 10, pending: 2, rejected: 3 },
    { name: "Administración", total: 10, approved: 7, pending: 0, rejected: 3 }
  ];

  const topReasons = [
    { reason: "Cita médica", count: 12, percentage: 27 },
    { reason: "Asunto familiar", count: 10, percentage: 22 },
    { reason: "Trámite legal", count: 8, percentage: 18 },
    { reason: "Vacaciones", count: 7, percentage: 16 },
    { reason: "Otros", count: 8, percentage: 17 }
  ];

  return (
    <Layout role="manager">
      <div className="reports-container">
        {/* Header */}
        <div className="reports-header mb-4">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div>
              <h1 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                <i className="bi bi-graph-up text-danger"></i>
                Reportes y Análisis
              </h1>
              <p className="text-muted mb-0">
                Visualiza estadísticas y métricas del sistema de permisos
              </p>
            </div>
            
            <div className="d-flex gap-2">
              <select 
                className="form-select form-select-sm"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="all">Todos los Departamentos</option>
                <option value="almacen">Almacén</option>
                <option value="logistica">Logística</option>
                <option value="admin">Administración</option>
              </select>
              
              <select 
                className="form-select form-select-sm"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="week">Esta Semana</option>
                <option value="month">Este Mes</option>
                <option value="quarter">Este Trimestre</option>
                <option value="year">Este Año</option>
              </select>

              <button className="btn btn-wurth-red btn-sm">
                <i className="bi bi-download me-2"></i>
                Descargar PDF
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="kpi-card kpi-primary">
              <div className="kpi-icon">
                <i className="bi bi-file-text"></i>
              </div>
              <div className="kpi-content">
                <h6>Total Solicitudes</h6>
                <h2>{stats.totalRequests}</h2>
                <p className="text-success">
                  <i className="bi bi-arrow-up"></i> +12% vs mes anterior
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="kpi-card kpi-success">
              <div className="kpi-icon">
                <i className="bi bi-check-circle"></i>
              </div>
              <div className="kpi-content">
                <h6>Aprobadas</h6>
                <h2>{stats.approved}</h2>
                <p className="text-success">
                  <i className="bi bi-arrow-up"></i> +8% vs mes anterior
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="kpi-card kpi-danger">
              <div className="kpi-icon">
                <i className="bi bi-x-circle"></i>
              </div>
              <div className="kpi-content">
                <h6>Rechazadas</h6>
                <h2>{stats.rejected}</h2>
                <p className="text-danger">
                  <i className="bi bi-arrow-down"></i> -15% vs mes anterior
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="kpi-card kpi-warning">
              <div className="kpi-icon">
                <i className="bi bi-clock-history"></i>
              </div>
              <div className="kpi-content">
                <h6>Tiempo Promedio</h6>
                <h2>{stats.avgResponseTime}h</h2>
                <p className="text-success">
                  <i className="bi bi-arrow-down"></i> -3h vs mes anterior
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="row g-4 mb-4">
          {/* Tendencia Mensual */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-bottom py-3">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-bar-chart text-danger me-2"></i>
                  Tendencia de Solicitudes
                </h5>
              </div>
              <div className="card-body">
                <div className="chart-container">
                  {monthlyData.map((data, index) => (
                    <div key={index} className="chart-bar-group">
                      <div className="chart-bars">
                        <div 
                          className="chart-bar bar-approved" 
                          style={{ height: `${(data.approved / 20) * 100}%` }}
                          title={`Aprobadas: ${data.approved}`}
                        >
                          <span className="bar-value">{data.approved}</span>
                        </div>
                        <div 
                          className="chart-bar bar-rejected" 
                          style={{ height: `${(data.rejected / 20) * 100}%` }}
                          title={`Rechazadas: ${data.rejected}`}
                        >
                          <span className="bar-value">{data.rejected}</span>
                        </div>
                      </div>
                      <div className="chart-label">{data.month}</div>
                    </div>
                  ))}
                </div>
                <div className="chart-legend mt-4">
                  <div className="legend-item">
                    <span className="legend-color bg-success"></span>
                    <span>Aprobadas</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color bg-danger"></span>
                    <span>Rechazadas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tasa de Aprobación */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-bottom py-3">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-pie-chart text-danger me-2"></i>
                  Tasa de Aprobación
                </h5>
              </div>
              <div className="card-body text-center">
                <div className="approval-rate-circle">
                  <svg width="200" height="200" viewBox="0 0 200 200">
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="20"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#CC0000"
                      strokeWidth="20"
                      strokeDasharray={`${2 * Math.PI * 80 * (stats.approvalRate / 100)} ${2 * Math.PI * 80}`}
                      strokeDashoffset={`${2 * Math.PI * 80 * 0.25}`}
                      transform="rotate(-90 100 100)"
                      strokeLinecap="round"
                    />
                    <text x="100" y="95" textAnchor="middle" fontSize="36" fontWeight="bold" fill="#111827">
                      {stats.approvalRate}%
                    </text>
                    <text x="100" y="115" textAnchor="middle" fontSize="14" fill="#6B7280">
                      Aprobación
                    </text>
                  </svg>
                </div>
                <div className="mt-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Aprobadas:</span>
                    <strong className="text-success">{stats.approved}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Rechazadas:</span>
                    <strong className="text-danger">{stats.rejected}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Pendientes:</span>
                    <strong className="text-warning">{stats.pending}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tables Section */}
        <div className="row g-4 mb-4">
          {/* Por Departamento */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-bottom py-3">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-building text-danger me-2"></i>
                  Por Departamento
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Departamento</th>
                        <th className="text-center">Total</th>
                        <th className="text-center">Aprobadas</th>
                        <th className="text-center">Pendientes</th>
                        <th className="text-center">Rechazadas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departmentData.map((dept, index) => (
                        <tr key={index}>
                          <td className="fw-semibold">{dept.name}</td>
                          <td className="text-center">
                            <span className="badge bg-primary">{dept.total}</span>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-success">{dept.approved}</span>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-warning">{dept.pending}</span>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-danger">{dept.rejected}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Motivos Principales */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-bottom py-3">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-list-check text-danger me-2"></i>
                  Motivos Principales
                </h5>
              </div>
              <div className="card-body">
                {topReasons.map((item, index) => (
                  <div key={index} className="reason-item mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-semibold">{item.reason}</span>
                      <span className="text-muted">{item.count} solicitudes</span>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div 
                        className="progress-bar bg-danger"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <small className="text-muted">{item.percentage}% del total</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Reports;