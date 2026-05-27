import React from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Se agregó Link
import { Heart, Home, ShoppingBag, User } from 'lucide-react'; // Se agregaron los iconos faltantes

import "../../static/Header.css";

export function Header() {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm("¿Cerrar sesión?")) {
            // localStorage.removeItem('token'); // Ejemplo de limpieza
            navigate('/'); 
        }
    };

    return (

<header className="sticky top-0 z-50 w-full bg-gradient-to-r from-orange-500 to-orange-700 shadow-lg transition-all duration-300">
    <div className="header-container mx-auto px-6 py-3 max-w-[1400px] grid grid-cols-3 items-center">
        
        {/* 1. LADO IZQUIERDO: BRANDING */}
        <div className="header-left">
            <Link to="/" className="flex items-center gap-2 group transition-transform active:scale-95">
                <Heart className="w-8 h-8 text-white fill-white group-hover:animate-pulse" />
                <span className="brand-title text-white text-2xl font-extrabold tracking-tighter">
                    MediExpress
                </span>
            </Link>
        </div>

        {/* 2. CENTRO: ESPACIO PARA SEARCH O LOGO */}
        <div className="header-center flex justify-center">
            {/* Aquí podrías poner un input de búsqueda en el futuro */}
        </div>
        
        {/* 3. LADO DERECHO: ACCIONES */}
        <div className="header-right flex justify-end gap-6">
            <Link to="/carrito" className="nav-link group">
                <ShoppingBag className="w-6 h-6 transition-transform group-hover:-translate-y-1" />
                <span className="hidden md:block font-medium">Carrito</span>
            </Link>
            <Link to="/perfil" className="nav-link group">
                <User className="w-6 h-6 transition-transform group-hover:-translate-y-1" />
                <span className="hidden md:block font-medium">Mi perfil</span>
            </Link>
        </div>

    </div>  
</header>

    );
}