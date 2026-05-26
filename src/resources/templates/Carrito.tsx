import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";

import { Header } from './fragments/Header';
import { Footer } from './fragments/Footer';
import { FormularioCheckout } from './FormularioCheckout'; // Importamos FormularioCheckout

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
  const [paso, setPaso] = useState<'carrito' | 'checkout'>('carrito');

  // Estados del Formulario (se manejan aquí para calcular el envío en la card resumen)
  const [metodoEntrega, setMetodoEntrega] = useState<'domicilio' | 'tienda'>('domicilio');
  const [metodoPago, setMetodoPago] = useState<'yape_plin' | 'tarjeta'>('yape_plin');
  const [direccion, setDireccion] = useState('');
  const [distrito, setDistrito] = useState('');

  useEffect(() => {
    obtenerCarritoLocal();
  }, []);

  const obtenerCarritoLocal = () => {
    const datosLocales = localStorage.getItem("carrito_mediexpress");
    if (datosLocales) {
      setItems(JSON.parse(datosLocales));
    }
  };

  const guardarCarrito = (nuevoCarrito: CartItem[]) => {
    setItems(nuevoCarrito);
    localStorage.setItem("carrito_mediexpress", JSON.stringify(nuevoCarrito));
    window.dispatchEvent(new Event("cartUpdate"));
  };

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

  // Cálculos
  const subtotal = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const costoEnvio = metodoEntrega === 'domicilio' && items.length > 0 ? 7.90 : 0;
  const totalGeneral = subtotal + costoEnvio;

  const procesarPagoFinal = () => {
    if (metodoEntrega === 'domicilio' && (!direccion || !distrito)) {
      alert("Por favor, completa los datos de tu dirección de entrega.");
      return;
    }
    alert(`¡Pedido Procesado Exitosamente!\nMétodo: ${metodoEntrega === 'domicilio' ? 'Envío a domicilio' : 'Recojo en tienda'}\nPago: ${metodoPago === 'yape_plin' ? 'Yape / Plin' : 'Tarjeta'}\nMonto Total: S/ ${totalGeneral.toFixed(2)}`);
  };

  return (
    <div className="carrito-container">
      <Header />

      <h1 className="carrito-title">
        {paso === 'carrito' ? 'Mi Carrito' : 'Finalizar Compra'}
      </h1>
      
      <main className="cart-main-container">      
        <div className="cart-layout">
          
          {/* COLUMNA IZQUIERDA COMPACTA */}
          <div className="cart-left-column">
            {paso === 'carrito' ? (
              items.length === 0 ? (
                <div className="cart-empty-section">
                  <ShoppingBag size={48} />
                  <p className="cart-empty-text">Tu carrito está vacío.</p>
                  <Link to="/" className="btn-go-shop">Ir a comprar</Link>
                </div>
              ) : (
                <div className="cart-items-list">
                  {items.map((item) => (
                    <div key={item.id} className="cart-item-row">
                      <div className="cart-item-img-container">
                        <img src={item.imagen} alt={item.nombre} className="cart-item-img" />
                      </div>

                      <div className="cart-item-details">
                        <h3 className="cart-item-name">{item.nombre}</h3>
                        <p className="cart-item-description">{item.descripcion}</p>
                        <span className="cart-item-unit-price">Precio unitario: S/ {item.precio.toFixed(2)}</span>
                      </div>

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
              )
            ) : (
              /* Aquí invocamos el subcomponente limpio pasando las variables por Props */
              <FormularioCheckout 
                metodoEntrega={metodoEntrega}
                setMetodoEntrega={setMetodoEntrega}
                metodoPago={metodoPago}
                setMetodoPago={setMetodoPago}
                distrito={distrito}
                setDistrito={setDistrito}
                direccion={direccion}
                setDireccion={setDireccion}
                onVolver={() => setPaso('carrito')}
              />
            )}
          </div>
      
          {/* COLUMNA DERECHA COMPACTA (RESUMEN) */}
          <aside className="cart-right-column">
            <div className="carrito-summary-card">
              <h2 className="summary-title">Resumen de Compra</h2>
              
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>S/ {subtotal.toFixed(2)}</span>
              </div>

              {metodoEntrega === 'domicilio' && (
                <div className="summary-row">
                  <span>Costo de envío:</span>
                  <span>S/ {costoEnvio.toFixed(2)}</span>
                </div>
              )}
              
              <div className="divider"></div>
              
              <div className="total-row">
                <span className="total-label">Total:</span>
                <span className="total-value">S/ {totalGeneral.toFixed(2)}</span>
              </div>
              
              <div className="cart-action-buttons">
                {paso === 'carrito' ? (
                  <>
                    <button 
                      className="btn-payment-now" 
                      onClick={() => setPaso('checkout')}
                      disabled={items.length === 0}
                    >
                      CONTINUAR COMPRA
                    </button>
                  </>
                ) : (
                  <button className="btn-final-pay" onClick={procesarPagoFinal}>
                    {metodoPago === 'yape_plin' ? 'PAGAR CON YAPE/PLIN' : 'PAGAR CON TARJETA'}
                  </button>
                )}
              </div>

            </div>
          </aside>

        </div>
      </main>

      <Footer/>
    </div>
  );
}