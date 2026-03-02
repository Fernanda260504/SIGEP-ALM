import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/PermissionTable.css";

function PermissionTable({ mode = "approval", filter = "all", searchTerm = "" }) {
  // Datos de ejemplo
  const [permissions, setPermissions] = useState([
    {
      id: 1,
      employee: "Carlos Martínez",
      employeeId: "EMP-001",
      position: "Operador de Almacén",
      type: "Permiso Personal",
      reason: "Cita médica programada",
      startDate: "2026-03-05",
      endDate: "2026-03-05",
      hours: "4 horas",
      status: "pending",
      requestDate: "2026-03-01",
      priority: "medium"
    },
    {
      id: 2,
      employee: "Ana Rodríguez",
      employeeId: "EMP-002",
      position: "Supervisor",
      type: "Vacaciones",
      reason: "Vacaciones familiares",
      startDate: "2026-03-10",
      endDate: "2026-03-15",
      hours: "5 días",
      status: "pending",
      requestDate: "2026-02-28",
      priority: "high"
    },
    {
      id: 3,
      employee: "Miguel Torres",
      employeeId: "EMP-003",
      position: "Coordinador",
      type: "Permiso con Goce",
      reason: "Trámite legal urgente",
      startDate: "2026-03-03",
      endDate: "2026-03-03",
      hours: "8 horas",
      status: "approved",
      requestDate: "2026-02-27",
      priority: "high",
      approvedBy: "Juan Pérez",
      approvedDate: "2026-03-01"
    },
    {
      id: 4,
      employee: "Laura Sánchez",
      employeeId: "EMP-004",
      position: "Auxiliar",
      type: "Incapacidad",
      reason: "Enfermedad general",
      startDate: "2026-03-02",
      endDate: "2026-03-04",
      hours: "3 días",
      status: "approved",
      requestDate: "2026-03-01",
      priority: "high",
      approvedBy: "Juan Pérez",
      approvedDate: "2026-03-01"
    },
    {
      id: 5,
      employee: "Roberto Gómez",
      employeeId: "EMP-005",
      position: "Operador",
      type: "Permiso Personal",
      reason: "Asunto familiar",
      startDate: "2026-03-08",
      endDate: "2026-03-08",
      hours: "2 horas",
      status: "pending",
      requestDate: "2026-03-01",
      priority: "low"
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [actionType, setActionType] = useState("");
  const [comments, setComments] = useState("");

  // Filtrar permisos
  const filteredPermissions = permissions.filter(permission => {
    const matchesFilter = filter === "all" || permission.status === filter;
    const matchesSearch = 
      permission.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleAction = (permission, action) => {
    setSelectedPermission(permission);
    setActionType(action);
    setShowModal(true);
  };

  const confirmAction = () => {
    setPermissions(permissions.map(p => 
      p.id === selectedPermission.id 
        ? { 
            ...p, 
            status: actionType,
            approvedBy: "Juan Pérez",
            approvedDate: new Date().toISOString().split('T')[0],
            comments: comments
          }
        : p
    ));
    setShowModal(false);
    setComments("");
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: "warning", icon: "hourglass-split", text: "Pendiente" },
      approved: { bg: "success", icon: "check-circle", text: "Aprobado" },
      rejected: { bg: "danger", icon: "x-circle", text: "Rechazado" }
    };
    const badge = badges[status] || badges.pending;
    
    return (
      <span className={`badge badge-${badge.bg}`}>
        <i className={`bi bi-${badge.icon} me-1`}></i>
        {badge.text}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: { color: "danger", text: "Alta" },
      medium: { color: "warning", text: "Media" },
      low: { color: "info", text: "Baja" }
    };
    const badge = badges[priority] || badges.medium;
    
    return (
      <span className={`badge bg-${badge.color}-subtle text-${badge.color} priority-badge`}>
        {badge.text}
      </span>
    );
  };

  return (
    <>
      <div className="table-responsive">
        <table className="table table-hover permission-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" className="form-check-input" />
              </th>
              <th>Empleado</th>
              <th>Tipo de Permiso</th>
              <th>Motivo</th>
              <th>Fecha</th>
              <th>Duración</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPermissions.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-5">
                  <i className="bi bi-inbox text-muted" style={{ fontSize: "3rem" }}></i>
                  <p className="text-muted mt-3">No se encontraron solicitudes</p>
                </td>
              </tr>
            ) : (
              filteredPermissions.map((permission) => (
                <tr key={permission.id} className="permission-row">
                  <td>
                    <input type="checkbox" className="form-check-input" />
                  </td>
                  <td>
                    <div className="employee-info">
                      <div className="employee-avatar">
                        <i className="bi bi-person-circle"></i>
                      </div>
                      <div>
                        <div className="fw-semibold text-dark">{permission.employee}</div>
                        <small className="text-muted">{permission.position}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="permission-type">
                      {permission.type}
                    </span>
                  </td>
                  <td>
                    <div className="reason-cell">
                      {permission.reason}
                    </div>
                  </td>
                  <td>
                    <div className="date-info">
                      <i className="bi bi-calendar3 me-1"></i>
                      <small>{permission.startDate}</small>
                    </div>
                  </td>
                  <td>
                    <span className="duration-badge">
                      <i className="bi bi-clock me-1"></i>
                      {permission.hours}
                    </span>
                  </td>
                  <td>
                    {getPriorityBadge(permission.priority)}
                  </td>
                  <td>
                    {getStatusBadge(permission.status)}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {permission.status === "pending" && mode === "approval" ? (
                        <>
                          <button
                            className="btn btn-sm btn-success-action"
                            onClick={() => handleAction(permission, "approved")}
                            title="Aprobar"
                          >
                            <i className="bi bi-check-lg"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-danger-action"
                            onClick={() => handleAction(permission, "rejected")}
                            title="Rechazar"
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-sm btn-info-action"
                          title="Ver detalles"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Confirmación */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h5 className="modal-title">
                {actionType === "approved" ? (
                  <>
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Aprobar Solicitud
                  </>
                ) : (
                  <>
                    <i className="bi bi-x-circle text-danger me-2"></i>
                    Rechazar Solicitud
                  </>
                )}
              </h5>
              <button className="btn-close-custom" onClick={() => setShowModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="modal-body-custom">
              <div className="employee-detail-card">
                <h6 className="fw-bold mb-3">Detalle de la Solicitud</h6>
                <div className="detail-row">
                  <span className="detail-label">Empleado:</span>
                  <span className="detail-value">{selectedPermission?.employee}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Tipo:</span>
                  <span className="detail-value">{selectedPermission?.type}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Motivo:</span>
                  <span className="detail-value">{selectedPermission?.reason}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Duración:</span>
                  <span className="detail-value">{selectedPermission?.hours}</span>
                </div>
              </div>

              <div className="form-group mt-3">
                <label className="form-label fw-semibold">
                  Comentarios {actionType === "rejected" && <span className="text-danger">*</span>}
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder={`Agregar comentarios sobre ${actionType === "approved" ? "la aprobación" : "el rechazo"}...`}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer-custom">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className={`btn ${actionType === "approved" ? "btn-success" : "btn-danger"}`}
                onClick={confirmAction}
              >
                {actionType === "approved" ? "Aprobar" : "Rechazar"} Solicitud
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PermissionTable;