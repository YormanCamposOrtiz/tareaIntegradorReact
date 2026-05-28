import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

import "../../static/DashboardHeader.css";

export function DashboardHeader() {
    const navigate = useNavigate();
    const [hora, setHora] = useState(new Date().toLocaleTimeString());

    // Lógica para el reloj en tiempo real
    useEffect(() => {
        const timer = setInterval(() => {
            setHora(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        if (window.confirm("¿Seguro que deseas cerrar sesión?")) {
        // 1. Limpiamos las llaves EXACTAS que guarda tu Login.tsx
            localStorage.removeItem('userEmail'); 
            localStorage.removeItem('userRole'); 
            localStorage.removeItem('userId'); 
        
        // Por si acaso quedaron residuos en sessionStorage
            sessionStorage.removeItem('userEmail');
            sessionStorage.removeItem('userRole');
            sessionStorage.removeItem('userId');

        // 2. Volvemos a la página principal totalmente limpios
            navigate('/'); 

        // 3. Forzamos el refresco para limpiar los estados de React
            window.location.reload();
        }
    };
    
    return (
        <header className="admin-header">
            <div className="header-brand">
                {/* Al hacer clic en el logo, volvemos al home del dashboard */}
                <div 
                    className="flex-items-center cursor-pointer" 
                    onClick={() => navigate('/DashboardHome')}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                    <Heart className="w-8 h-8 text-white fill-white" />
                    <span className="brand-title text-white">MediExpress</span>
                </div>
                <span className="admin-clock">{hora}</span>
            </div>

            <div className="header-actions">
                <button onClick={handleLogout} className="btn-logout">
                    Salir 🚪
                </button>
            </div>
        </header>
    );
}