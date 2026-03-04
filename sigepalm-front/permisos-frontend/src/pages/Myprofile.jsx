import { useState } from "react";
import Layout from "../components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/MyProfile.css";

function MyProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [profile, setProfile] = useState({
    // Información Personal
    name: "Juan Pérez",
    employeeId: "EMP-001",
    email: "juan.perez@wurth.com.mx",
    phone: "555-1234-5678",
    birthdate: "1990-05-15",
    address: "Av. Principal #123, Col. Centro",
    city: "Ciudad de México",
    postalCode: "01000",
    
    // Información Laboral
    position: "Operador de Almacén",
    department: "Almacén",
    hireDate: "2023-01-15",
    contractType: "Tiempo Completo",
    shift: "Matutino",
    supervisor: "Carlos Ramírez",
    
    // Días y Permisos
    totalVacationDays: 15,
    usedVacationDays: 3,
    availableVacationDays: 12,
    totalPermissions: 8,
    approvedPermissions: 4,
    pendingPermissions: 3,
    rejectedPermissions: 1
  });

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Aquí iría la lógica para guardar en el backend
    console.log("Guardando perfil:", profile);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Layout role="warehouse">
      <div className="my-profile-container">
        {/* Header */}
        <div className="profile-header mb-4">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div>
              <h1 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                <i className="bi bi-person-circle text-danger"></i>
                Mi Perfil
              </h1>
              <p className="text-muted mb-0">
                Gestiona tu información personal y laboral
              </p>
            </div>
            
            {!isEditing ? (
              <button className="btn btn-wurth-red" onClick={handleEdit}>
                <i className="bi bi-pencil me-2"></i>
                Editar Perfil
              </button>
            ) : (
              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary" onClick={() => setIsEditing(false)}>
                  <i className="bi bi-x-circle me-2"></i>
                  Cancelar
                </button>
                <button className="btn btn-wurth-red" onClick={handleSave}>
                  <i className="bi bi-check-circle me-2"></i>
                  Guardar Cambios
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="row g-4">
          {/* Profile Card */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 profile-card">
              <div className="card-body text-center p-4">
                <div className="profile-avatar-large mb-3">
                  <i className="bi bi-person-circle"></i>
                </div>
                <h4 className="fw-bold mb-1">{profile.name}</h4>
                <p className="text-muted mb-2">{profile.position}</p>
                <span className="badge bg-success-subtle text-success mb-3">
                  <i className="bi bi-check-circle me-1"></i>
                  Activo
                </span>

                <div className="profile-stats">
                  <div className="stat-item">
                    <i className="bi bi-card-text text-danger"></i>
                    <div>
                      <small className="text-muted d-block">ID Empleado</small>
                      <strong>{profile.employeeId}</strong>
                    </div>
                  </div>
                  
                  <div className="stat-item">
                    <i className="bi bi-building text-danger"></i>
                    <div>
                      <small className="text-muted d-block">Departamento</small>
                      <strong>{profile.department}</strong>
                    </div>
                  </div>

                  <div className="stat-item">
                    <i className="bi bi-calendar-event text-danger"></i>
                    <div>
                      <small className="text-muted d-block">Antigüedad</small>
                      <strong>1 año 2 meses</strong>
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                <button 
                  className="btn btn-outline-danger w-100 mb-2"
                  onClick={() => setShowChangePassword(!showChangePassword)}
                >
                  <i className="bi bi-key me-2"></i>
                  Cambiar Contraseña
                </button>

                {showChangePassword && (
                  <div className="change-password-form mt-3 text-start">
                    <div className="mb-3">
                      <label className="form-label small">Contraseña Actual</label>
                      <input type="password" className="form-control form-control-sm" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small">Nueva Contraseña</label>
                      <input type="password" className="form-control form-control-sm" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small">Confirmar Contraseña</label>
                      <input type="password" className="form-control form-control-sm" />
                    </div>
                    <button className="btn btn-wurth-red btn-sm w-100">
                      Actualizar Contraseña
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Vacation Days Card */}
            <div className="card shadow-sm border-0 mt-4">
              <div className="card-header bg-white border-bottom py-3">
                <h6 className="mb-0 fw-bold">
                  <i className="bi bi-calendar-check text-danger me-2"></i>
                  Días de Vacaciones
                </h6>
              </div>
              <div className="card-body">
                <div className="vacation-progress mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-semibold">Disponibles</span>
                    <span className="fw-bold text-success">
                      {profile.availableVacationDays}/{profile.totalVacationDays}
                    </span>
                  </div>
                  <div className="progress" style={{ height: "10px" }}>
                    <div 
                      className="progress-bar bg-success"
                      style={{ width: `${(profile.availableVacationDays / profile.totalVacationDays) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="vacation-stats">
                  <div className="d-flex justify-content-between py-2 border-bottom">
                    <span className="text-muted small">Utilizados</span>
                    <strong className="text-danger">{profile.usedVacationDays}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-2">
                    <span className="text-muted small">Disponibles</span>
                    <strong className="text-success">{profile.availableVacationDays}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0">
              {/* Tabs */}
              <div className="card-header bg-white border-bottom p-0">
                <div className="profile-tabs">
                  <button
                    className={`profile-tab ${activeTab === 'personal' ? 'active' : ''}`}
                    onClick={() => setActiveTab('personal')}
                  >
                    <i className="bi bi-person me-2"></i>
                    Información Personal
                  </button>
                  <button
                    className={`profile-tab ${activeTab === 'work' ? 'active' : ''}`}
                    onClick={() => setActiveTab('work')}
                  >
                    <i className="bi bi-briefcase me-2"></i>
                    Información Laboral
                  </button>
                  <button
                    className={`profile-tab ${activeTab === 'permissions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('permissions')}
                  >
                    <i className="bi bi-file-text me-2"></i>
                    Estadísticas
                  </button>
                </div>
              </div>

              <div className="card-body p-4">
                {/* Personal Info Tab */}
                {activeTab === 'personal' && (
                  <div className="info-section">
                    <h5 className="section-title mb-4">Información Personal</h5>
                    
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Nombre Completo</label>
                        <input
                          type="text"
                          className="form-control"
                          value={profile.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Fecha de Nacimiento</label>
                        <input
                          type="date"
                          className="form-control"
                          value={profile.birthdate}
                          onChange={(e) => handleChange('birthdate', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={profile.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Teléfono</label>
                        <input
                          type="tel"
                          className="form-control"
                          value={profile.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">Dirección</label>
                        <input
                          type="text"
                          className="form-control"
                          value={profile.address}
                          onChange={(e) => handleChange('address', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Ciudad</label>
                        <input
                          type="text"
                          className="form-control"
                          value={profile.city}
                          onChange={(e) => handleChange('city', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Código Postal</label>
                        <input
                          type="text"
                          className="form-control"
                          value={profile.postalCode}
                          onChange={(e) => handleChange('postalCode', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Work Info Tab */}
                {activeTab === 'work' && (
                  <div className="info-section">
                    <h5 className="section-title mb-4">Información Laboral</h5>
                    
                    <div className="info-grid">
                      <div className="info-row">
                        <span className="info-label">
                          <i className="bi bi-briefcase me-2"></i>
                          Puesto:
                        </span>
                        <span className="info-value">{profile.position}</span>
                      </div>

                      <div className="info-row">
                        <span className="info-label">
                          <i className="bi bi-building me-2"></i>
                          Departamento:
                        </span>
                        <span className="info-value">{profile.department}</span>
                      </div>

                      <div className="info-row">
                        <span className="info-label">
                          <i className="bi bi-calendar-event me-2"></i>
                          Fecha de Ingreso:
                        </span>
                        <span className="info-value">{profile.hireDate}</span>
                      </div>

                      <div className="info-row">
                        <span className="info-label">
                          <i className="bi bi-file-earmark-text me-2"></i>
                          Tipo de Contrato:
                        </span>
                        <span className="info-value">{profile.contractType}</span>
                      </div>

                      <div className="info-row">
                        <span className="info-label">
                          <i className="bi bi-clock me-2"></i>
                          Turno:
                        </span>
                        <span className="info-value">{profile.shift}</span>
                      </div>

                      <div className="info-row">
                        <span className="info-label">
                          <i className="bi bi-person-badge me-2"></i>
                          Supervisor:
                        </span>
                        <span className="info-value">{profile.supervisor}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Permissions Stats Tab */}
                {activeTab === 'permissions' && (
                  <div className="info-section">
                    <h5 className="section-title mb-4">Estadísticas de Permisos</h5>
                    
                    <div className="stats-grid">
                      <div className="stat-box stat-total">
                        <div className="stat-icon">
                          <i className="bi bi-file-earmark-text"></i>
                        </div>
                        <div className="stat-content">
                          <h3>{profile.totalPermissions}</h3>
                          <p>Total Solicitudes</p>
                        </div>
                      </div>

                      <div className="stat-box stat-approved">
                        <div className="stat-icon">
                          <i className="bi bi-check-circle"></i>
                        </div>
                        <div className="stat-content">
                          <h3>{profile.approvedPermissions}</h3>
                          <p>Aprobadas</p>
                        </div>
                      </div>

                      <div className="stat-box stat-pending">
                        <div className="stat-icon">
                          <i className="bi bi-hourglass-split"></i>
                        </div>
                        <div className="stat-content">
                          <h3>{profile.pendingPermissions}</h3>
                          <p>Pendientes</p>
                        </div>
                      </div>

                      <div className="stat-box stat-rejected">
                        <div className="stat-icon">
                          <i className="bi bi-x-circle"></i>
                        </div>
                        <div className="stat-content">
                          <h3>{profile.rejectedPermissions}</h3>
                          <p>Rechazadas</p>
                        </div>
                      </div>
                    </div>

                    <div className="approval-rate-section mt-4">
                      <h6 className="fw-bold mb-3">Tasa de Aprobación</h6>
                      <div className="d-flex align-items-center gap-3">
                        <div className="approval-circle">
                          <span className="percentage">
                            {Math.round((profile.approvedPermissions / profile.totalPermissions) * 100)}%
                          </span>
                        </div>
                        <div>
                          <p className="mb-1 text-muted small">
                            {profile.approvedPermissions} de {profile.totalPermissions} solicitudes aprobadas
                          </p>
                          <p className="mb-0 text-success fw-semibold">
                            <i className="bi bi-arrow-up me-1"></i>
                            Buen historial
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default MyProfile;