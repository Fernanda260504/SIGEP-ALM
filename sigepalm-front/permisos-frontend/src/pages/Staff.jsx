import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Staff.css";

function Staff() {

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar empleados
  useEffect(() => {

    const fetchEmployees = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:8080/api/empleados",{
          method:"GET",
          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
          }
        });

        if(!res.ok){
          console.error("HTTP ERROR:",res.status);
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
          department: "Almacén",
          email: emp.correo || "",
          phone: "N/A",
          availableDays: emp.diasDisponibles || 0,
          totalDays: 15,
          status: "active",
          joinDate: "2024"
        }));

        setEmployees(formatted);

      } catch(error){
        console.error("Error cargando empleados",error);
      } finally{
        setLoading(false);
      }

    };

    fetchEmployees();

  },[]);


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


  const totalAvailableDays = employees.reduce(
    (sum, emp) => sum + (emp.availableDays || 0),
    0
  );

  const totalUsedDays = employees.reduce(
    (sum, emp) => sum + (emp.totalDays - emp.availableDays),
    0
  );


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

          </div>

        </div>


        {/* Stats */}

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
                <h2>{totalAvailableDays}</h2>
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
                <h2>{totalUsedDays}</h2>
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
                <h2>1</h2>
                <p className="text-muted">Almacén</p>
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

                  {filteredEmployees.map(employee => (

                    <tr key={employee.id}>

                      <td>

                        <div className="employee-info">

                          <div className="employee-avatar">
                            <i className="bi bi-person-circle"></i>
                          </div>

                          <div>
                            <div className="fw-semibold">
                              {employee.name}
                            </div>
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

                          <div className="progress" style={{height:"6px"}}>

                            <div
                              className="progress-bar bg-success"
                              style={{
                                width:`${(employee.availableDays/employee.totalDays)*100}%`
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

                        <button
                          className="btn btn-sm btn-info-action"
                          onClick={()=>handleViewDetails(employee)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

        )}


        {/* MODAL */}

        {showModal && selectedEmployee && (

          <div className="modal-overlay" onClick={()=>setShowModal(false)}>

            <div
              className="modal-content-custom"
              onClick={(e)=>e.stopPropagation()}
            >

              <div className="modal-header-custom">

                <h5 className="modal-title">
                  <i className="bi bi-person-badge text-danger me-2"></i>
                  Información del Empleado
                </h5>

                <button
                  className="btn-close-custom"
                  onClick={()=>setShowModal(false)}
                >
                  <i className="bi bi-x-lg"></i>
                </button>

              </div>


              <div className="modal-body-custom">

                <div className="employee-detail-card">

                  <div className="text-center mb-4">

                    <div className="employee-avatar-large">
                      <i className="bi bi-person-circle"></i>
                    </div>

                    <h4 className="fw-bold mt-3 mb-1">
                      {selectedEmployee.name}
                    </h4>

                    <p className="text-muted">
                      {selectedEmployee.position}
                    </p>

                  </div>


                  <div className="detail-grid">

                    <div className="detail-row">
                      <span className="detail-label">ID:</span>
                      <span className="detail-value">
                        {selectedEmployee.employeeId}
                      </span>
                    </div>

                    <div className="detail-row">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">
                        {selectedEmployee.email}
                      </span>
                    </div>

                    <div className="detail-row">
                      <span className="detail-label">Departamento:</span>
                      <span className="detail-value">
                        {selectedEmployee.department}
                      </span>
                    </div>

                    <div className="detail-row">
                      <span className="detail-label">Días disponibles:</span>
                      <span className="detail-value fw-bold text-success">
                        {selectedEmployee.availableDays}/{selectedEmployee.totalDays}
                      </span>
                    </div>

                  </div>

                </div>

              </div>


              <div className="modal-footer-custom">

                <button
                  className="btn btn-secondary"
                  onClick={()=>setShowModal(false)}
                >
                  Cerrar
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