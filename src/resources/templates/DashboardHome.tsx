import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {Heart } from "lucide-react";

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
      {/* HEADER MINIMALISTA */}
      <header className="admin-header">

        <div className="header-brand">
        <Heart className="w-8 h-8 text-white fill-white" />
        <span className="brand-title text-white">MediExpress</span>
        <span className="admin-clock">{hora}</span>
        </div>

        <div className="header-actions">
          <button onClick={handleLogout} className="btn-logout">
            Salir 🚪
          </button>
        </div>

      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="admin-content">
        <div className="welcome-text">
          <h2>Panel de Gestión</h2>
          <p>Selecciona un módulo para trabajar</p>
        </div>

        {/* REJILLA DE 4 BOTONES GRANDES */}
        <div className="module-grid">
          <button className="module-btn">
            <span className="module-emoji">💰</span>
            <h3>Ventas</h3>
          </button>

          <button className="module-btn">
            <span className="module-emoji">🛒</span>
            <h3>Compras</h3>
          </button>

          <button className="module-btn">
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