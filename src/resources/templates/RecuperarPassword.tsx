import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Heart, Home, ArrowLeft } from "lucide-react";

import { Footer } from './fragments/Footer';

import api from "../../api";

import "../static/Login.css";
import "../static/Global.css";

export function RecuperarPassword() {
  const [correo, setCorreo] = useState("");
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Endpoint que configuramos en el RecoveryController del backend
      await api.post('/auth/solicitar-recuperacion', { correo });
      setEnviado(true);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Error al procesar la solicitud";
      alert(msg);
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

          {!enviado ? (
            <>
              <h1>Recuperar Contraseña</h1>
              <p className="login-subtitle">Enviaremos un enlace a tu correo</p> <br />

              <form onSubmit={handleSubmit} className="space-y-4">
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
                    />
                    <Mail className="input-icon" />
                  </div>
                </div> <br />

                <button type="submit" className="login-button">
                  Enviar Instrucciones
                </button>
              </form> <br />
            </>
          ) : (
            <div className="py-6">
              <h2 className="text-xl font-bold text-gray-800">¡Correo Enviado!</h2>
              <p className="text-gray-600 mt-2">
                Si el correo <strong>{correo}</strong> está registrado, recibirás un enlace para restablecer tu contraseña en unos minutos.
              </p>
            </div>
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