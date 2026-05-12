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
                <div className="header-right">
                    <Link to="/carrito" title="Carrito">
                        <ShoppingBag className="w-6 h-6 text-white hover:text-orange-200" />
                    </Link>
                    <Link to="/perfil" title="Mi Perfil">
                        <User className="w-6 h-6 text-white hover:text-orange-200" />
                    </Link>
 
                </div>

            </div> 
        </header>
    );
}