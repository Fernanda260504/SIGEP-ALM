import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Login.css";

function Login() {
  const [role, setRole] = useState("warehouse");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === "warehouse") {
      navigate("/warehouse");
    } else {
      navigate("/manager");
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center wurth-bg">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-4 p-sm-5">
                {/* Header con Logo Würth */}
                <div className="text-center mb-4">
                  <div className="wurth-logo-container mb-3">
                    <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="120" height="40" fill="#CC0000"/>
                      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold" fontFamily="Arial, sans-serif">
                        WÜRTH
                      </text>
                    </svg>
                  </div>
                  <h2 className="fw-bold mb-2 wurth-title">Sistema de Permisos Wurth</h2>
                  <p className="text-muted">Inicia sesión</p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin}>
                  {/* Username */}
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label fw-semibold text-dark">
                      Usuario
                    </label>
                    <div className="input-group wurth-input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-person text-danger"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0 ps-0"
                        id="username"
                        placeholder="Ingresa tu usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-semibold text-dark">
                      Contraseña
                    </label>
                    <div className="input-group wurth-input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-lock-fill text-danger"></i>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control border-start-0 border-end-0 ps-0"
                        id="password"
                        placeholder="Ingresa tu contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        className="btn btn-light border border-start-0"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi bi-eye${showPassword ? "-slash" : ""} text-danger`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Role Select */}
                  <div className="mb-4">
                    <label htmlFor="role" className="form-label fw-semibold text-dark">
                      Rol de Acceso
                    </label>
                    <div className="input-group wurth-input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-shield-check text-danger"></i>
                      </span>
                      <select
                        className="form-select border-start-0 ps-0"
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <option value="warehouse">Personal de Almacén</option>
                        <option value="manager">Gerente de Aprobaciones</option>
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-wurth w-100 py-3 fw-bold mb-3"
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    INICIAR
                  </button>

                  {/* Additional Links */}
                  <div className="text-center">
                    <a href="#" className="text-decoration-none small wurth-link">
                      <i className="bi bi-question-circle me-1"></i>
                      ¿Problemas para acceder?
                    </a>
                  </div>
                </form>
              </div>

            
                
              </div>
            </div>

            {/* Footer externo */}
            <div className="text-center mt-4">
              <p className="text-white small fw-semibold mb-1">
                © 2026 Würth México
              </p>
              <p className="text-white-50 small">
                Todos los derechos reservados
              </p>
            </div>
          </div>
        </div>
      </div>
    
  );
}

export default Login;