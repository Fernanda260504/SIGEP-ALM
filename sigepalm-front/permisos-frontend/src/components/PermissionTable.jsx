import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/PermissionTable.css";

function PermissionTable({
  permisos = [],
  mode = "approval",
  filter = "all",
  searchTerm = "",
  onApprove,
  onReject
}) {

  const [showModal, setShowModal] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [actionType, setActionType] = useState("");
  const [comments, setComments] = useState("");

  const mapStatus = (estado) => {
    if (estado === "PENDIENTE") return "pending";
    if (estado === "APROBADO") return "approved";
    if (estado === "RECHAZADO") return "rejected";
    return "pending";
  };

  // 🔹 Filtro + búsqueda
  const filteredPermissions = permisos.filter((permission) => {

    const status = mapStatus(permission.estado);

    const matchesFilter =
      filter === "all" || status === filter;

    const matchesSearch =
      permission.motivo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.empleado?.nombre?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;

  });

  const handleAction = (permission, action) => {

    setSelectedPermission(permission);
    setActionType(action);
    setShowModal(true);

  };

  const confirmAction = () => {

    if (actionType === "approved") {
      onApprove(selectedPermission.id);
    }

    if (actionType === "rejected") {
      onReject(selectedPermission.id);
    }

    setShowModal(false);
    setComments("");

  };

  const getStatusBadge = (status) => {

    const badges = {
      pending: { bg: "warning", text: "Pendiente" },
      approved: { bg: "success", text: "Aprobado" },
      rejected: { bg: "danger", text: "Rechazado" }
    };

    const badge = badges[status] || badges.pending;

    return (
      <span className={`badge bg-${badge.bg}`}>
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
              <th>Empleado</th>
              <th>Motivo</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Estado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>

            {filteredPermissions.length === 0 ? (

              <tr>
                <td colSpan="6" className="text-center py-5">
                  <i className="bi bi-inbox text-muted" style={{ fontSize: "3rem" }}></i>
                  <p className="text-muted mt-3">
                    No se encontraron solicitudes
                  </p>
                </td>
              </tr>

            ) : (

              filteredPermissions.map((permission) => {

                const status = mapStatus(permission.estado);

                return (

                  <tr key={permission.id}>

                    <td>
                      <div className="employee-info">
                        <i className="bi bi-person-circle me-2"></i>
                        {permission.empleado?.nombre || "Empleado"}
                      </div>
                    </td>

                    <td>{permission.motivo}</td>

                    <td>{permission.fechaInicio}</td>

                    <td>{permission.fechaFin}</td>

                    <td>
                      {getStatusBadge(status)}
                    </td>

                    <td>

                      {status === "pending" && mode === "approval" ? (

                        <div className="d-flex justify-content-center gap-2">

                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleAction(permission, "approved")}
                          >
                            <i className="bi bi-check-lg"></i>
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleAction(permission, "rejected")}
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>

                        </div>

                      ) : (

                        <div className="text-center">
                          <i className="bi bi-eye"></i>
                        </div>

                      )}

                    </td>

                  </tr>

                );

              })

            )}

          </tbody>

        </table>

      </div>

      {/* Modal confirmación */}

      {showModal && (

        <div className="modal-overlay" onClick={() => setShowModal(false)}>

          <div
            className="modal-content-custom"
            onClick={(e) => e.stopPropagation()}
          >

            <h5 className="mb-3">

              {actionType === "approved"
                ? "Aprobar Solicitud"
                : "Rechazar Solicitud"}

            </h5>

            <p>
              <b>Motivo:</b> {selectedPermission?.motivo}
            </p>

            <textarea
              className="form-control"
              placeholder="Comentarios..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />

            <div className="mt-3 d-flex justify-content-end gap-2">

              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>

              <button
                className={`btn ${
                  actionType === "approved"
                    ? "btn-success"
                    : "btn-danger"
                }`}
                onClick={confirmAction}
              >
                Confirmar
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );

}

export default PermissionTable;