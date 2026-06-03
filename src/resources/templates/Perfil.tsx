import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, MapPin, Package, Settings, LogOut, Shield, Plus, Trash2, ArrowLeft, Save } from "lucide-react";
import axios from "axios";

import { Header } from './fragments/Header';
import { Footer } from './fragments/Footer';

import "../static/Global.css";
import "../static/Perfil.css"; 

interface Usuario {
  id: number;
  nombre: string;
  correo: string; 
  rol: string; 
  intentos_fallidos: number; 
}

interface Direccion {
  id: string;
  etiqueta: string;
  distrito: string;
  direccionExacta: string;
}

export function Perfil() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"menu" | "direcciones" | "configuracion">("menu");
  
  // --- Estados de Direcciones ---
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [nuevaDir, setNuevaDir] = useState({ etiqueta: "", distrito: "", direccionExacta: "" });

  // --- Estados de Configuración ---
  const [configForm, setConfigForm] = useState({ nombre: "", telefono: "", password: "", confirmPassword: "" });
  const [mensajeConfig, setMensajeConfig] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail"); 

    if (!userEmail) {
      console.warn("No hay sesión activa. Redirigiendo al login...");
      navigate("/login");
      return;
    }
    
    axios.get(`http://localhost:8080/api/auth/buscar?correo=${userEmail}`)
      .then((res) => {
        setUsuario(res.data);
        setConfigForm(prev => ({ ...prev, nombre: res.data.nombre }));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al conectar con PostgreSQL:", err);
        setLoading(false);
      });

    // Cargar direcciones iniciales desde LocalStorage
    const guardadas = localStorage.getItem("user_direcciones");
    if (guardadas) {
      setDirecciones(JSON.parse(guardadas));
    } else {
      const iniciales = [
        { id: "1", etiqueta: "Casa", distrito: "Santiago de Surco", direccionExacta: "Av. Caminos del Inca 1234" },
        { id: "2", etiqueta: "Trabajo", distrito: "Miraflores", direccionExacta: "Calle Larco 456" }
      ];
      setDirecciones(iniciales);
      localStorage.setItem("user_direcciones", JSON.stringify(iniciales));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail"); 
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId"); 
    navigate("/login");
  };

  // --- Operaciones CRUD Direcciones ---
  const handleAgregarDireccion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaDir.etiqueta || !nuevaDir.distrito || !nuevaDir.direccionExacta) return;

    const nueva: Direccion = {
      id: Date.now().toString(),
      ...nuevaDir
    };

    const listaActualizada = [...direcciones, nueva];
    setDirecciones(listaActualizada);
    localStorage.setItem("user_direcciones", JSON.stringify(listaActualizada));
    setNuevaDir({ etiqueta: "", distrito: "", direccionExacta: "" });
  };

  const handleEliminarDireccion = (id: string) => {
    const listaActualizada = direcciones.filter(dir => dir.id !== id);
    setDirecciones(listaActualizada);
    localStorage.setItem("user_direcciones", JSON.stringify(listaActualizada));
  };

  // --- Lógica Configuración ---
  const handleGuardarConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (configForm.password && configForm.password !== configForm.confirmPassword) {
      setMensajeConfig("❌ Las contraseñas no coinciden");
      return;
    }
    setMensajeConfig("✅ ¡Cambios guardados con éxito en tu cuenta!");
    setTimeout(() => setMensajeConfig(""), 3000);
  };

  if (loading) {
    return <div className="loading-container">Cargando datos del perfil...</div>;
  }

  return (
    <div className="login-page-wrapper">
      <Header />
      <br />
      <main className="perfil-main">
        <div className="max-w-4xl mx-auto w-full px-4">
          <div className="perfil-card">
            
            {/* Banner de Cabecera (Reutilizado) */}
            <div className="perfil-banner">
              {view !== "menu" && (
                <button className="btn-back-perfil" onClick={() => setView("menu")}>
                  <ArrowLeft /> Volver
                </button>
              )}
              <div className="user-avatar-container">
                <User className="w-12 h-12" /> 
              </div>
              <h1 className="user-name">{usuario?.nombre || "Usuario"}</h1>
              <h1 className="user-email">{usuario?.correo || "correo@ejemplo.com"}</h1>
              
              {usuario?.rol === "ADMINISTRADOR" && (
                <span className="badge-admin">Modo Administrador</span>
              )}
            </div>

            {/* VISTA 1: MENÚ PRINCIPAL */}
            {view === "menu" && (
              <div className="perfil-options">
                <Link to="/perfil/mispedidos" className="perfil-option-item">
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

                <button onClick={() => setView("direcciones")} className="perfil-option-item btn-menu-trigger">
                  <div className="option-icon-box"><MapPin /></div>
                  <div className="option-text">
                    <h3>Direcciones</h3>
                    <p>Gestionar puntos de entrega</p>
                  </div>
                  <span className="option-arrow">→</span>
                </button>

                <button onClick={() => setView("configuracion")} className="perfil-option-item btn-menu-trigger">
                  <div className="option-icon-box"><Settings /></div>
                  <div className="option-text">
                    <h3>Configuración</h3>
                    <p>Ajustes de seguridad y cuenta</p>
                  </div>
                  <span className="option-arrow">→</span>
                </button>
              </div>
            )}

            {/* VISTA 2: CRUD DIRECCIONES */}
            {view === "direcciones" && (
              <div className="subview-container">
                <h2 className="subview-title">📍 Tus Direcciones Guardadas</h2>
                
                {/* Lista */}
                <div className="direcciones-list">
                  {direcciones.map(dir => (
                    <div key={dir.id} className="direccion-item-box">
                      <div className="direccion-info">
                        <span className="dir-badge">{dir.etiqueta}</span>
                        <h4>{dir.distrito}</h4>
                        <p>{dir.direccionExacta}</p>
                      </div>
                      <button className="btn-delete-dir" onClick={() => handleEliminarDireccion(dir.id)}>
                        <Trash2 />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Formulario */}
                <form onSubmit={handleAgregarDireccion} className="subview-form">
                  <h3>➕ Agregar Nueva Dirección</h3>
                  <div className="form-group-row">
                    <input 
                      type="text" 
                      placeholder="Ej: Mi Casa, Trabajo" 
                      value={nuevaDir.etiqueta}
                      onChange={e => setNuevaDir({...nuevaDir, etiqueta: e.target.value})}
                      required 
                    />
                    <input 
                      type="text" 
                      placeholder="Distrito (Ej: Surco)" 
                      value={nuevaDir.distrito}
                      onChange={e => setNuevaDir({...nuevaDir, distrito: e.target.value})}
                      required 
                    />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Dirección Exacta (Av, Calle, Nro, Dpto)" 
                    value={nuevaDir.direccionExacta}
                    onChange={e => setNuevaDir({...nuevaDir, direccionExacta: e.target.value})}
                    required 
                  />
                  <button type="submit" className="btn-submit-subview">
                    <Plus size={18} /> Registrar Dirección
                  </button>
                </form>
              </div>
            )}

            {/* VISTA 3: CONFIGURACIÓN */}
            {view === "configuracion" && (
              <div className="subview-container">
                <h2 className="subview-title">⚙️ Ajustes de Cuenta y Seguridad</h2>
                
                {mensajeConfig && <div className="mensaje-alerta-config">{mensajeConfig}</div>}

                <form onSubmit={handleGuardarConfig} className="subview-form">
                  <h3>🔒 Actualizar Datos Personales</h3>
                  <label>Nombre Completo</label>
                  <input 
                    type="text" 
                    value={configForm.nombre}
                    onChange={e => setConfigForm({...configForm, nombre: e.target.value})}
                    required
                  />

                  <label>Número de Teléfono</label>
                  <input 
                    type="tel" 
                    placeholder="Ej: 987654321"
                    value={configForm.telefono}
                    onChange={e => setConfigForm({...configForm, telefono: e.target.value})}
                  />

                  <h3 style={{ marginTop: '25px' }}>🔑 Cambiar Contraseña</h3>
                  <label>Nueva Contraseña</label>
                  <input 
                    type="password" 
                    placeholder="Escribe tu nueva clave"
                    value={configForm.password}
                    onChange={e => setConfigForm({...configForm, password: e.target.value})}
                  />

                  <label>Confirmar Nueva Contraseña</label>
                  <input 
                    type="password" 
                    placeholder="Repite tu nueva clave"
                    value={configForm.confirmPassword}
                    onChange={e => setConfigForm({...configForm, confirmPassword: e.target.value})}
                  />

                  <button type="submit" className="btn-submit-subview save-btn">
                    <Save size={18} /> Guardar Configuración
                  </button>
                </form>
              </div>
            )}

          </div>

          {/* Botón de Logout solo visible en el menú principal */}
          {view === "menu" && (
            <button onClick={handleLogout} className="btn-logout">
              <LogOut className="w-6 h-6" />
              Cerrar Sesión
            </button>
          )}
          <br />
        </div>
      </main>
      <Footer />
    </div>
  );
}