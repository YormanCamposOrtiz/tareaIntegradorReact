import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, Heart, ShoppingBag, Trash2, Shield, User } from "lucide-react";
import axios from "axios";

// Importación de tus estilos
import "../static/Header.css";
import "../static/Footer.css";
import "../static/Global.css";
import "../static/Carrito.css"; 

interface CartItem {
  id: number;
  nombre: string;
  cantidad: number;
  precio: number;
}

export function Carrito() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8080/api/carrito/datos")
      .then((res) => {
        setItems(res.data.items);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al conectar con la API:", err);
        setLoading(false);
      });
  }, []);

  const subtotal = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  return (
    <div className="carrito-container">
      {/* Header Estilo MediExpress */}
      <header className="sticky top-0 z-50 bg-orange-500 shadow-md p-4">
        <div className="header-container container mx-auto flex justify-between items-center text-white">
          <div className="header-left">
            <Link to="/" title="Inicio">
              <Home className="w-7 h-7 text-white hover:opacity-80 transition-opacity" />
            </Link>
          </div>

          <div className="header-center flex items-center gap-2">
            <Heart className="w-8 h-8 text-white fill-white" />
            <span className="brand-title text-white">MediExpress</span>
          </div>
          
          <div className="header-right flex gap-4">
            <Link to="/login"><Shield className="w-6 h-6 text-white" /></Link>
            <Link to="/carrito"><ShoppingBag className="w-6 h-6 text-white" /></Link>
            <Link to="/perfil"><User className="w-6 h-6 text-white" /></Link>
          </div>
        </div>
      </header>

      {/* Título Principal */}
      <h1 className="carrito-title">Mi Carrito</h1>
      <main className="cart-main-container">      
        <div className="cart-layout">
          {/* COLUMNA IZQUIERDA */}
          <div className="cart-left-column">
            {items.length === 0 ? (
              <div className="cart-empty-section">
                <ShoppingBag size={48} />
                <p className="cart-empty-text">Tu carrito está vacío.</p>
                <Link to="/" className="btn-go-shop">Ir a comprar</Link>
              </div>
            ) : (
              <div className="cart-items-list">
                {/* Aquí va tu mapeo de productos */}
              </div>
            )}
          </div>
      
          {/* COLUMNA DERECHA */}
          <aside className="cart-right-column">
            <div className="carrito-summary-card">
              <h2 className="summary-title">Resumen de Compra</h2>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>S/ {subtotal.toFixed(2)}</span>
              </div>
              <div className="divider"></div>
              <div className="total-row">
                <span className="total-label">Total:</span>
                <span className="total-value">S/ {subtotal.toFixed(2)}</span>
              </div>
              <button className="btn-payment">
                PEDIR POR WHATSAPP <i className="fa-brands fa-whatsapp"></i>
              </button>
            </div>
          </aside>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-8 mt-20 text-center">
        <p className="opacity-70">© 2026 MediExpress - Cuidando de ti cada día.</p>
      </footer>
    </div>
  );
}