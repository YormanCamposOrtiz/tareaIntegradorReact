import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Heart, User, MapPin, Package, Settings, LogOut, Shield, ShoppingBag } from "lucide-react";
import axios from "axios";

// Importación de estilos
import "../static/Header.css";
import "../static/Footer.css";
import "../static/Global.css";
import "../static/Perfil.css"; 

// Estructura de datos alineada con tu tabla en PostgreSQL
interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string; 
}

export function Perfil() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtenemos el correo guardado en el Login
    const userEmail = localStorage.getItem("userEmail"); 

    if (!userEmail) {
      navigate("/login");
      return;
    }

    // Buscamos los datos completos del usuario usando el correo
    axios.get(`http://localhost:8080/api/usuarios/buscar?correo=${userEmail}`)
      .then((res) => {
        setUsuario(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al conectar con PostgreSQL:", err);
        setError("No se pudo conectar con el servidor. Verifica que Spring Boot esté activo.");
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  if (loading) return <div className="p-10 text-center">Cargando perfil de SaludPlus...</div>;
  
  if (error) return (
    <div className="p-10 text-center text-red-500">
      <p>{error}</p>
      <button onClick={() => window.location.reload()} className="mt-4 text-orange-500 underline">
        Reintentar conexión
      </button>
    </div>
  );

  return (
    <div className="perfil-container">
      {/* Header unificado */}
      <header className="sticky top-0 z-50 bg-orange-500 shadow-md p-4">
        <div className="header-container container mx-auto flex justify-between items-center text-white">
          <div className="header-left">
            <Link to="/" title="Inicio">
              <Home className="w-7 h-7 text-white hover:opacity-80 transition-opacity" />
            </Link>
          </div>

          <div className="header-center flex items-center gap-2">
            <Heart className="w-8 h-8 text-white fill-white" />
            <span className="brand-title text-white text-2xl font-bold">SaludPlus</span>
          </div>

          <div className="header-right flex gap-4">
            {/* Acceso rápido a Dashboard si es ADMIN */}
            {usuario?.rol === "ADMINISTRADOR" && (
              <Link to="/admin/dashboard" title="Panel de Control">
                <Shield className="w-6 h-6 text-white" />
              </Link>
            )}
            <Link to="/carrito" title="Carrito"><ShoppingBag className="w-6 h-6 text-white" /></Link>
            <Link to="/perfil" title="Mi Perfil"><User className="w-6 h-6 text-white" /></Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="perfil-card">
            {/* Sección de cabecera del perfil */}
            <div className="perfil-banner">
              <div className="user-avatar-container">
                <User className="w-12 h-12 text-orange-500" />
              </div>
              <h1 className="user-name">{usuario?.nombre || "Usuario"}</h1>
              <p className="user-email">{usuario?.correo}</p>
              
              {usuario?.rol === "ADMINISTRADOR" && (
                <span className="badge-admin">
                  Modo Administrador
                </span>
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
          </button>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-12 mt-20 text-center">
        <p className="opacity-70">© 2026 SaludPlus - Tu bienestar es nuestra prioridad.</p>
      </footer>
    </div>
  );
}