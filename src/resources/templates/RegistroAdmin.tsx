// src/resources/templates/RegistroAdmin.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, ShieldCheck } from "lucide-react";
import api from "../../api";
import { DashboardHeader } from './fragments/DashboardHeader';


export function RegistroAdmin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: "",
        correo: "",
        contrasena: "",
        rol: "ADMINISTRADOR" // <--- Importante: Rol fijo
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/auth/registro', formData);
            alert("Administrador creado con éxito");
            navigate("/dashboardHome");
        } catch (err: any) {
            alert("Error al registrar: " + (err.response?.data?.message || "Servidor no responde"));
        }
    };

    return (
        <div className="login-page-wrapper"><DashboardHeader />
            <div className="login-card">
                <div className="logo-circle"><ShieldCheck /></div>
                <h1>Nuevo Administrador</h1>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        className="login-input" 
                        placeholder="Nombre" 
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
                    />
                    <input 
                        type="email" 
                        className="login-input" 
                        placeholder="Correo" 
                        onChange={(e) => setFormData({...formData, correo: e.target.value})} 
                    />
                    <input 
                        type="password" 
                        className="login-input" 
                        placeholder="Contraseña" 
                        onChange={(e) => setFormData({...formData, contrasena: e.target.value})} 
                    />
                    <button type="submit" className="login-button">Registrar Admin</button>
                </form>
            </div>
        </div>
    );
}