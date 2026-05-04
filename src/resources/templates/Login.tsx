import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Verifica que sea react-router-dom
import { Link } from "react-router-dom"; 
import { Lock, User, Heart, ShoppingBag, Home , Shield } from "lucide-react";


import api from "../../api"; // Tu configuración de axios

import "../static/Login.css";
import "../static/Header.css";
import "../static/Footer.css";
import "../static/Global.css";

export function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ correo: "", contrasena: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); 

    try {
      const { correo, contrasena } = credentials; 
      
      // Petición al backend
      const response = await api.post('/auth/login', { correo, contrasena });
      const user = response.data;

      // Si el login es exitoso
      if (user.success) {
        // --- GUARDAR EN LOCALSTORAGE ---
        localStorage.setItem("userEmail", correo); //
        localStorage.setItem("userRole", user.rol); //

        if (user.rol === 'ADMINISTRADOR') {
          navigate('/dashboardHome');
        } else {
          navigate('/');
        }
      }
    } catch (err: any) {
      if (err.response) {
        const status = err.response.status;
        if (status === 403) alert("Cuenta bloqueada temporalmente.");
        else if (status === 401) alert("Usuario o contraseña incorrectos.");
        else alert("Error en el servidor.");
      } else {
        alert("No se pudo conectar con el servidor.");
      }
    }
  };

return (
    <div className="login-page-wrapper">
      {/* HEADER (Reutilizando el que ya arreglamos) */}
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

      {/* SECCIÓN CENTRAL DEL LOGIN */}
      <main className="login-main">
        <div className="login-card text-center">
          
          {/* 1. EL CORAZÓN DENTRO DEL CÍRCULO NARANJA */}
          <div className="logo-circle">
            <Heart />
          </div>

          {/* 2. TÍTULOS (MediExpress y Panel) */}
          <h1>MediExpress</h1>
          <p className="login-subtitle">Panel de Administración</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 3. CAMPO USUARIO */}
            <div>
              <label className="login-label">Usuario</label>
              <div className="input-group">
                <input
                  type="text"
                  className="login-input"
                  placeholder="Ingresa tu usuario"
                  value={credentials.correo} // AGREGAR ESTO
                  onChange={(e) => setCredentials({ ...credentials, correo: e.target.value })} // AGREGAR ESTO
                  required
                />
                {/* Icono de Persona DENTRO */}
                <User className="input-icon" />
              </div>
            </div>

            {/* 4. CAMPO CONTRASEÑA */}
            <div>
              <label className="login-label">Contraseña</label>
              <div className="input-group">
                <input
                  type="password"
                  className="login-input"
                  placeholder="Ingresa tu contraseña"
                  value={credentials.contrasena} // AGREGAR ESTO
                  onChange={(e) => setCredentials({ ...credentials, contrasena: e.target.value })} // AGREGAR ESTO
                  required
                />
                {/* Icono de Candado DENTRO */}
                <Lock className="input-icon" />
              </div>
            </div>

            {/* 5. BOTÓN NARANJA SÓLIDO */}
            <button type="submit" className="login-button">
              Iniciar Sesión
            </button>
          </form>
        </div>
      </main>

      {/* FOOTER (Reutilizando el que ya arreglamos) */}
      <footer className="bg-stone-900 text-white py-8">
        <div className="footer-content">
          <p>© 2026 MediExpress - Cuidando de ti.</p>
        </div>
      </footer>
    </div>
  );
}