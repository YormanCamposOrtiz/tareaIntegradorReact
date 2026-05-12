import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Home, ShoppingBag, User, LogOut } from 'lucide-react';

import "../../static/Header.css";

export function Header() {
    const navigate = useNavigate();

    // Obtener datos del usuario guardados al hacer login
    // Asumiendo que guardaste el objeto usuario como string en localStorage
    const userString = localStorage.getItem('usuario');
    const usuario = userString ? JSON.parse(userString) : null;

    const handleLogout = () => {
        if (window.confirm("¿Cerrar sesión?")) {
            localStorage.removeItem('usuario'); // Limpiar datos
            localStorage.removeItem('token');
            navigate('/'); 
        }
    };

    // Función para decidir a dónde va el click del perfil
    const getProfileRoute = () => {
        if (!usuario) return '/login'; // Si no hay nadie, al login
        
        // Si es ADMIN, lo mandamos a la gestión que acabamos de crear
        if (usuario.rol === 'ADMINISTRADOR') {
            return '/gestion-usuarios'; 
        }
        
        // Si es Usuario normal
        return '/perfil';
    };

    return (
        <header className="sticky top-0 z-50">
            <div className="header-container">
                
                {/* 1. LADO IZQUIERDO: CASITA */}
                <div className="header-left">
                    <Link to="/" title="Inicio">
                        <Home className="w-7 h-7 text-white hover:opacity-80 transition-opacity" />
                    </Link>
                </div>

                {/* 2. CENTRO: LOGO */}
                <div className="header-center">
                    <Link to="/" className="flex items-center gap-2 no-underline">
                        <Heart className="w-8 h-8 text-white fill-white" />
                        <span className="brand-title text-white">MediExpress</span>
                    </Link>
                </div>
                
                {/* 3. LADO DERECHO: ICONOS */}
                <div className="header-right flex items-center gap-4">
                    <Link to="/carrito" title="Carrito">
                        <ShoppingBag className="w-6 h-6 text-white hover:text-orange-200" />
                    </Link>

                    {/* REDIRECCIÓN DINÁMICA AQUÍ */}
                    <Link to={getProfileRoute()} title={usuario?.rol === 'ADMINISTRADOR' ? "Panel Admin" : "Mi Perfil"}>
                        <div className="flex items-center gap-1">
                            <User className={`w-6 h-6 text-white hover:text-orange-200 ${usuario?.rol === 'ADMINISTRADOR' ? 'text-orange-300' : ''}`} />
                            {usuario && <span className="text-white text-xs hidden md:block">{usuario.nombre}</span>}
                        </div>
                    </Link>

                    {/* Botón de Logout si está logueado */}
                    {usuario && (
                        <button onClick={handleLogout} className="text-white hover:text-red-300 bg-transparent border-none cursor-pointer">
                            <LogOut className="w-5 h-5" />
                        </button>
                    )}
                </div>

            </div> 
        </header>
    );
}