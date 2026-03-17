import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Login.css";

function Login() {
  const [role, setRole] = useState("warehouse");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          correo: correo,
          password: password
        })
      });

      if (!response.ok) {
        alert("Correo o contraseña incorrectos");
        return;
      }

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      // 🔹 limpiar sesión anterior
      localStorage.clear();

      // 🔹 guardar datos
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("correo", data.correo);
      localStorage.setItem("name", data.nombre);

      console.log("TOKEN:", localStorage.getItem("token"));

      // 🔹 redirigir según rol
      if (data.role === "ALMACENISTA") {
        navigate("/warehouse");
      } else if (data.role === "JEFE_ALMACEN") {
        navigate("/manager");
      } else {
        alert("Rol no reconocido");
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center wurth-bg">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-4 p-sm-5">

                {/* Logo */}
                <div className="text-center mb-4">
                  <div className="wurth-logo-container mb-3">
                    <svg width="120" height="40" viewBox="0 0 120 40">
                      <rect width="120" height="40" fill="#CC0000"/>
                      <text
                        x="50%"
                        y="50%"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fill="white"
                        fontSize="20"
                        fontWeight="bold"
                      >
                        WÜRTH
                      </text>
                    </svg>
                  </div>

                  <h2 className="fw-bold mb-2 wurth-title">
                    Sistema de Permisos Wurth
                  </h2>
                  <p className="text-muted">Inicia sesión</p>
                </div>

                {/* FORM */}
                <form onSubmit={handleLogin}>

                  {/* CORREO */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">
                      Correo
                    </label>

                    <div className="input-group wurth-input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-person text-danger"></i>
                      </span>

                      <input
                        type="email"
                        className="form-control border-start-0 ps-0"
                        placeholder="Ingresa tu correo"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">
                      Contraseña
                    </label>

                    <div className="input-group wurth-input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-lock-fill text-danger"></i>
                      </span>

                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control border-start-0 border-end-0 ps-0"
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

                  {/* BOTON LOGIN */}
                  <button
                    type="submit"
                    className="btn btn-wurth w-100 py-3 fw-bold mb-3"
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    INICIAR
                  </button>

                  <div className="text-center">
                    <a href="#" className="text-decoration-none small wurth-link">
                      <i className="bi bi-question-circle me-1"></i>
                      ¿Problemas para acceder?
                    </a>
                  </div>

                </form>
              </div>
            </div>

            {/* FOOTER */}
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
    </div>
  );
}

export default Login;