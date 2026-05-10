import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

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
        if (window.confirm("¿Cerrar sesión?")) {
            // Aquí puedes limpiar tokens de localStorage si los usas
            navigate('/'); 
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