import { useState } from "react";
import Layout from "../components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Calendar.css";

function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Eventos del calendario (permisos aprobados y pendientes)
  const events = [
    {
      id: 1,
      title: "Cita médica",
      date: "2026-03-05",
      type: "pending",
      duration: "4 horas"
    },
    {
      id: 2,
      title: "Vacaciones",
      date: "2026-03-10",
      endDate: "2026-03-15",
      type: "approved",
      duration: "5 días"
    },
    {
      id: 3,
      title: "Permiso Personal",
      date: "2026-03-20",
      type: "approved",
      duration: "medio día"
    },
    {
      id: 4,
      title: "Día festivo - Natalicio de Benito Juárez",
      date: "2026-03-21",
      type: "holiday",
      duration: "día completo"
    }
  ];

  // Obtener días del mes
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Días del mes anterior
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }
    
    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }

    return days;
  };

  // Verificar si un día tiene evento
  const getEventsForDay = (day) => {
    if (!day) return [];
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => {
      if (event.endDate) {
        // Evento de múltiples días
        return dateStr >= event.date && dateStr <= event.endDate;
      }
      return event.date === dateStr;
    });
  };

  const changeMonth = (direction) => {
    setCurrentMonth(new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + direction,
      1
    ));
  };

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const days = getDaysInMonth(currentMonth);

  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
    <Layout role="warehouse">
      <div className="calendar-container">
        {/* Header */}
        <div className="calendar-header mb-4">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div>
              <h1 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                <i className="bi bi-calendar-event text-danger"></i>
                Mi Calendario
              </h1>
              <p className="text-muted mb-0">
                Visualiza tus permisos y días festivos
              </p>
            </div>
            
            <button className="btn btn-wurth-red">
              <i className="bi bi-download me-2"></i>
              Exportar Calendario
            </button>
          </div>
        </div>

        <div className="row g-4">
          {/* Calendar */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 calendar-card">
              <div className="card-header bg-white border-bottom py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => changeMonth(-1)}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                  
                  <h4 className="mb-0 fw-bold">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </h4>
                  
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => changeMonth(1)}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              </div>

              <div className="card-body p-3">
                {/* Day Names */}
                <div className="calendar-grid">
                  {dayNames.map((name, index) => (
                    <div key={index} className="calendar-day-name">
                      {name}
                    </div>
                  ))}
                  
                  {/* Days */}
                  {days.map((dayObj, index) => {
                    const dayEvents = dayObj.isCurrentMonth ? getEventsForDay(dayObj.day) : [];
                    const isToday = dayObj.isCurrentMonth && 
                      dayObj.day === new Date().getDate() &&
                      currentMonth.getMonth() === new Date().getMonth() &&
                      currentMonth.getFullYear() === new Date().getFullYear();

                    return (
                      <div
                        key={index}
                        className={`calendar-day ${!dayObj.isCurrentMonth ? 'other-month' : ''} 
                                   ${isToday ? 'today' : ''} 
                                   ${dayEvents.length > 0 ? 'has-event' : ''}`}
                        onClick={() => dayObj.isCurrentMonth && setSelectedDate(dayObj.day)}
                      >
                        {dayObj.day && (
                          <>
                            <span className="day-number">{dayObj.day}</span>
                            <div className="day-events">
                              {dayEvents.map((event, idx) => (
                                <div 
                                  key={idx} 
                                  className={`event-dot event-${event.type}`}
                                  title={event.title}
                                ></div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="calendar-legend mt-4">
                  <div className="legend-item">
                    <span className="legend-dot event-pending"></span>
                    <span>Pendiente</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot event-approved"></span>
                    <span>Aprobado</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot event-holiday"></span>
                    <span>Día Festivo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events Sidebar */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-bottom py-3">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-calendar-check text-danger me-2"></i>
                  Próximos Eventos
                </h5>
              </div>
              <div className="card-body p-3">
                {upcomingEvents.length === 0 ? (
                  <div className="text-center text-muted py-4">
                    <i className="bi bi-calendar-x" style={{ fontSize: "3rem" }}></i>
                    <p className="mt-2 mb-0">No hay eventos próximos</p>
                  </div>
                ) : (
                  <div className="upcoming-events-list">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className={`upcoming-event event-${event.type}`}>
                        <div className={`event-indicator event-${event.type}`}></div>
                        <div className="event-content">
                          <h6 className="mb-1">{event.title}</h6>
                          <div className="event-details">
                            <small className="text-muted">
                              <i className="bi bi-calendar3 me-1"></i>
                              {new Date(event.date).toLocaleDateString('es-MX', { 
                                day: 'numeric', 
                                month: 'long' 
                              })}
                            </small>
                            <small className="text-muted">
                              <i className="bi bi-clock me-1"></i>
                              {event.duration}
                            </small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card shadow-sm border-0 mt-4">
              <div className="card-header bg-white border-bottom py-3">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-graph-up text-danger me-2"></i>
                  Resumen del Mes
                </h5>
              </div>
              <div className="card-body">
                <div className="stat-row">
                  <div className="stat-label">
                    <i className="bi bi-calendar-check text-success"></i>
                    Días Solicitados
                  </div>
                  <div className="stat-value text-success">5</div>
                </div>
                <div className="stat-row">
                  <div className="stat-label">
                    <i className="bi bi-hourglass text-warning"></i>
                    Pendientes
                  </div>
                  <div className="stat-value text-warning">1</div>
                </div>
                <div className="stat-row">
                  <div className="stat-label">
                    <i className="bi bi-gift text-info"></i>
                    Días Festivos
                  </div>
                  <div className="stat-value text-info">1</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Calendar;