import { useState } from "react";
import Layout from "../components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Setting.css";

function Settings() {
  const [activeSection, setActiveSection] = useState("general");
  const [settings, setSettings] = useState({
    // General
    companyName: "Würth México",
    workingDays: 5,
    vacationDays: 15,
    maxPendingDays: 30,
    
    // Notificaciones
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    notifyOnApproval: true,
    notifyOnRejection: true,
    notifyPendingRequests: true,
    
    // Permisos
    requireDocument: false,
    autoApproval: false,
    maxConsecutiveDays: 10,
    advanceNoticeDays: 2,
    
    // Sistema
    language: "es",
    timezone: "America/Mexico_City",
    dateFormat: "DD/MM/YYYY",
    backupFrequency: "daily"
  });

  const [showSaveMessage, setShowSaveMessage] = useState(false);

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Aquí iría la lógica para guardar en el backend
    console.log("Guardando configuración:", settings);
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 3000);
  };

  const sections = [
    { id: "general", icon: "gear", label: "General" },
    { id: "notifications", icon: "bell", label: "Notificaciones" },
    { id: "permissions", icon: "shield-check", label: "Permisos" },
    { id: "system", icon: "server", label: "Sistema" }
  ];

  return (
    <Layout role="manager">
      <div className="settings-container">
        {/* Header */}
        <div className="settings-header mb-4">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div>
              <h1 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                <i className="bi bi-gear text-danger"></i>
                Configuración del Sistema
              </h1>
              <p className="text-muted mb-0">
                Administra las preferencias y parámetros del sistema
              </p>
            </div>
            
            {showSaveMessage && (
              <div className="alert alert-success mb-0">
                <i className="bi bi-check-circle me-2"></i>
                Configuración guardada exitosamente
              </div>
            )}
          </div>
        </div>

        <div className="row g-4">
          {/* Sidebar Menu */}
          <div className="col-lg-3">
            <div className="card shadow-sm border-0 settings-menu">
              <div className="card-body p-3">
                <nav className="settings-nav">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      className={`settings-nav-item ${activeSection === section.id ? 'active' : ''}`}
                      onClick={() => setActiveSection(section.id)}
                    >
                      <i className={`bi bi-${section.icon}`}></i>
                      <span>{section.label}</span>
                      <i className="bi bi-chevron-right arrow"></i>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="col-lg-9">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                {/* General Settings */}
                {activeSection === "general" && (
                  <div className="settings-section">
                    <h4 className="section-title">
                      <i className="bi bi-gear-fill text-danger me-2"></i>
                      Configuración General
                    </h4>
                    <p className="text-muted mb-4">Parámetros básicos del sistema</p>

                    <div className="settings-group">
                      <label className="form-label fw-semibold">Nombre de la Empresa</label>
                      <input
                        type="text"
                        className="form-control"
                        value={settings.companyName}
                        onChange={(e) => handleChange("companyName", e.target.value)}
                      />
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="settings-group">
                          <label className="form-label fw-semibold">Días Laborales por Semana</label>
                          <select
                            className="form-select"
                            value={settings.workingDays}
                            onChange={(e) => handleChange("workingDays", parseInt(e.target.value))}
                          >
                            <option value="5">5 días</option>
                            <option value="6">6 días</option>
                            <option value="7">7 días</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="settings-group">
                          <label className="form-label fw-semibold">Días de Vacaciones Anuales</label>
                          <input
                            type="number"
                            className="form-control"
                            value={settings.vacationDays}
                            onChange={(e) => handleChange("vacationDays", parseInt(e.target.value))}
                            min="6"
                            max="30"
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="settings-group">
                          <label className="form-label fw-semibold">Días Máximos Pendientes</label>
                          <input
                            type="number"
                            className="form-control"
                            value={settings.maxPendingDays}
                            onChange={(e) => handleChange("maxPendingDays", parseInt(e.target.value))}
                            min="15"
                            max="60"
                          />
                          <small className="form-text text-muted">
                            Días máximos que puede acumular un empleado
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Settings */}
                {activeSection === "notifications" && (
                  <div className="settings-section">
                    <h4 className="section-title">
                      <i className="bi bi-bell-fill text-danger me-2"></i>
                      Notificaciones
                    </h4>
                    <p className="text-muted mb-4">Configura cómo y cuándo recibir notificaciones</p>

                    <div className="notification-group">
                      <h6 className="fw-semibold mb-3">Canales de Notificación</h6>
                      
                      <div className="form-check form-switch mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="emailNotifications"
                          checked={settings.emailNotifications}
                          onChange={(e) => handleChange("emailNotifications", e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="emailNotifications">
                          <i className="bi bi-envelope me-2"></i>
                          Notificaciones por Email
                        </label>
                      </div>

                      <div className="form-check form-switch mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="smsNotifications"
                          checked={settings.smsNotifications}
                          onChange={(e) => handleChange("smsNotifications", e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="smsNotifications">
                          <i className="bi bi-phone me-2"></i>
                          Notificaciones por SMS
                        </label>
                      </div>

                      <div className="form-check form-switch mb-4">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="pushNotifications"
                          checked={settings.pushNotifications}
                          onChange={(e) => handleChange("pushNotifications", e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="pushNotifications">
                          <i className="bi bi-app-indicator me-2"></i>
                          Notificaciones Push
                        </label>
                      </div>

                      <hr className="my-4" />

                      <h6 className="fw-semibold mb-3">Eventos a Notificar</h6>

                      <div className="form-check form-switch mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="notifyOnApproval"
                          checked={settings.notifyOnApproval}
                          onChange={(e) => handleChange("notifyOnApproval", e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="notifyOnApproval">
                          Permisos Aprobados
                        </label>
                      </div>

                      <div className="form-check form-switch mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="notifyOnRejection"
                          checked={settings.notifyOnRejection}
                          onChange={(e) => handleChange("notifyOnRejection", e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="notifyOnRejection">
                          Permisos Rechazados
                        </label>
                      </div>

                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="notifyPendingRequests"
                          checked={settings.notifyPendingRequests}
                          onChange={(e) => handleChange("notifyPendingRequests", e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="notifyPendingRequests">
                          Nuevas Solicitudes Pendientes
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Permissions Settings */}
                {activeSection === "permissions" && (
                  <div className="settings-section">
                    <h4 className="section-title">
                      <i className="bi bi-shield-check text-danger me-2"></i>
                      Reglas de Permisos
                    </h4>
                    <p className="text-muted mb-4">Configura las políticas de solicitud de permisos</p>

                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="requireDocument"
                        checked={settings.requireDocument}
                        onChange={(e) => handleChange("requireDocument", e.target.checked)}
                      />
                      <label className="form-check-label fw-semibold" htmlFor="requireDocument">
                        Requerir Documento de Soporte
                      </label>
                      <small className="form-text text-muted d-block">
                        Obligar a los empleados a adjuntar documentación
                      </small>
                    </div>

                    <div className="form-check form-switch mb-4">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="autoApproval"
                        checked={settings.autoApproval}
                        onChange={(e) => handleChange("autoApproval", e.target.checked)}
                      />
                      <label className="form-check-label fw-semibold" htmlFor="autoApproval">
                        Aprobación Automática
                      </label>
                      <small className="form-text text-muted d-block">
                        Aprobar automáticamente solicitudes de menos de 4 horas
                      </small>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="settings-group">
                          <label className="form-label fw-semibold">Días Consecutivos Máximos</label>
                          <input
                            type="number"
                            className="form-control"
                            value={settings.maxConsecutiveDays}
                            onChange={(e) => handleChange("maxConsecutiveDays", parseInt(e.target.value))}
                            min="1"
                            max="30"
                          />
                          <small className="form-text text-muted">
                            Máximo de días consecutivos permitidos
                          </small>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="settings-group">
                          <label className="form-label fw-semibold">Días de Anticipación</label>
                          <input
                            type="number"
                            className="form-control"
                            value={settings.advanceNoticeDays}
                            onChange={(e) => handleChange("advanceNoticeDays", parseInt(e.target.value))}
                            min="1"
                            max="30"
                          />
                          <small className="form-text text-muted">
                            Días mínimos de anticipación para solicitar
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* System Settings */}
                {activeSection === "system" && (
                  <div className="settings-section">
                    <h4 className="section-title">
                      <i className="bi bi-server text-danger me-2"></i>
                      Configuración del Sistema
                    </h4>
                    <p className="text-muted mb-4">Parámetros técnicos y regionales</p>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="settings-group">
                          <label className="form-label fw-semibold">Idioma del Sistema</label>
                          <select
                            className="form-select"
                            value={settings.language}
                            onChange={(e) => handleChange("language", e.target.value)}
                          >
                            <option value="es">Español</option>
                            <option value="en">English</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="settings-group">
                          <label className="form-label fw-semibold">Zona Horaria</label>
                          <select
                            className="form-select"
                            value={settings.timezone}
                            onChange={(e) => handleChange("timezone", e.target.value)}
                          >
                            <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
                            <option value="America/Tijuana">Tijuana (GMT-8)</option>
                            <option value="America/Cancun">Cancún (GMT-5)</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="settings-group">
                          <label className="form-label fw-semibold">Formato de Fecha</label>
                          <select
                            className="form-select"
                            value={settings.dateFormat}
                            onChange={(e) => handleChange("dateFormat", e.target.value)}
                          >
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="settings-group">
                          <label className="form-label fw-semibold">Frecuencia de Respaldo</label>
                          <select
                            className="form-select"
                            value={settings.backupFrequency}
                            onChange={(e) => handleChange("backupFrequency", e.target.value)}
                          >
                            <option value="daily">Diario</option>
                            <option value="weekly">Semanal</option>
                            <option value="monthly">Mensual</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="alert alert-info mt-4">
                      <i className="bi bi-info-circle me-2"></i>
                      <strong>Nota:</strong> Los cambios en la configuración del sistema pueden requerir reiniciar el sistema.
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="d-flex justify-content-end gap-3 mt-4 pt-4 border-top">
                  <button className="btn btn-outline-secondary">
                    <i className="bi bi-x-circle me-2"></i>
                    Cancelar
                  </button>
                  <button className="btn btn-wurth-red" onClick={handleSave}>
                    <i className="bi bi-check-circle me-2"></i>
                    Guardar Cambios
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

export default Settings;