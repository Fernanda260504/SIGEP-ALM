import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Staff.css";

function Staff() {

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔔 ALERTA INLINE
  const [alert, setAlert] = useState(null);
  // alert = { message: "", type: "success" | "danger" | "warning" | "info" }

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const alertIcons = {
    success: "bi-check-circle-fill",
    danger:  "bi-x-circle-fill",
    warning: "bi-exclamation-triangle-fill",
    info:    "bi-info-circle-fill"
  };

  const alertTitles = {
    success: "Exito",
    danger:  "Error",
    warning: "Advertencia",
    info:    "Informacion"
  };

  const [newEmployee, setNewEmployee] = useState({
    nombre: "",
    correo: "",
    password: "",
    tipo: "ALMACENISTA"
  });

  const [editEmployee, setEditEmployee] = useState({
    nombre: "",
    correo: "",
    tipo: "ALMACENISTA"
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/empleados", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          console.error("HTTP ERROR:", res.status);
          showAlert("Error al cargar empleados", "danger");
          setLoading(false);
          return;
        }

        const response = await res.json();

        const empleados = (response.data || []).filter(
          emp => emp.rol?.nombre === "ALMACENISTA" || emp.tipo === "ALMACENISTA"
        );

        const formatted = empleados.map(emp => ({
          id: emp.id,
          name: emp.nombre || "",
          employeeId: "EMP-" + emp.id,
          position: emp.tipo || "ALMACENISTA",
          department: "Almacen",
          email: emp.correo || "",
          phone: "N/A",
          availableDays: emp.diasDisponibles || 0,
          totalDays: 15,
          status: "active",
          joinDate: "2024"
        }));

        setEmployees(formatted);

      } catch (error) {
        console.error("Error cargando empleados", error);
        showAlert("Error de conexion al servidor", "danger");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);


  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      (emp.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.employeeId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.position || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      filterDepartment === "all" || emp.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });


  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleOpenEdit = (employee) => {
    setSelectedEmployee(employee);
    setEditEmployee({
      nombre: employee.name,
      correo: employee.email,
      tipo: employee.position
    });
    setShowEditModal(true);
  };

  const handleEditEmployee = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/auth/empleado/${selectedEmployee.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: editEmployee.nombre,
          correo: editEmployee.correo,
          tipo: editEmployee.tipo
        })
      });

      const text = await res.text();
      if (!res.ok) {
        showAlert(text || "Error al actualizar empleado", "danger");
        return;
      }

      setShowEditModal(false);
      showAlert(`Empleado "${editEmployee.nombre}" actualizado correctamente`, "success");
      window.location.reload();
    } catch (error) {
      console.error(error);
      showAlert("Error de conexion al servidor", "danger");
    }
  };

  const handleOpenDelete = (employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  };

  const handleDeleteEmployee = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/auth/empleado/${selectedEmployee.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const text = await res.text();
        showAlert(text || "Error al eliminar empleado", "danger");
        return;
      }

      setShowDeleteModal(false);
      showAlert(`Empleado "${selectedEmployee.name}" eliminado correctamente`, "success");
      window.location.reload();
    } catch (error) {
      console.error(error);
      showAlert("Error de conexion al servidor", "danger");
    }
  };

  const handleAddEmployee = async () => {
    try {
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: newEmployee.nombre,
          correo: newEmployee.correo,
          password: newEmployee.password,
          role: "ALMACENISTA",
          tipo: newEmployee.tipo
        })
      });

      const text = await res.text();
      if (!res.ok) {
        showAlert(text || "Error al crear empleado", "danger");
        return;
      }

      setShowAddModal(false);
      showAlert(`Empleado "${newEmployee.nombre}" creado correctamente`, "success");
      window.location.reload();
    } catch (error) {
      console.error(error);
      showAlert("Error de conexion al servidor", "danger");
    }
  };

  const totalAvailableDays = employees.reduce((sum, emp) => sum + (emp.availableDays || 0), 0);
  const totalUsedDays = employees.reduce((sum, emp) => sum + (emp.totalDays - emp.availableDays), 0);


  return (
    <Layout role="manager">
      <div className="staff-container">

        {/* Header */}
        <div className="staff-header mb-4">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div>
              <h1 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                <i className="bi bi-people text-danger"></i>
                Gestion de Personal
              </h1>
              <p className="text-muted mb-0">
                Administra la informacion y dias disponibles del personal
              </p>
            </div>
          </div>
        </div>

        {/* 🔔 ALERTA BOOTSTRAP INLINE */}
        {alert && (
          <div
            className={`alert alert-${alert.type} alert-dismissible d-flex align-items-center gap-3 shadow-sm mb-4`}
            role="alert"
            style={{ borderRadius: "12px", padding: "16px 20px" }}
          >
            <i className={`bi ${alertIcons[alert.type]} fs-4 flex-shrink-0`}></i>
            <div className="flex-grow-1">
              <strong>{alertTitles[alert.type]}: </strong>
              {alert.message}
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={() => setAlert(null)}
            ></button>
          </div>
        )}

        {/* Stats */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card stat-primary">
              <div className="stat-icon"><i className="bi bi-people-fill"></i></div>
              <div className="stat-content">
                <h6>Total Empleados</h6>
                <h2>{employees.length}</h2>
                <p className="text-muted">Activos</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card stat-success">
              <div className="stat-icon"><i className="bi bi-calendar-check"></i></div>
              <div className="stat-content">
                <h6>Dias Disponibles</h6>
                <h2>{totalAvailableDays}</h2>
                <p className="text-muted">Total acumulado</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card stat-warning">
              <div className="stat-icon"><i className="bi bi-calendar-x"></i></div>
              <div className="stat-content">
                <h6>Dias Utilizados</h6>
                <h2>{totalUsedDays}</h2>
                <p className="text-muted">Este periodo</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card stat-info">
              <div className="stat-icon"><i className="bi bi-building"></i></div>
              <div className="stat-content">
                <h6>Departamentos</h6>
                <h2>1</h2>
                <p className="text-muted">Almacen</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center p-5">
            <div className="spinner-border text-danger"></div>
            <p className="mt-3">Cargando empleados...</p>
          </div>
        )}

        {/* Tabla */}
        {!loading && (
          <div className="card shadow-sm border-0">

            <div className="card-header bg-white border-bottom py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-list-ul text-danger me-2"></i>
                  Listado de Personal
                </h5>
                <div className="d-flex align-items-center gap-3">
                  <span className="badge bg-danger-subtle text-danger">
                    {filteredEmployees.length} empleados
                  </span>
                  <button className="btn btn-danger" onClick={() => setShowAddModal(true)}>
                    <i className="bi bi-plus-lg me-2"></i>
                    Agregar
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover employee-table mb-0">
                  <thead>
                    <tr>
                      <th>Empleado</th>
                      <th>ID</th>
                      <th>Puesto</th>
                      <th>Departamento</th>
                      <th>Contacto</th>
                      <th>Dias Disponibles</th>
                      <th>Estado</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map(employee => (
                      <tr key={employee.id}>

                        <td>
                          <div className="employee-info">
                            <div className="employee-avatar">
                              <i className="bi bi-person-circle"></i>
                            </div>
                            <div>
                              <div className="fw-semibold">{employee.name}</div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="badge bg-secondary-subtle text-secondary">
                            {employee.employeeId}
                          </span>
                        </td>

                        <td>{employee.position}</td>

                        <td>
                          <span className="badge bg-primary-subtle text-primary">
                            {employee.department}
                          </span>
                        </td>

                        <td>
                          <i className="bi bi-envelope me-1"></i>
                          <small>{employee.email}</small>
                        </td>

                        <td>
                          <div className="days-progress">
                            <div className="d-flex justify-content-between mb-1">
                              <small className="fw-semibold">
                                {employee.availableDays}/{employee.totalDays}
                              </small>
                            </div>
                            <div className="progress" style={{ height: "6px" }}>
                              <div
                                className="progress-bar bg-success"
                                style={{
                                  width: `${(employee.availableDays / employee.totalDays) * 100}%`
                                }}
                              ></div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="badge bg-success-subtle text-success">
                            Activo
                          </span>
                        </td>

                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              className="btn btn-sm btn-info-action"
                              title="Ver detalles"
                              onClick={() => handleViewDetails(employee)}
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-warning-action"
                              title="Editar"
                              onClick={() => handleOpenEdit(employee)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-danger-action"
                              title="Eliminar"
                              onClick={() => handleOpenDelete(employee)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}


        {/* MODAL VER DETALLES */}
        {showModal && selectedEmployee && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>

              <div className="modal-header-custom">
                <h5 className="modal-title">
                  <i className="bi bi-person-badge text-danger me-2"></i>
                  Informacion del Empleado
                </h5>
                <button className="btn-close-custom" onClick={() => setShowModal(false)}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <div className="modal-body-custom">
                <div className="employee-detail-card">
                  <div className="text-center mb-4">
                    <div className="employee-avatar-large">
                      <i className="bi bi-person-circle"></i>
                    </div>
                    <h4 className="fw-bold mt-3 mb-1">{selectedEmployee.name}</h4>
                    <p className="text-muted">{selectedEmployee.position}</p>
                  </div>
                  <div className="detail-grid">
                    <div className="detail-row">
                      <span className="detail-label">ID:</span>
                      <span className="detail-value">{selectedEmployee.employeeId}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{selectedEmployee.email}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Departamento:</span>
                      <span className="detail-value">{selectedEmployee.department}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Dias disponibles:</span>
                      <span className="detail-value fw-bold text-success">
                        {selectedEmployee.availableDays}/{selectedEmployee.totalDays}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer-custom">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cerrar
                </button>
              </div>

            </div>
          </div>
        )}


        {/* MODAL AGREGAR EMPLEADO */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>

              <div className="modal-header-custom">
                <h5 className="modal-title">
                  <i className="bi bi-person-plus text-danger me-2"></i>
                  Nuevo Empleado
                </h5>
                <button className="btn-close-custom" onClick={() => setShowAddModal(false)}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <div className="modal-body-custom">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Nombre</label>
                  <input
                    className="form-control"
                    placeholder="Nombre completo"
                    value={newEmployee.nombre}
                    onChange={(e) => setNewEmployee({ ...newEmployee, nombre: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Correo</label>
                  <input
                    className="form-control"
                    placeholder="correo@ejemplo.com"
                    value={newEmployee.correo}
                    onChange={(e) => setNewEmployee({ ...newEmployee, correo: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Contrasena</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Contrasena"
                    value={newEmployee.password}
                    onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Tipo</label>
                  <select
                    className="form-control"
                    value={newEmployee.tipo}
                    onChange={(e) => setNewEmployee({ ...newEmployee, tipo: e.target.value })}
                  >
                    <option value="ALMACENISTA">Almacenista</option>
                    <option value="PRACTICANTE">Practicante</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer-custom">
                <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancelar
                </button>
                <button className="btn btn-danger" onClick={handleAddEmployee}>
                  <i className="bi bi-check-lg me-1"></i>
                  Guardar
                </button>
              </div>

            </div>
          </div>
        )}


        {/* MODAL EDITAR EMPLEADO */}
        {showEditModal && selectedEmployee && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>

              <div className="modal-header-custom">
                <h5 className="modal-title">
                  <i className="bi bi-pencil-square text-warning me-2"></i>
                  Editar Empleado
                </h5>
                <button className="btn-close-custom" onClick={() => setShowEditModal(false)}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <div className="modal-body-custom">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Nombre</label>
                  <input
                    className="form-control"
                    placeholder="Nombre completo"
                    value={editEmployee.nombre}
                    onChange={(e) => setEditEmployee({ ...editEmployee, nombre: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Correo</label>
                  <input
                    className="form-control"
                    placeholder="correo@ejemplo.com"
                    value={editEmployee.correo}
                    onChange={(e) => setEditEmployee({ ...editEmployee, correo: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Tipo</label>
                  <select
                    className="form-control"
                    value={editEmployee.tipo}
                    onChange={(e) => setEditEmployee({ ...editEmployee, tipo: e.target.value })}
                  >
                    <option value="ALMACENISTA">Almacenista</option>
                    <option value="PRACTICANTE">Practicante</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer-custom">
                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancelar
                </button>
                <button className="btn btn-warning" onClick={handleEditEmployee}>
                  <i className="bi bi-check-lg me-1"></i>
                  Actualizar
                </button>
              </div>

            </div>
          </div>
        )}


        {/* MODAL CONFIRMAR ELIMINAR */}
        {showDeleteModal && selectedEmployee && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>

              <div className="modal-header-custom">
                <h5 className="modal-title">
                  <i className="bi bi-exclamation-triangle text-danger me-2"></i>
                  Confirmar Eliminacion
                </h5>
                <button className="btn-close-custom" onClick={() => setShowDeleteModal(false)}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <div className="modal-body-custom">
                <div className="text-center py-3">
                  <div className="employee-avatar-large mx-auto mb-3">
                    <i className="bi bi-person-circle"></i>
                  </div>
                  <p className="mb-1">Estas seguro de eliminar al empleado?</p>
                  <h5 className="fw-bold text-danger">{selectedEmployee.name}</h5>
                  <small className="text-muted">{selectedEmployee.employeeId}</small>
                  <div className="alert alert-danger mt-3 text-start">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    Esta accion no se puede deshacer.
                  </div>
                </div>
              </div>

              <div className="modal-footer-custom">
                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancelar
                </button>
                <button className="btn btn-danger" onClick={handleDeleteEmployee}>
                  <i className="bi bi-trash me-1"></i>
                  Eliminar
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}

export default Staff; 