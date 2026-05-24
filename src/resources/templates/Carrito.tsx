import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";

import { Header } from './fragments/Header';
import { Footer } from './fragments/Footer';

import "../static/Global.css";
import "../static/Carrito.css"; 

interface CartItem {
  id: number;
  nombre: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  imagen: string;
}

export function Carrito() {
  const [items, setItems] = useState<CartItem[]>([]);

  // 1. Cargar datos del LocalStorage al iniciar
  useEffect(() => {
    obtenerCarritoLocal();
  }, []);

  const obtenerCarritoLocal = () => {
    const datosLocales = localStorage.getItem("carrito_mediexpress");
    if (datosLocales) {
      setItems(JSON.parse(datosLocales));
    }
  };

  // 2. Guardar y actualizar el estado general
  const guardarCarrito = (nuevoCarrito: CartItem[]) => {
    setItems(nuevoCarrito);
    localStorage.setItem("carrito_mediexpress", JSON.stringify(nuevoCarrito));
    window.dispatchEvent(new Event("cartUpdate")); // Notificar a otros componentes
  };

  // 3. Funciones para modificar cantidades y eliminar
  const cambiarCantidad = (id: number, incremento: number) => {
    const nuevoCarrito = items.map(item => {
      if (item.id === id) {
        const nuevaCantidad = item.cantidad + incremento;
        return { ...item, cantidad: nuevaCantidad > 0 ? nuevaCantidad : 1 };
      }
      return item;
    });
    guardarCarrito(nuevoCarrito);
  };

  const eliminarItem = (id: number) => {
    const nuevoCarrito = items.filter(item => item.id !== id);
    guardarCarrito(nuevoCarrito);
  };

  // 4. Cálculos
  const subtotal = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  return (
    <div className="carrito-container">
      <Header />

      <h1 className="carrito-title">Mi Carrito</h1>
      <main className="cart-main-container">      
        <div className="cart-layout">
          
          {/* COLUMNA IZQUIERDA: DINÁMICA */}
          <div className="cart-left-column">
            {items.length === 0 ? (
              <div className="cart-empty-section">
                <ShoppingBag size={48} />
                <p className="cart-empty-text">Tu carrito está vacío.</p>
                <Link to="/" className="btn-go-shop">Ir a comprar</Link>
              </div>
            ) : (
              <div className="cart-items-list">
                {items.map((item) => (
                  <div key={item.id} className="cart-item-row">
                    
                    {/* Imagen del producto */}
                    <div className="cart-item-img-container">
                      <img src={item.imagen} alt={item.nombre} className="cart-item-img" />
                    </div>

                    {/* Detalles centrales (Nombre y Descripción) */}
                    <div className="cart-item-details">
                      <h3 className="cart-item-name">{item.nombre}</h3>
                      <p className="cart-item-description">{item.descripcion}</p>
                      <span className="cart-item-unit-price">Precio unitario: S/ {item.precio.toFixed(2)}</span>
                    </div>

                    {/* Acciones de cantidad y eliminación */}
                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button className="btn-qty" onClick={() => cambiarCantidad(item.id, -1)}>
                          <Minus size={16} />
                        </button>
                        <span className="qty-number">{item.cantidad}</span>
                        <button className="btn-qty" onClick={() => cambiarCantidad(item.id, 1)}>
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="cart-item-subtotal">
                        S/ {(item.precio * item.cantidad).toFixed(2)}
                      </div>

                      <button className="btn-delete-item" onClick={() => eliminarItem(item.id)} title="Eliminar producto">
                        <Trash2 size={20} />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
      
          {/* COLUMNA DERECHA: RESUMEN */}
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
              
              {/* Botones de acción final */}
              <div className="cart-action-buttons">
                <button className="btn-payment-whatsapp">
                  PEDIR POR WHATSAPP <i className="fa-brands fa-whatsapp"></i>
                </button>
                
                {/* 🔥 Botón de continuar compra agregado (deshabilitado/sin acción por ahora) */}
                <button className="btn-payment-now" onClick={() => alert("Módulo de pago en desarrollo")}>
                  CONTINUAR COMPRA
                </button>
              </div>

            </div>
          </aside>

        </div>
      </main>

      <Footer/>
    </div>
  );
}