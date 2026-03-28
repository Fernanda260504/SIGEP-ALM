import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/PermissionForm.css";

// Fecha de hoy en formato YYYY-MM-DD usando hora LOCAL
const getTodayLocal = () => {
  const now = new Date();
  const year  = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day   = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const TODAY = getTodayLocal();

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

    if (name === "startDate" && formData.endDate && value > formData.endDate) {
      setFormData(prev => ({ ...prev, startDate: value, endDate: "" }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type) newErrors.type = "Selecciona un tipo de permiso";
    if (!formData.reason.trim()) newErrors.reason = "El motivo es obligatorio";
    if (!formData.startDate) newErrors.startDate = "La fecha de inicio es obligatoria";
    if (!formData.endDate) newErrors.endDate = "La fecha de fin es obligatoria";

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = "La fecha de fin no puede ser anterior";
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = "Proporciona una descripción detallada";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔥 CORREGIDO
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const userId = localStorage.getItem("id"); // ✅ FIX
      const token = localStorage.getItem("token");

      if (!userId) {
        alert("Error: usuario no autenticado");
        return;
      }

      const payload = {
        motivo: formData.reason,
        fechaInicio: formData.startDate,
        fechaFin: formData.endDate,
        tipo: formData.type.toUpperCase(),
        empleado: {
          id: userId
        }
      };

      const response = await fetch("http://localhost:8080/api/permisos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // ✅ FIX
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.error("STATUS:", response.status);
        alert("Error al enviar solicitud");
        return;
      }

      await response.json().catch(() => null);

      setShowSuccess(true);

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

      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error) {
      console.error(error);
      alert("Error al enviar solicitud");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateDuration = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diff = Math.abs(end - start);
      return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
  };

  return (
    <div className="permission-form-container">

      {showSuccess && (
        <div className="alert alert-success alert-dismissible fade show">
          <strong>¡Solicitud enviada!</strong>
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* Tipo */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Tipo *</label>
          <div className="permission-types-grid">
            {permissionTypes.map((type) => (
              <div
                key={type.value}
                className={`permission-type-card ${formData.type === type.value ? "selected" : ""}`}
                onClick={() => handleChange({ target: { name: "type", value: type.value } })}
              >
                <i className={`bi bi-${type.icon}`}></i>
                <span>{type.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Motivo */}
        <input
          type="text"
          name="reason"
          className="form-control mb-3"
          placeholder="Motivo"
          value={formData.reason}
          onChange={handleChange}
        />

        {/* Fechas */}
        <input
          type="date"
          name="startDate"
          className="form-control mb-2"
          value={formData.startDate}
          onChange={handleChange}
          min={TODAY}
        />

        <input
          type="date"
          name="endDate"
          className="form-control mb-3"
          value={formData.endDate}
          onChange={handleChange}
          min={formData.startDate || TODAY}
        />

        {/* Descripción */}
        <textarea
          name="description"
          className="form-control mb-3"
          placeholder="Descripción"
          value={formData.description}
          onChange={handleChange}
        />

        <button type="submit" className="btn btn-wurth-submit w-100">
          {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
        </button>

      </form>
    </div>
  );
}

export default PermissionForm;