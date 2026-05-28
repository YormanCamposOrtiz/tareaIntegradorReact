import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Heart, Home, ArrowLeft, Lock, Eye, EyeOff, KeyRound } from "lucide-react";

import { Footer } from './fragments/Footer';
import api from "../../api";

import "../static/Login.css";
import "../static/Global.css";

export function RecuperarPassword() {
  const navigate = useNavigate();
  
  // Estados de flujo
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  // Datos del formulario
  const [correo, setCorreo] = useState("");
  const [token, setToken] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmar, setConfirmar] = useState("");

  // Visibilidad de contraseña
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // PASO 1: Solicitar el código al correo
  const handleSolicitarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/solicitar-recuperacion', { correo });
      setEnviado(true);
      alert("Código enviado. Revisa tu bandeja de entrada o spam.");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Error al procesar la solicitud";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  // PASO 2: Enviar el código junto con la nueva contraseña
  const handleRestablecer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevaContrasena !== confirmar) {
      return alert("Las contraseñas no coinciden.");
    }

    setLoading(false);
    try {
      // Usamos el mismo endpoint que procesa el token y la nueva clave
      await api.post('/auth/resetear-password', { token: token.trim(), nuevaContrasena });
      alert("Contraseña actualizada con éxito.");
      navigate('/login');
    } catch (err: any) {
      alert(err.response?.data?.message || "El código es inválido o ya expiró.");
    }
  };

  return (
    <div className="login-page-wrapper">
      
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

      <main className="login-main">
        <div className="login-card text-center">
          <div className="logo-circle">
            <Heart />
          </div>

          {/* SINO HA ENVIADO EL CORREO: MUESTRA FORMULARIO DE SOLICITUD */}
          {!enviado ? (
            <>
              <h1>Recuperar Contraseña</h1>
              <p className="login-subtitle">Enviaremos un código de seguridad a tu correo</p> <br />

              <form onSubmit={handleSolicitarCodigo} className="space-y-4">
                <div>
                  <label className="login-label">Correo Electrónico</label>
                  <div className="input-group">
                    <input
                      type="email"
                      className="login-input"
                      placeholder="Ingresa tu correo"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <Mail className="input-icon" />
                  </div>
                </div> <br />

                <button type="submit" className="login-button" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar Código"}
                </button>
              </form> <br />
            </>
          ) : (
            /* SI YA SE ENVIÓ EL CORREO: MUESTRA FORMULARIO PARA COLOCAR EL CÓDIGO Y LAS CLAVES */
            <>
              <h1>Verificación</h1>
              <p className="login-subtitle">Introduce el código enviado a <strong>{correo}</strong></p> <br />

              <form onSubmit={handleRestablecer} className="space-y-4">
                
                {/* CAMPO: CÓDIGO DE RECUPERACIÓN */}
                <div>
                  <label className="login-label">Código de Verificación (Expira en 5 min)</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="login-input"
                      placeholder="Ej: A1B2C3D4"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      required
                    />
                    <KeyRound className="input-icon" />
                  </div>
                </div>

                {/* CAMPO: NUEVA CONTRASEÑA */}
                <div>
                  <label className="login-label">Nueva Contraseña</label>
                  <div className="input-group relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="login-input w-full pr-10"
                      placeholder="Mínimo 8 caracteres"
                      value={nuevaContrasena}
                      onChange={(e) => setNuevaContrasena(e.target.value)}
                      required
                    />
                    <Lock className="input-icon" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* CAMPO: CONFIRMAR CONTRASEÑA */}
                <div>
                  <label className="login-label">Confirmar Contraseña</label>
                  <div className="input-group relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      className="login-input w-full pr-10"
                      placeholder="Repite tu contraseña"
                      value={confirmar}
                      onChange={(e) => setConfirmar(e.target.value)}
                      required
                    />
                    <Lock className="input-icon" />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div> <br />

                <button type="submit" className="login-button">
                  Actualizar Contraseña
                </button>
              </form>
            </>
          )}

          <div className="mt-6">
            <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-orange-500 font-bold hover:underline">
              <ArrowLeft className="w-4 h-4" /> Volver al Login
            </Link>
          </div>
        </div>
      </main>

      <Footer/>

    </div>
  );
}