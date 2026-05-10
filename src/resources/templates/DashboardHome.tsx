import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { DashboardHeader } from './fragments/DashboardHeader';


import "../static/HomeDasboard.css";
import "../static/HeaderDasboard.css";

export function DashboardHome() {

  const navigate = useNavigate();
  const [hora, setHora] = useState(new Date().toLocaleTimeString());

  // Reloj en tiempo real
  useEffect(() => {
    const timer = setInterval(() => {
      setHora(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    // Aquí podrías limpiar el localStorage si lo usas
    navigate("/login");
  };

  return (
    <div className="admin-container">

      <DashboardHeader />

      {/* CONTENIDO PRINCIPAL */}
      <main className="admin-content">

        <div className="module-grid">
            <button className="module-btn" onClick={() => navigate("/DashboardVentas")}>
               <span className="module-emoji">💰</span>
                <h3>Ventas</h3>
            </button>

            <button className="module-btn">
              <span className="module-emoji">🛒</span>
              <h3>Compras</h3>
            </button>

            <button className="module-btn" onClick={() => navigate("/DashboardProductos")}>
               <span className="module-emoji">📦</span>
                <h3>Productos</h3>
            </button>

          <button className="module-btn">
            <span className="module-emoji">🚚</span>
            <h3>Pedidos</h3>
          </button>
        </div>
      </main>
    </div>
  );
}