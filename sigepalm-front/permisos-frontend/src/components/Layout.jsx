import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/Layout.css";

function Layout({ children, role }) {

  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [name, setName] = useState("");

  // 🔐 Verificar token al cargar y obtener nombre
  useEffect(() => {

    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("name");

    if(!token){
      navigate("/");
    }

    if(storedName){
      setName(storedName);
    }

  },[navigate]);

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/");

  };

  const menuItems =
    role === "manager"
      ? [
          { icon: "bi-clipboard-check", label: "Aprobaciones", path: "/manager" },
          { icon: "bi-graph-up", label: "Reportes", path: "/manager/reports" },
          { icon: "bi-people", label: "Personal", path: "/manager/staff" },
          { icon: "bi-gear", label: "Configuración", path: "/manager/settings" },
        ]
      : [
          { icon: "bi-box-seam", label: "Mi Almacén", path: "/warehouse" },
          { icon: "bi-file-text", label: "Mis Permisos", path: "/warehouse/permissions" },
          { icon: "bi-calendar-event", label: "Calendario", path: "/warehouse/calendar" },
          { icon: "bi-person", label: "Mi Perfil", path: "/warehouse/profile" },
        ];

  return (
    <div className="layout-container">

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        
        <div className="sidebar-header text-center">
          <div className="wurth-logo-sidebar">
            <svg width="100" height="35" viewBox="0 0 100 35">
              <rect width="100" height="35" fill="#CC0000" rx="4" />
              <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fill="white"
                fontSize="16"
                fontWeight="bold"
              >
                WÜRTH
              </text>
            </svg>
          </div>

          {sidebarOpen && (
            <small className="text-white-50 d-block mt-2">
              Sistema de Gestión
            </small>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">

          <ul className="nav flex-column">
            {menuItems.map((item,index)=>(
              <li key={index} className="nav-item">

                <NavLink
                  to={item.path}
                  end
                  className={({isActive}) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >

                  <i className={`bi ${item.icon}`}></i>

                  {sidebarOpen && <span>{item.label}</span>}

                </NavLink>

              </li>
            ))}
          </ul>

          <div className="sidebar-divider"></div>

          {/* User */}
          <div className="sidebar-user">

            <div className="user-info">

              <i className="bi bi-person-circle user-avatar"></i>

              {sidebarOpen && (
                <div className="user-details">

                  <strong className="text-white d-block">
                    {name}
                  </strong>

                  <small className="text-white-50">
                    {role === "manager" ? "Gerente" : "Personal"}
                  </small>

                </div>
              )}

            </div>

          </div>

        </nav>

        <button
          className="sidebar-toggle"
          onClick={()=>setSidebarOpen(!sidebarOpen)}
        >
          <i className={`bi ${sidebarOpen ? "bi-chevron-left" : "bi-chevron-right"}`}></i>
        </button>

      </aside>


      {/* Main Content */}

      <div className={`main-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>

        <header className="top-navbar">

          <div className="container-fluid d-flex justify-content-between align-items-center">

            <h5 className="mb-0">
              {role === "manager" ? "Panel de Aprobaciones" : "Mi Almacén"}
            </h5>

            <div className="d-flex align-items-center gap-3">

              
              <div className="dropdown">

                <button
                  className="btn btn-user dropdown-toggle"
                  onClick={()=>setUserMenuOpen(!userMenuOpen)}
                >
                  <i className="bi bi-person-circle me-2"></i>
                  {name}
                </button>

                {userMenuOpen && (

                  <div className="dropdown-menu dropdown-menu-end show">

              

                    <div className="dropdown-divider"></div>

                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Cerrar Sesión
                    </button>

                  </div>

                )}

              </div>

            </div>

          </div>

        </header>

        <main className="page-content container-fluid">
          {children}
        </main>

        <footer className="page-footer text-center small text-muted">
          © 2026 Würth México - Todos los derechos reservados
        </footer>

      </div>

    </div>
  );
}

export default Layout;