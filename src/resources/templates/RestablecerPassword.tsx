import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Heart } from "lucide-react";
import api from "../../api";

export function RestablecerPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token"); // Lee el token de la URL

  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevaContrasena !== confirmar) return alert("Las contraseñas no coinciden");

    try {
      await api.post('/auth/resetear-password', { token, nuevaContrasena });
      alert("Contraseña actualizada con éxito.");
      navigate('/login');
    } catch (err: any) {
      alert(err.response?.data?.message || "Error al restablecer");
    }
  };

  return (
    <div className="login-page-wrapper">
      <main className="login-main">
        <div className="login-card text-center">
          <div className="logo-circle"><Heart /></div>
          <h1>Nueva Contraseña</h1>
          <p className="login-subtitle">Ingresa tu nueva clave de acceso</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="input-group">
              <input
                type="password"
                className="login-input"
                placeholder="Nueva contraseña (mín. 8)"
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)}
                required
              />
              <Lock className="input-icon" />
            </div>
            <br></br>
            <div className="input-group">
              <input
                type="password"
                className="login-input"
                placeholder="Confirmar contraseña"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                required
              />
              <Lock className="input-icon" />
            </div>

            <button type="submit" className="login-button">
              Actualizar Contraseña
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}