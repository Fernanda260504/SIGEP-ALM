import { useState } from "react";
import Layout from "../components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Staff.css";

function Staff() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const employees = [
    {
      id: 1,
      name: "Carlos Martínez",
      employeeId: "EMP-001",
      position: "Operador de Almacén",
      department: "Almacén",
      email: "carlos.martinez@wurth.com.mx",
      phone: "555-1234",
      availableDays: 10,
      totalDays: 15,
      status: "active",
      joinDate: "2023-01-15"
    },
    {
      id: 2,
      name: "Ana Rodríguez",
      employeeId: "EMP-002",
      position: "Supervisora",
      department: "Almacén",
      email: "ana.rodriguez@wurth.com.mx",
      phone: "555-5678",
      availableDays: 8,
      totalDays: 15,
      status: "active",
      joinDate: "2022-06-10"
    },
    {
      id: 3,
      name: "Miguel Torres",
      employeeId: "EMP-003",
      position: "Coordinador",
      department: "Logística",
      email: "miguel.torres@wurth.com.mx",
      phone: "555-9012",
      availableDays: 12,
      totalDays: 15,
      status: "active",
      joinDate: "2021-03-22"
    },
    {
      id: 4,
      name: "Laura Sánchez",
      employeeId: "EMP-004",
      position: "Auxiliar",
      department: "Administración",
      email: "laura.sanchez@wurth.com.mx",
      phone: "555-3456",
      availableDays: 15,
      totalDays: 15,
      status: "active",
      joinDate: "2023-08-05"
    },
    {
      id: 5,
      name: "Roberto Gómez",
      employeeId: "EMP-005",
      position: "Operador",
      department: "Almacén",
      email: "roberto.gomez@wurth.com.mx",
      phone: "555-7890",
      availableDays: 5,
      totalDays: 15,
      status: "active",
      joinDate: "2022-11-18"
    }
  ];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === "all" || emp.department === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  return (
    <Layout role="manager">
      <div className="staff-container">
        {/* Header */}
        <div className="staff-header mb-4">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div>
              <h1 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                <i className="bi bi-people text-danger"></i>
                Gestión de Personal
              </h1>
              <p className="text-muted mb-0">
                Administra la información y días disponibles del personal
              </p>
            </div>
            
            <button className="btn btn-wurth-red">
              <i className="bi bi-person-plus me-2"></i>
              Agregar Empleado
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card stat-primary">
              <div className="stat-icon">
                <i className="bi bi-people-fill"></i>
              </div>
              <div className="stat-content">
                <h6>Total Empleados</h6>
                <h2>{employees.length}</h2>
                <p className="text-muted">Activos</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card stat-success">
              <div className="stat-icon">
                <i className="bi bi-calendar-check"></i>
              </div>
              <div className="stat-content">
                <h6>Días Disponibles</h6>
                <h2>50</h2>
                <p className="text-muted">Total acumulado</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card stat-warning">
              <div className="stat-icon">
                <i className="bi bi-calendar-x"></i>
              </div>
              <div className="stat-content">
                <h6>Días Utilizados</h6>
                <h2>25</h2>
                <p className="text-muted">Este periodo</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card stat-info">
              <div className="stat-icon">
                <i className="bi bi-building"></i>
              </div>
              <div className="stat-content">
                <h6>Departamentos</h6>
                <h2>3</h2>
                <p className="text-muted">Activos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
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
                    placeholder="Buscar por nombre, ID o puesto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-12 col-md-3">
                <select 
                  className="form-select"
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                >
                  <option value="all">Todos los Departamentos</option>
                  <option value="Almacén">Almacén</option>
                  <option value="Logística">Logística</option>
                  <option value="Administración">Administración</option>
                </select>
              </div>

              <div className="col-12 col-md-3">
                <button className="btn btn-outline-danger w-100">
                  <i className="bi bi-funnel me-2"></i>
                  Más Filtros
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Table */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white border-bottom py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-list-ul text-danger me-2"></i>
                Listado de Personal
              </h5>
              <span className="badge bg-danger-subtle text-danger">
                {filteredEmployees.length} empleados
              </span>
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
                    <th>Días Disponibles</th>
                    <th>Estado</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <td>
                        <div className="employee-info">
                          <div className="employee-avatar">
                            <i className="bi bi-person-circle"></i>
                          </div>
                          <div>
                            <div className="fw-semibold">{employee.name}</div>
                            <small className="text-muted">Desde {employee.joinDate}</small>
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
                        <div className="contact-info">
                          <div>
                            <i className="bi bi-envelope me-1"></i>
                            <small>{employee.email}</small>
                          </div>
                          <div>
                            <i className="bi bi-telephone me-1"></i>
                            <small>{employee.phone}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="days-progress">
                          <div className="d-flex justify-content-between mb-1">
                            <small className="fw-semibold">
                              {employee.availableDays}/{employee.totalDays}
                            </small>
                            <small className="text-muted">
                              {Math.round((employee.availableDays / employee.totalDays) * 100)}%
                            </small>
                          </div>
                          <div className="progress" style={{ height: "6px" }}>
                            <div 
                              className={`progress-bar ${
                                employee.availableDays > 10 ? 'bg-success' :
                                employee.availableDays > 5 ? 'bg-warning' : 'bg-danger'
                              }`}
                              style={{ width: `${(employee.availableDays / employee.totalDays) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-success-subtle text-success">
                          <i className="bi bi-check-circle me-1"></i>
                          Activo
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-info-action"
                            onClick={() => handleViewDetails(employee)}
                            title="Ver detalles"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-edit-action"
                            title="Editar"
                          >
                            <i className="bi bi-pencil"></i>
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

        {/* Employee Detail Modal */}
        {showModal && selectedEmployee && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-custom">
                <h5 className="modal-title">
                  <i className="bi bi-person-badge text-danger me-2"></i>
                  Información del Empleado
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
                    <span className="badge bg-success-subtle text-success">
                      <i className="bi bi-check-circle me-1"></i>
                      Activo
                    </span>
                  </div>

                  <div className="detail-grid">
                    <div className="detail-row">
                      <span className="detail-label">
                        <i className="bi bi-card-text me-2"></i>
                        ID Empleado:
                      </span>
                      <span className="detail-value">{selectedEmployee.employeeId}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">
                        <i className="bi bi-building me-2"></i>
                        Departamento:
                      </span>
                      <span className="detail-value">{selectedEmployee.department}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">
                        <i className="bi bi-envelope me-2"></i>
                        Email:
                      </span>
                      <span className="detail-value">{selectedEmployee.email}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">
                        <i className="bi bi-telephone me-2"></i>
                        Teléfono:
                      </span>
                      <span className="detail-value">{selectedEmployee.phone}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">
                        <i className="bi bi-calendar-event me-2"></i>
                        Fecha de Ingreso:
                      </span>
                      <span className="detail-value">{selectedEmployee.joinDate}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">
                        <i className="bi bi-calendar-check me-2"></i>
                        Días Disponibles:
                      </span>
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
                <button className="btn btn-wurth-red">
                  <i className="bi bi-pencil me-2"></i>
                  Editar Empleado
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