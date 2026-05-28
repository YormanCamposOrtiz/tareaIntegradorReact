import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Heart, User, MapPin, Package, Settings, LogOut, Shield, ShoppingBag } from "lucide-react";
import axios from "axios";

import { Header } from './fragments/Header';
import { Footer } from './fragments/Footer';

// Importación de estilos
import "../static/Global.css";
import "../static/Perfil.css"; 

// Estructura de datos alineada con tu tabla en PostgreSQL
interface Usuario {
  id: number;
  nombre: string;
  correo: string; // Asegúrate de usar la que tenga el dato en Neon
  rol: string; 
  intentos_fallidos: number; // Columna visible en tu tabla[cite: 1]
}

export function Perfil() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Intentar obtener el correo guardado
    const userEmail = localStorage.getItem("userEmail"); 

    if (!userEmail) {
      console.warn("No hay sesión activa. Redirigiendo al login...");
      navigate("/login");
      return;
    }
    
    // 2. Buscar datos en PostgreSQL (Neon) usando el correo recuperado
    axios.get(`http://localhost:8080/api/auth/buscar?correo=${userEmail}`)
      .then((res) => {
        setUsuario(res.data); //[cite: 2]
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al conectar con PostgreSQL:", err);
        setError("No se pudo conectar con el servidor de base de datos.");
        setLoading(false);
      });
  }, [navigate]);

    const handleLogout = () => {
      localStorage.removeItem("userEmail"); //[cite: 2]
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId"); // 👈 Agrega esto para limpiar el ID al cerrar sesión
      navigate("/login");
    };



  return (
    <div className="login-page-wrapper">
      
      <Header />

        <br></br>
      <main className="perfil-main">
        <div className="max-w-4xl mx-auto">
          <div className="perfil-card">
            {/* Sección de cabecera del perfil */}
            <div className="perfil-banner">
              <div className="user-avatar-container">
                 <User className="w-12 h-12" /> 
              </div>
              <h1 className="user-name">
                {usuario?.nombre ? usuario.nombre : "Cargando nombre..."}</h1>
              <h1 className="user-email">
                {usuario?.correo ? usuario.correo : "Cargando correo..."}</h1>
              
              
              {usuario?.rol === "ADMINISTRADOR" && (
                <span className="badge-admin">
                  Modo Administrador</span>
              )}
            </div>

            {/* Listado de acciones */}
            <div className="perfil-options">
              <Link to="/mis-pedidos" className="perfil-option-item">
                <div className="option-icon-box"><Package /></div>
                <div className="option-text">
                  <h3>Mis Pedidos</h3>
                  <p>Ver historial de compras y recetas</p>
                </div>
                <span className="option-arrow">→</span>
              </Link>

              {usuario?.rol === "ADMINISTRADOR" && (
                <Link to="/admin/usuarios" className="perfil-option-item">
                  <div className="option-icon-box"><Shield /></div>
                  <div className="option-text">
                    <h3>Gestión de Usuarios</h3>
                    <p>Administrar base de datos PostgreSQL</p>
                  </div>
                  <span className="option-arrow">→</span>
                </Link>
              )}

              <Link to="#" className="perfil-option-item">
                <div className="option-icon-box"><MapPin /></div>
                <div className="option-text">
                  <h3>Direcciones</h3>
                  <p>Gestionar puntos de entrega</p>
                </div>
                <span className="option-arrow">→</span>
              </Link>
              
              <Link to="#" className="perfil-option-item">
                <div className="option-icon-box"><Heart /></div>
                <div className="option-text">
                  <h3>Favoritos</h3>
                  <p>Productos guardados</p>
                </div>
                <span className="option-arrow">→</span>
              </Link>

              <Link to="#" className="perfil-option-item">
                <div className="option-icon-box"><Settings /></div>
                <div className="option-text">
                  <h3>Configuración</h3>
                  <p>Ajustes de seguridad y cuenta</p>
                </div>
                <span className="option-arrow">→</span>
              </Link>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            <LogOut className="w-6 h-6" />
            Cerrar Sesión
          </button><br></br>
        </div>
      </main>

      <Footer />

    </div>
  );
}