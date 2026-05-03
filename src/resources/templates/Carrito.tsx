import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, Heart, ShoppingBag, Trash2, Shield, User } from "lucide-react";
import axios from "axios";

// Importamos tus estilos existentes y el nuevo del carrito
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

          <div className="header-center flex items-center gap-2 no-underline">
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

      <main className="container mx-auto px-4 py-12">
        <h1 className="carrito-title">Mi Carrito</h1>

        <div className="max-w-4xl mx-auto">
          {/* Tarjeta Blanca Principal (como en image_e09a23.png) */}
          <div className="carrito-card">
            {items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100 last:border-b-0 last:mb-0 last:pb-0">
                  {/* Cuadrado naranja del icono */}
                  <div className="item-icon-box">
                    <ShoppingBag />
                  </div>
                  
                  <div className="item-info flex-1">
                    <h3>{item.nombre}</h3>
                    <p>Cantidad: {item.cantidad}</p>
                  </div>

                  <div className="text-right">
                    <div className="item-price">${(item.precio * item.cantidad).toFixed(2)}</div>
                    <button className="btn-delete" title="Eliminar">
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 text-xl">Tu carrito está vacío.</p>
                <Link to="/" className="text-orange-500 font-bold hover:underline">Ir a comprar</Link>
              </div>
            )}

            {/* Resumen Final de Totales */}
            <div className="mt-10">
              <div className="summary-row">
                <span className="summary-label">Subtotal:</span>
                <span className="summary-value">${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Envío:</span>
                <span className="summary-free">GRATIS</span>
              </div>
              <div className="total-row">
                <span className="total-label">Total:</span>
                <span className="total-value">${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Botón Naranja Inferior */}
          <Link to="/pago" className="btn-payment">
            Proceder al Pago
          </Link>
        </div>
      </main><br></br>

      <footer className="bg-gray-900 text-white py-12 mt-20 text-center">
        <p className="opacity-70">© 2026 MediExpress - Cuidando de ti cada día.</p>
      </footer>
    </div>
  );
}