import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, MapPin, Package, Settings, LogOut, Shield, ArrowLeft, Save } from "lucide-react";
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
  direccion?: string; // 🔄 CAMBIO: Agregados opcionales para tipado
  telefono?: string;
}

export function Perfil() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"menu" | "direcciones" | "configuracion">("menu");
  
  // --- 🔄 CAMBIO: Estados de Dirección Simplificados (Opción A) ---
  const [direccionForm, setDireccionForm] = useState({ distrito: "", direccionExacta: "" });
  const [mensajeDireccion, setMensajeDireccion] = useState("");

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
    
    // Carga inicial del usuario desde la base de datos
    axios.get(`http://localhost:8080/api/auth/buscar?correo=${userEmail}`)
      .then((res) => {
        setUsuario(res.data);
        
        // 🔄 CAMBIO: Inicializar los formularios con la data real que viene de NeonTech
        setConfigForm(prev => ({ 
          ...prev, 
          nombre: res.data.nombre, 
          telefono: res.data.telefono || "" 
        }));

        // Si ya hay una dirección, intentar separarla por la coma para rellenar los inputs
        if (res.data.direccion) {
          const partes = res.data.direccion.split(", ");
          setDireccionForm({
            direccionExacta: partes[0] || "",
            distrito: partes[1] || ""
          });
        }
        
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al conectar con PostgreSQL:", err);
        loading && setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail"); 
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId"); 
    navigate("/login");
  };

  // --- 🔄 CAMBIO: Guardar Dirección única en NeonTech ---
  const handleGuardarDireccion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;

    // Unificamos el texto como "Av. Siempre Viva 123, Surco"
    const direccionCompleta = `${direccionForm.direccionExacta}, ${direccionForm.distrito}`;

    axios.put(`http://localhost:8080/api/perfil/${usuario.id}/datos`, {
      direccion: direccionCompleta
    })
    .then((res) => {
      setUsuario(res.data); // Sincronizamos estado global del componente
      setMensajeDireccion("✅ Dirección de entrega guardada en la base de datos.");
      setTimeout(() => setMensajeDireccion(""), 3000);
    })
    .catch((err) => {
      console.error("Error al guardar dirección:", err);
      setMensajeDireccion("❌ Error al conectar con el servidor.");
    });
  };

  // --- 🔄 CAMBIO: Guardar Configuración Personal y Contraseña Encriptada ---
  const handleGuardarConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;

    // 1. Validar cambio de contraseña si el usuario escribió algo
    if (configForm.password) {
      if (configForm.password !== configForm.confirmPassword) {
        setMensajeConfig("❌ Las contraseñas no coinciden");
        return;
      }

      try {
        await axios.put(`http://localhost:8080/api/perfil/${usuario.id}/contrasena`, {
          nuevaContrasena: configForm.password
        });
      } catch (err) {
        console.error("Error al encriptar/cambiar contraseña:", err);
        setMensajeConfig("❌ Error al actualizar la contraseña.");
        return;
      }
    }

    // 2. Guardar Datos Personales (Nombre y Teléfono)
    axios.put(`http://localhost:8080/api/perfil/${usuario.id}/datos`, {
      nombre: configForm.nombre,
      telefono: configForm.telefono
    })
    .then((res) => {
      setUsuario(res.data); // Actualiza la cabecera (Avatar/Nombre) en caliente
      setMensajeConfig("✅ ¡Cambios guardados con éxito en NeonTech!");
      // Limpiamos los campos de password
      setConfigForm(prev => ({ ...prev, password: "", confirmPassword: "" }));
      setTimeout(() => setMensajeConfig(""), 3000);
    })
    .catch((err) => {
      console.error("Error al actualizar datos:", err);
      setMensajeConfig("❌ Error al guardar datos personales.");
    });
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
            
            {/* Banner de Cabecera */}
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
                <span className="badge-admin">Modo Administrator</span>
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
                    <h3>Dirección de Entrega</h3>
                    <p>Gestionar tu punto de envío para delivery</p>
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

            {/* 🔄 VISTA 2 CONFIGURADA: DIRECCIÓN ÚNICA */}
            {view === "direcciones" && (
              <div className="subview-container">
                <h2 className="subview-title">📍 Mi Dirección de Envío</h2>
                
                {mensajeDireccion && <div className="mensaje-alerta-config">{mensajeDireccion}</div>}

                <form onSubmit={handleGuardarDireccion} className="subview-form">
                  <h3>🏠 Actualizar Lugar de Entrega Frecuente</h3>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '15px' }}>
                    Esta dirección se cargará automáticamente cuando realices tus pedidos por delivery.
                  </p>
                  
                  <div className="form-group-row">
                    <div style={{ width: '100%' }}>
                      <label>Distrito</label>
                      <input 
                        type="text" 
                        placeholder="Ej: Santiago de Surco" 
                        value={direccionForm.distrito}
                        onChange={e => setDireccionForm({...direccionForm, distrito: e.target.value})}
                        required 
                      />
                    </div>
                  </div>

                  <label>Dirección Exacta</label>
                  <input 
                    type="text" 
                    placeholder="Av, Calle, Nro de casa, Departamento" 
                    value={direccionForm.direccionExacta}
                    onChange={e => setDireccionForm({...direccionForm, direccionExacta: e.target.value})}
                    required 
                  />

                  <button type="submit" className="btn-submit-subview">
                    <Save size={18} /> Guardar Dirección de Envío
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

          {/* Botón de Logout */}
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