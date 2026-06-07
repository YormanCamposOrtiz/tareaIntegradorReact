import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
// 🔄 CAMBIO: Se agregó "Loader2" para la animación de carga
import { User, MapPin, Package, Settings, LogOut, Shield, ArrowLeft, Save, Loader2 } from "lucide-react";
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
  direccion?: string; 
  telefono?: string;
}

export function Perfil() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"menu" | "direcciones" | "configuracion">("menu");
  
  // --- Estados de Dirección ---
  const [direccionForm, setDireccionForm] = useState({ distrito: "", direccionExacta: "" });
  const [mensajeDireccion, setMensajeDireccion] = useState("");
  const [errorDireccion, setErrorDireccion] = useState(false);

  // --- Estados de Configuración ---
  const [configForm, setConfigForm] = useState({ nombre: "", telefono: "", password: "", confirmPassword: "" });
  const [mensajeConfig, setMensajeConfig] = useState("");
  const [errorConfig, setErrorConfig] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail"); 

    if (!userEmail) {
      console.warn("No hay sesión activa. Redirigiendo al login...");
      navigate("/login");
      return;
    }
    
    // Capturamos el momento exacto en que inicia la carga
    const tiempoInicio = Date.now();
    
    axios.get(`http://localhost:8080/api/auth/buscar?correo=${userEmail}`)
      .then((res) => {
        setUsuario(res.data);
        
        setConfigForm(prev => ({ 
          ...prev, 
          nombre: res.data.nombre, 
          telefono: res.data.telefono || "" 
        }));

        if (res.data.direccion) {
          const partes = res.data.direccion.split(", ");
          setDireccionForm({
            direccionExacta: partes[0] || "",
            distrito: partes[1] || ""
          });
        }
        
        // 🔄 CAMBIO: Calcular cuánto tardó la petición para mantener el loader por un mínimo de 1.5 segundos
        const tiempoTranscurrido = Date.now() - tiempoInicio;
        const tiempoRestante = Math.max(250 - tiempoTranscurrido, 0);

        setTimeout(() => {
          setLoading(false);
        }, tiempoRestante);
      })
      .catch((err) => {
        console.error("Error al conectar con PostgreSQL:", err);
        // En caso de error también respetamos una pequeña espera antes de quitar el loading
        setTimeout(() => setLoading(false), 100);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail"); 
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId"); 
    navigate("/login");
  };

  // --- 🛠️ VALIDACIONES Y ENVÍO DE DIRECCIÓN ---
  const handleGuardarDireccion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;

    const distritoClean = direccionForm.distrito.trim();
    const direccionExactaClean = direccionForm.direccionExacta.trim();

    if (distritoClean.length < 3 || direccionExactaClean.length < 5) {
      setErrorDireccion(true);
      setMensajeDireccion("❌ Por favor, ingresa datos de dirección más específicos.");
      return;
    }

    const regexValido = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ .,#°-]+$/;
    if (!regexValido.test(distritoClean) || !regexValido.test(direccionExactaClean)) {
      setErrorDireccion(true);
      setMensajeDireccion("❌ La dirección contiene caracteres no permitidos.");
      return;
    }

    const direccionCompleta = `${direccionExactaClean}, ${distritoClean}`;

    axios.put(`http://localhost:8080/api/perfil/${usuario.id}/datos`, {
      direccion: direccionCompleta
    })
    .then((res) => {
      setUsuario(res.data);
      setErrorDireccion(false);
      setMensajeDireccion("✅ Dirección de entrega guardada en la base de datos.");
      setTimeout(() => setMensajeDireccion(""), 3000);
    })
    .catch((err) => {
      console.error("Error al guardar dirección:", err);
      setErrorDireccion(true);
      setMensajeDireccion("❌ Error al conectar con el servidor.");
    });
  };

  // --- 🛠️ VALIDACIONES Y ENVÍO DE CONFIGURACIÓN ---
  const handleGuardarConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;

    const nombreClean = configForm.nombre.trim();
    const telefonoClean = configForm.telefono.trim();

    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;
    if (nombreClean.length < 3 || !regexNombre.test(nombreClean)) {
      setErrorConfig(true);
      setMensajeConfig("❌ El nombre debe contener solo letras y tener al menos 3 caracteres.");
      return;
    }

    if (telefonoClean) {
      const regexTelefono = /^9\d{8}$/;
      if (!regexTelefono.test(telefonoClean)) {
        setErrorConfig(true);
        setMensajeConfig("❌ El número de teléfono debe ser un celular válido de 9 dígitos (debe empezar con 9).");
        return;
      }
    }

    if (configForm.password) {
      if (configForm.password.length < 8) {
        setErrorConfig(true);
        setMensajeConfig("❌ La nueva contraseña debe tener al menos 8 caracteres.");
        return;
      }

      if (configForm.password !== configForm.confirmPassword) {
        setErrorConfig(true);
        setMensajeConfig("❌ Las contraseñas no coinciden");
        return;
      }

      try {
        await axios.put(`http://localhost:8080/api/perfil/${usuario.id}/contrasena`, {
          nuevaContrasena: configForm.password
        });
      } catch (err) {
        console.error("Error al encriptar/cambiar contraseña:", err);
        setErrorConfig(true);
        setMensajeConfig("❌ Error al actualizar la contraseña.");
        return;
      }
    }

    axios.put(`http://localhost:8080/api/perfil/${usuario.id}/datos`, {
      nombre: nombreClean,
      telefono: telefonoClean || null
    })
    .then((res) => {
      setUsuario(res.data);
      setErrorConfig(false);
      setMensajeConfig("✅ ¡Cambios guardados con éxito en NeonTech!");
      setConfigForm(prev => ({ ...prev, password: "", confirmPassword: "" }));
      setTimeout(() => setMensajeConfig(""), 3000);
    })
    .catch((err) => {
      console.error("Error al actualizar datos:", err);
      setErrorConfig(true);
      setMensajeConfig("❌ Error al guardar datos personales.");
    });
  };

  // 🔄 CAMBIO: Vista HTML mejorada para el estado de carga (Loading)
  if (loading) {
    return (
      <div className="loading-container" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: '15px',
        backgroundColor: '#f9fafb'
      }}>
        <Loader2 size={48} className="spinner-icon" style={{
          color: '#f37907',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{
          color: '#63564b',
          fontSize: '1.1rem',
          fontWeight: 500,
          fontFamily: 'sans-serif'
        }}>
          Cargando tu perfil...
        </p>
      </div>
    );
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

            {/* VISTA 2: DIRECCIÓN ÚNICA */}
            {view === "direcciones" && (
              <div className="subview-container">
                <h2 className="subview-title">📍 Mi Dirección de Envío</h2>
                
                {mensajeDireccion && (
                  <div className={`mensaje-alerta-config ${errorDireccion ? "error-text" : "success-text"}`}>
                    {mensajeDireccion}
                  </div>
                )}

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
                        maxLength={50}
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
                    maxLength={100}
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
                
                {mensajeConfig && (
                  <div className={`mensaje-alerta-config ${errorConfig ? "error-text" : "success-text"}`}>
                    {mensajeConfig}
                  </div>
                )}

                <form onSubmit={handleGuardarConfig} className="subview-form">
                  <h3>🔒 Actualizar Datos Personales</h3>
                  <label>Nombre Completo</label>
                  <input 
                    type="text" 
                    value={configForm.nombre}
                    onChange={e => {
                      const soloLetras = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, "");
                      setConfigForm({...configForm, nombre: soloLetras});
                    }}
                    required
                    maxLength={60}
                  />

                  <label>Número de Teléfono</label>
                  <input 
                    type="tel" 
                    placeholder="Ej: 987654321"
                    value={configForm.telefono}
                    onChange={e => {
                      const soloNumeros = e.target.value.replace(/\D/g, "");
                      setConfigForm({...configForm, telefono: soloNumeros});
                    }}
                    maxLength={9}
                  />

                  <h3 style={{ marginTop: '25px' }}>🔑 Cambiar Contraseña</h3>
                  <label>Nueva Contraseña</label>
                  <input 
                    type="password" 
                    placeholder="Mínimo 8 caracteres"
                    value={configForm.password}
                    onChange={e => setConfigForm({...configForm, password: e.target.value})}
                    maxLength={32}
                  />

                  <label>Confirmar Nueva Contraseña</label>
                  <input 
                    type="password" 
                    placeholder="Repite tu nueva clave"
                    value={configForm.confirmPassword}
                    onChange={e => setConfigForm({...configForm, confirmPassword: e.target.value})}
                    maxLength={32}
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