import { MapPin, Store, CreditCard, Smartphone } from "lucide-react";
import "../static/FormularioCheckout.css";

interface FormularioCheckoutProps {
  metodoEntrega: 'domicilio' | 'tienda';
  setMetodoEntrega: (tipo: 'domicilio' | 'tienda') => void;
  metodoPago: 'yape_plin' | 'tarjeta';
  setMetodoPago: (tipo: 'yape_plin' | 'tarjeta') => void;
  distrito: string;
  setDistrito: (valor: string) => void;
  direccion: string;
  setDireccion: (valor: string) => void;
  onVolver: () => void;
}

export function FormularioCheckout({
  metodoEntrega,
  setMetodoEntrega,
  metodoPago,
  setMetodoPago,
  distrito,
  setDistrito,
  direccion,
  setDireccion,
  onVolver
}: FormularioCheckoutProps) {
  return (
    <div className="checkout-forms-wrapper">
      
      {/* 1. Forma de Entrega */}
      <div className="checkout-card">
        <h3 className="checkout-card-title">1. Forma de Entrega</h3>
        <div className="checkout-options-grid">
          <div 
            className={`checkout-option-box ${metodoEntrega === 'domicilio' ? 'active' : ''}`}
            onClick={() => setMetodoEntrega('domicilio')}
          >
            <MapPin size={24} />
            <div>
              <span className="option-title">Envío a Domicilio</span>
              <span className="option-desc">Recíbelo en tu dirección (S/ 7.90)</span>
            </div>
          </div>

          <div 
            className={`checkout-option-box ${metodoEntrega === 'tienda' ? 'active' : ''}`}
            onClick={() => setMetodoEntrega('tienda')}
          >
            <Store size={24} />
            <div>
              <span className="option-title">Recojo en Tienda</span>
              <span className="option-desc">Listo en la farmacia principal (Gratis)</span>
            </div>
          </div>
        </div>

        {/* Campos condicionales si elige Domicilio */}
        {metodoEntrega === 'domicilio' && (
          <div className="checkout-address-fields">
            <div className="form-group">
              <label>Distrito *</label>
              <select value={distrito} onChange={(e) => setDistrito(e.target.value)}>
                <option value="">Selecciona tu distrito</option>
                <option value="san_borja">San Borja</option>
                <option value="surco">Santiago de Surco</option>
                <option value="miraflores">Miraflores</option>
                <option value="lima">Lima Centro</option>
              </select>
            </div>
            <div className="form-group">
              <label>Dirección exacta *</label>
              <input 
                type="text" 
                placeholder="Av. Las Artes Norte 450, Dpto 301" 
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Método de Pago */}
      <div className="checkout-card">
        <h3 className="checkout-card-title">2. Elige cómo pagar</h3>
        <div className="checkout-options-grid">
          <div 
            className={`checkout-option-box ${metodoPago === 'yape_plin' ? 'active' : ''}`}
            onClick={() => setMetodoPago('yape_plin')}
          >
            <Smartphone size={24} />
            <div>
              <span className="option-title">Yape / Plin</span>
              <span className="option-desc">Código QR o transferencia directa</span>
            </div>
          </div>

          <div 
            className={`checkout-option-box ${metodoPago === 'tarjeta' ? 'active' : ''}`}
            onClick={() => setMetodoPago('tarjeta')}
          >
            <CreditCard size={24} />
            <div>
              <span className="option-title">Tarjeta de Crédito o Débito</span>
              <span className="option-desc">Visa, Mastercard, Amex, etc.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enlace para regresar */}
      <button className="btn-back-to-cart" onClick={onVolver}>
        ← Volver a modificar el carrito
      </button>
    </div>
  );
}