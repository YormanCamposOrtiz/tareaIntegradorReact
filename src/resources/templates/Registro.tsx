import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, User, Heart, Home, Eye, EyeOff, Mail } from "lucide-react";

import { Footer } from './fragments/Footer';
import api from "../../api"; // Tu configuración de axios

import "../static/Login.css"; 
import "../static/Global.css";

export function Registro() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    nombre: "", 
    correo: "", 
    contrasena: "",
    rol: "Usuario"
  });
  const [error, setError] = useState("");
  
    // Estado para rastrear qué requisitos se van cumpliendo en tiempo real
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        uppercase: false,
        number: false,
        specialChar: false,
    });

    // Función para validar la contraseña en tiempo real mientras se digita
    const handlePasswordChange = (password: string) => {
        setFormData({ ...formData, contrasena: password });

        setPasswordCriteria({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            specialChar: /[@$!%*?&._#\-+=¿¡]/.test(password),
        });
    };

  // 1. Validar criterios de contraseña
  const esContrasenaValida = 
    passwordCriteria.length && 
    passwordCriteria.uppercase && 
    passwordCriteria.number && 
    passwordCriteria.specialChar;

  // 🔄 NUEVO: Validar que todos los campos requeridos estén llenos y limpios
  const formularioCompleto = 
    formData.nombre.trim() !== "" && 
    formData.correo.trim() !== "" && 
    esContrasenaValida;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formularioCompleto) {
      alert("Por favor, completa todos los campos correctamente.");
      return;
    }

    try {
      const response = await api.post('/auth/registro', formData);
      
      if (response.status === 200) {
        alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
        navigate('/login'); 
      }
    } catch (err: any) {
      if (err.response) {
        const mensajeError = err.response.data.message || "Error al registrarse";
        alert(mensajeError);
      } else {
        alert("No se pudo conectar con el servidor.");
      }
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* HEADER REUTILIZADO */}
      <header className="sticky top-0 z-50">
        <div className="header-container">
          <div className="header-left">
            <Link to="/" title="Inicio"><Home className="w-7 h-7 text-white" /></Link>
          </div>
          <div className="header-center">
            <Link to="/" className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-white fill-white" />
              <span className="brand-title text-white">MediExpress</span>
            </Link>
          </div>
          <div className="header-right"><div className="w-7"></div></div>
        </div>
      </header>

      {/* SECCIÓN CENTRAL DEL REGISTRO */}
      <main className="login-main">
        <div className="login-card text-center">
          
          <div className="logo-circle" style={{ marginBottom: '-20px' }}>
            <Heart />
          </div>

          <h1>Crea tu Cuenta</h1>
          <p className="login-subtitle" style={{ marginBottom: '-10px' }}>Únete a MediExpress hoy</p> <br />

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* CAMPO NOMBRE */}
            <div style={{ marginBottom: '6px' }}>
              <label className="login-label">Nombre Completo</label>
              <div className="input-group">
                <input
                  type="text"
                  className="login-input"
                  placeholder="Ej. Juan Pérez"
                  value={formData.nombre}
                  onChange={(e) => {
                    const soloLetras = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, "");
                    setFormData({ ...formData, nombre: soloLetras });
                  }}
                  required maxLength={60}
                />
                <User className="input-icon" />
              </div>
            </div>

            {/* CAMPO CORREO */}
            <div style={{ marginBottom: '6px' }}>
              <label className="login-label">Correo Electrónico</label>
              <div className="input-group">
                <input 
                        type="email" 
                        className="login-input" 
                        placeholder="Correo" 
                        value={formData.correo}
                        onChange={(e) => setFormData({...formData, correo: e.target.value})} 
                    />
                <Mail className="input-icon" />
              </div>
            </div> 
            <label className="login-label">Password</label>

            <div className="input-group relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  className="login-input w-full"
                  style={{ paddingRight: '45px' }} // Espacio para que el texto no tape el ojo
                  placeholder="Contraseña"
                  value={formData.contrasena}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  required
                />
                
                <Lock className="input-icon" />

                <button
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* CRITERIOS DE CONTRASEÑA EN TAMAÑO REDUCIDO */}
                    {formData.contrasena.length > 0 && (
                        <div className="password-criteria mb-4 text-left text-[11px] space-y-0.5 bg-gray-50/50 p-1.5 rounded border border-gray-100/50">
                            <p className={`${passwordCriteria.length ? "text-green-600 font-medium" : "text-gray-400"} flex items-center gap-1`}>
                                <span>{passwordCriteria.length ? "✓" : "○"}</span> Mínimo 8 caracteres
                            </p>
                            <p className={`${passwordCriteria.uppercase ? "text-green-600 font-medium" : "text-gray-400"} flex items-center gap-1`}>
                                <span>{passwordCriteria.uppercase ? "✓" : "○"}</span> Al menos una mayúscula
                            </p>
                            <p className={`${passwordCriteria.number ? "text-green-600 font-medium" : "text-gray-400"} flex items-center gap-1`}>
                                <span>{passwordCriteria.number ? "✓" : "○"}</span> Al menos un número
                            </p>
                            <p className={`${passwordCriteria.specialChar ? "text-green-600 font-medium" : "text-gray-400"} flex items-center gap-1`}>
                                <span>{passwordCriteria.specialChar ? "✓" : "○"}</span> Al menos un signo (@$!%*?&.)
                            </p>
                        </div>
                    )}         

            {/* 🔄 CAMBIO: Ahora evalúa "formularioCompleto" en lugar de solo la contraseña */}
            <button 
              type="submit" 
              disabled={!formularioCompleto}
              className={`login-button mt-4 transition-all duration-300 ${
                formularioCompleto 
                  ? "bg-orange-500 text-white hover:bg-orange-600 shadow-md" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-70"
              }`} 
              style={{ 
                marginBottom: '6px',
                backgroundColor: formularioCompleto ? '#f97316' : '#e5e7eb',
                color: formularioCompleto ? '#ffffff' : '#9ca3af'
              }}
            >
              Registrarse
            </button>

            <div className="mt-4 text-sm text-gray-600">
              ¿Ya tienes cuenta? <Link to="/login" className="text-orange-500 font-bold">Inicia sesión aquí</Link>
            </div>
          </form>
        </div>
      </main>

      {/* FOOTER REUTILIZADO */}
      <Footer/>
    </div>
  );
}