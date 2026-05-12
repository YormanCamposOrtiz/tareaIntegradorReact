import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, Heart, ShoppingBag, Trash2, Shield, User } from "lucide-react";
import axios from "axios";

import { Header } from './fragments/Header';
import { Footer } from './fragments/Footer';

// Importación de tus estilos
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
      
    <Header />

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

      <Footer/>

    </div>
  );
}