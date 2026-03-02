import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/PermissionForm.css";

function PermissionForm() {
  const [formData, setFormData] = useState({
    type: "",
    reason: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    description: "",
    urgent: false,
    document: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const permissionTypes = [
    { value: "personal", label: "Permiso Personal", icon: "person" },
    { value: "medico", label: "Permiso Médico", icon: "heart-pulse" },
    { value: "legal", label: "Trámite Legal", icon: "file-earmark-text" },
    { value: "familiar", label: "Asunto Familiar", icon: "house-heart" },
    { value: "vacaciones", label: "Vacaciones", icon: "airplane" },
    { value: "otro", label: "Otro Motivo", icon: "three-dots" }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value
    }));
    
    // Limpiar error del campo cuando se modifica
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type) {
      newErrors.type = "Selecciona un tipo de permiso";
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "El motivo es obligatorio";
    }

    if (!formData.startDate) {
      newErrors.startDate = "La fecha de inicio es obligatoria";
    }

    if (!formData.endDate) {
      newErrors.endDate = "La fecha de fin es obligatoria";
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = "La fecha de fin no puede ser anterior a la de inicio";
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = "Proporciona una descripción detallada";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simular envío a API
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aquí iría la llamada real a la API
      console.log("Datos del formulario:", formData);

      setShowSuccess(true);
      
      // Reset form
      setFormData({
        type: "",
        reason: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        description: "",
        urgent: false,
        document: null
      });

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

    } catch (error) {
      console.error("Error al enviar solicitud:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateDuration = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  return (
    <div className="permission-form-container">
      {/* Success Message */}
      {showSuccess && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <div className="d-flex align-items-center">
            <i className="bi bi-check-circle-fill me-2" style={{ fontSize: "1.5rem" }}></i>
            <div>
              <strong>¡Solicitud Enviada!</strong>
              <p className="mb-0 small">Tu solicitud ha sido enviada al gerente para aprobación.</p>
            </div>
          </div>
          <button type="button" className="btn-close" onClick={() => setShowSuccess(false)}></button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Tipo de Permiso */}
        <div className="mb-4">
          <label className="form-label fw-semibold">
            Tipo de Permiso <span className="text-danger">*</span>
          </label>
          <div className="permission-types-grid">
            {permissionTypes.map((type) => (
              <div
                key={type.value}
                className={`permission-type-card ${formData.type === type.value ? "selected" : ""} ${errors.type ? "error" : ""}`}
                onClick={() => handleChange({ target: { name: "type", value: type.value } })}
              >
                <i className={`bi bi-${type.icon}`}></i>
                <span>{type.label}</span>
                {formData.type === type.value && (
                  <i className="bi bi-check-circle-fill check-icon"></i>
                )}
              </div>
            ))}
          </div>
          {errors.type && <div className="text-danger small mt-2">{errors.type}</div>}
        </div>

        {/* Motivo Principal */}
        <div className="mb-4">
          <label htmlFor="reason" className="form-label fw-semibold">
            Motivo Principal <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.reason ? "is-invalid" : ""}`}
            id="reason"
            name="reason"
            placeholder="Ej: Cita médica programada"
            value={formData.reason}
            onChange={handleChange}
          />
          {errors.reason && <div className="invalid-feedback">{errors.reason}</div>}
        </div>

        {/* Fechas */}
        <div className="row mb-4">
          <div className="col-md-6">
            <label htmlFor="startDate" className="form-label fw-semibold">
              Fecha de Inicio <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-calendar3"></i>
              </span>
              <input
                type="date"
                className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
            </div>
          </div>

          <div className="col-md-6">
            <label htmlFor="endDate" className="form-label fw-semibold">
              Fecha de Fin <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-calendar-check"></i>
              </span>
              <input
                type="date"
                className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
              />
              {errors.endDate && <div className="invalid-feedback">{errors.endDate}</div>}
            </div>
          </div>
        </div>

        {/* Horas (Opcional) */}
        <div className="row mb-4">
          <div className="col-md-6">
            <label htmlFor="startTime" className="form-label fw-semibold">
              Hora de Inicio <span className="text-muted small">(Opcional)</span>
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-clock"></i>
              </span>
              <input
                type="time"
                className="form-control"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="col-md-6">
            <label htmlFor="endTime" className="form-label fw-semibold">
              Hora de Fin <span className="text-muted small">(Opcional)</span>
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-clock-fill"></i>
              </span>
              <input
                type="time"
                className="form-control"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Duración Calculada */}
        {calculateDuration() > 0 && (
          <div className="alert alert-info mb-4">
            <i className="bi bi-info-circle me-2"></i>
            <strong>Duración total:</strong> {calculateDuration()} día{calculateDuration() > 1 ? "s" : ""}
          </div>
        )}

        {/* Descripción Detallada */}
        <div className="mb-4">
          <label htmlFor="description" className="form-label fw-semibold">
            Descripción Detallada <span className="text-danger">*</span>
          </label>
          <textarea
            className={`form-control ${errors.description ? "is-invalid" : ""}`}
            id="description"
            name="description"
            rows="4"
            placeholder="Proporciona detalles adicionales sobre tu solicitud..."
            value={formData.description}
            onChange={handleChange}
          ></textarea>
          <div className="form-text">
            Mínimo 20 caracteres. Actual: {formData.description.length}
          </div>
          {errors.description && <div className="invalid-feedback">{errors.description}</div>}
        </div>

        {/* Documento Adjunto */}
        <div className="mb-4">
          <label htmlFor="document" className="form-label fw-semibold">
            Documento de Soporte <span className="text-muted small">(Opcional)</span>
          </label>
          <div className="file-upload-area">
            <input
              type="file"
              className="form-control"
              id="document"
              name="document"
              onChange={handleChange}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <div className="file-upload-hint">
              <i className="bi bi-cloud-upload"></i>
              <p className="mb-1">Arrastra un archivo o haz clic para seleccionar</p>
              <small className="text-muted">Formatos: PDF, JPG, PNG (Máx. 5MB)</small>
            </div>
            {formData.document && (
              <div className="file-selected">
                <i className="bi bi-file-earmark-check text-success me-2"></i>
                <span>{formData.document.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Urgente */}
        <div className="mb-4">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="urgent"
              name="urgent"
              checked={formData.urgent}
              onChange={handleChange}
            />
            <label className="form-check-label fw-semibold" htmlFor="urgent">
              <i className="bi bi-exclamation-triangle text-warning me-2"></i>
              Marcar como urgente
            </label>
          </div>
          <small className="text-muted ms-4 ps-2">
            Solo para situaciones que requieren atención inmediata
          </small>
        </div>

        {/* Botones */}
        <div className="d-flex gap-3 justify-content-end">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => {
              setFormData({
                type: "",
                reason: "",
                startDate: "",
                endDate: "",
                startTime: "",
                endTime: "",
                description: "",
                urgent: false,
                document: null
              });
              setErrors({});
            }}
            disabled={isSubmitting}
          >
            <i className="bi bi-x-circle me-2"></i>
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-wurth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Enviando...
              </>
            ) : (
              <>
                <i className="bi bi-send me-2"></i>
                Enviar Solicitud
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PermissionForm;