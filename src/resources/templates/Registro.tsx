import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, User, Heart, Home, Eye, EyeOff, Mail } from "lucide-react";


import { Footer } from './fragments/Footer';

import api from "../../api"; // Tu configuración de axios

import "../static/Login.css"; // Reutilizamos los estilos de Login para mantener coherencia
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Petición al endpoint de registro que configuramos en Spring Boot
      const response = await api.post('/auth/registro', formData);
      
      if (response.status === 200) {
        alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
        navigate('/login'); // Redirige al login tras el éxito
      }
    } catch (err: any) {
      if (err.response) {
        // Aquí capturamos los errores de validación de Google Guava (ej. contraseña < 8)
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
          
          <div className="logo-circle">
            <Heart />
          </div>

          <h1>Crea tu Cuenta</h1>
          <p className="login-subtitle">Únete a MediExpress hoy</p> <br />

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* CAMPO NOMBRE */}
            <div>
              <label className="login-label">Nombre Completo</label>
              <div className="input-group">
                <input
                  type="text"
                  className="login-input"
                  placeholder="Ej. Juan Pérez"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
                <User className="input-icon" />
              </div>
            </div> <br />

            {/* CAMPO CORREO */}
            <div>
              <label className="login-label">Correo Electrónico</label>
              <div className="input-group">
                <input
                  type="email"
                  className="login-input"
                  placeholder="tu@correo.com"
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                  required
                />
                <Mail className="input-icon" />
              </div>
            </div> <br />

{/* CAMPO CONTRASEÑA CON OJITO */}
<div>
  <label className="login-label">Contraseña</label>
  <div className="input-group relative"> {/* "relative" es clave para posicionar el ojo */}
    <input
      type={showPassword ? "text" : "password"} 
      className="login-input"
      style={{ paddingRight: '45px' }} // Espacio para que el texto no tape el ojo
      placeholder="Mínimo 8 caracteres"
      value={formData.contrasena}
      onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
      required
    />
    
    {/* Icono de Candado (Izquierda) */}
    <Lock className="input-icon" />

    {/* BOTÓN DEL OJITO (Derecha) */}
    <button
      type="button" // IMPORTANTE: para que no envíe el formulario al hacer clic
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
      style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
</div>

            <button type="submit" className="login-button mt-4">
              Registrarse
            </button> <br /><br />

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