import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Reports.css";

function Reports() {

  const [selectedPeriod, setSelectedPeriod] = useState("q1");

  const [stats, setStats] = useState({
    totalRequests: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
    approvalRate: 0,
    avgResponseTime: 18
  });

  const [allMonths, setAllMonths] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [topReasons, setTopReasons] = useState([]);

  useEffect(() => {

    const token = localStorage.getItem("token");

    // KPI
    fetch("http://localhost:8080/api/reportes/stats",{
      headers:{ Authorization:`Bearer ${token}` }
    })
      .then(res=>res.json())
      .then(data=>{
        setStats({
          ...data,
          avgResponseTime:18
        });
      });

    // Dashboard
    fetch("http://localhost:8080/api/reportes/dashboard",{
      headers:{ Authorization:`Bearer ${token}` }
    })
      .then(res=>res.json())
      .then(data=>{

        const months = data.monthlyData || [];

        setAllMonths(months);
        setTopReasons(data.topReasons || []);

        filtrarMeses(months,"q1");

      });

  },[]);


  const filtrarMeses = (months,period)=>{

    let filtered=[];

    if(period==="q1") filtered = months.slice(0,3);
    if(period==="q2") filtered = months.slice(3,6);
    if(period==="q3") filtered = months.slice(6,9);
    if(period==="q4") filtered = months.slice(9,12);

    setMonthlyData(filtered);

  };


  const handlePeriodChange = (period)=>{

    setSelectedPeriod(period);
    filtrarMeses(allMonths,period);

  };


  const descargarPDF = ()=>{

    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/reportes/pdf",{
      headers:{ Authorization:`Bearer ${token}` }
    })
      .then(res=>res.blob())
      .then(blob=>{

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href=url;
        link.download="reporte_permisos.pdf";
        link.click();

      });

  };


  return (
    <Layout role="manager">

      <div className="reports-container">

        {/* Header */}

        <div className="reports-header mb-4">

          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">

            <div>

              <h1 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                <i className="bi bi-graph-up text-danger"></i>
                Reportes y Análisis
              </h1>

              <p className="text-muted mb-0">
                Visualiza estadísticas y métricas del sistema de permisos
              </p>

            </div>

            <div className="d-flex gap-2">

              {/* FILTRO TRIMESTRE */}

              <select
                className="form-select form-select-sm"
                value={selectedPeriod}
                onChange={(e)=>handlePeriodChange(e.target.value)}
              >
                <option value="q1">Ene - Mar</option>
                <option value="q2">Abr - Jun</option>
                <option value="q3">Jul - Sep</option>
                <option value="q4">Oct - Dic</option>
              </select>

              <button
                className="btn btn-wurth-red btn-sm"
                onClick={descargarPDF}
              >
                <i className="bi bi-download me-2"></i>
                Descargar PDF
              </button>

            </div>

          </div>

        </div>


        {/* KPI */}

        <div className="row g-3 mb-4">

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="kpi-card kpi-primary">
              <div className="kpi-icon">
                <i className="bi bi-file-text"></i>
              </div>
              <div className="kpi-content">
                <h6>Total Solicitudes</h6>
                <h2>{stats.totalRequests}</h2>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="kpi-card kpi-success">
              <div className="kpi-icon">
                <i className="bi bi-check-circle"></i>
              </div>
              <div className="kpi-content">
                <h6>Aprobadas</h6>
                <h2>{stats.approved}</h2>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="kpi-card kpi-danger">
              <div className="kpi-icon">
                <i className="bi bi-x-circle"></i>
              </div>
              <div className="kpi-content">
                <h6>Rechazadas</h6>
                <h2>{stats.rejected}</h2>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="kpi-card kpi-warning">
              <div className="kpi-icon">
                <i className="bi bi-clock-history"></i>
              </div>
              <div className="kpi-content">
                <h6>Tiempo Promedio</h6>
                <h2>{stats.avgResponseTime}h</h2>
              </div>
            </div>
          </div>

        </div>



        {/* Charts */}

        <div className="row g-4 mb-4">

          {/* Tendencia */}

          <div className="col-lg-8">

            <div className="card shadow-sm border-0">

              <div className="card-header bg-white border-bottom py-3">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-bar-chart text-danger me-2"></i>
                  Tendencia de Solicitudes
                </h5>
              </div>

              <div className="card-body">

                <div className="chart-container">

                  {monthlyData.map((data,index)=>(

                    <div key={index} className="chart-bar-group">

                      <div className="chart-bars">

                        <div
                          className="chart-bar bar-approved"
                          style={{height:`${(data.approved/20)*100}%`}}
                        >
                          <span className="bar-value">{data.approved}</span>
                        </div>

                        <div
                          className="chart-bar bar-rejected"
                          style={{height:`${(data.rejected/20)*100}%`}}
                        >
                          <span className="bar-value">{data.rejected}</span>
                        </div>

                      </div>

                      <div className="chart-label">{data.month}</div>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </div>



          {/* Tasa de aprobación */}

          <div className="col-lg-4">

            <div className="card shadow-sm border-0">

              <div className="card-header bg-white border-bottom py-3">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-pie-chart text-danger me-2"></i>
                  Tasa de Aprobación
                </h5>
              </div>

              <div className="card-body text-center">

                <div className="approval-rate-circle">

                  <svg width="200" height="200" viewBox="0 0 200 200">

                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="20"
                    />

                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#CC0000"
                      strokeWidth="20"
                      strokeDasharray={`${2*Math.PI*80*(stats.approvalRate/100)} ${2*Math.PI*80}`}
                      strokeDashoffset={`${2*Math.PI*80*0.25}`}
                      transform="rotate(-90 100 100)"
                      strokeLinecap="round"
                    />

                    <text x="100" y="95" textAnchor="middle" fontSize="36" fontWeight="bold">
                      {stats.approvalRate}%
                    </text>

                    <text x="100" y="115" textAnchor="middle" fontSize="14">
                      Aprobación
                    </text>

                  </svg>

                </div>

                <div className="mt-4">

                  <div className="d-flex justify-content-between mb-2">
                    <span>Aprobadas:</span>
                    <strong className="text-success">{stats.approved}</strong>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Rechazadas:</span>
                    <strong className="text-danger">{stats.rejected}</strong>
                  </div>

                  <div className="d-flex justify-content-between">
                    <span>Pendientes:</span>
                    <strong className="text-warning">{stats.pending}</strong>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>



        {/* Motivos */}

        <div className="card shadow-sm border-0">

          <div className="card-header bg-white border-bottom py-3">
            <h5 className="mb-0 fw-bold">
              <i className="bi bi-list-check text-danger me-2"></i>
              Motivos Principales
            </h5>
          </div>

          <div className="card-body">

            {topReasons.map((item,index)=>(

              <div key={index} className="reason-item mb-3">

                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-semibold">{item.reason}</span>
                  <span className="text-muted">{item.count} solicitudes</span>
                </div>

                <div className="progress" style={{height:"8px"}}>

                  <div
                    className="progress-bar bg-danger"
                    style={{width:`${item.percentage}%`}}
                  ></div>

                </div>

                <small className="text-muted">
                  {item.percentage}% del total
                </small>

              </div>

            ))}

          </div>

        </div>

      </div>

    </Layout>
  );
}

export default Reports;