import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardHeader } from './fragments/DashboardHeader';
import "../static/DashboardCompras.css";

interface DetalleCompra {
    id?: number;
    producto: { id: number; nombre?: string };
    cantidad: number;
    precioCompra: number;
    subtotal?: number;
}

interface Compra {
    id?: number; // Sincronizado con 'id' de Compra.java
    usuario: { id: number; nombre?: string } | null; // Sincronizado con tu entidad Usuario
    proveedor: string;
    fecha?: string;
    total?: number;
    detalles: DetalleCompra[];
}

export function DashboardCompras() {
    const navigate = useNavigate();
    const [compras, setCompras] = useState<Compra[]>([]); // Cambiado de any[] a Compra[] para mejor control
    const [compraSeleccionada, setCompraSeleccionada] = useState<Compra | null>(null);
    
    // --- ESTADOS PARA EL INGRESO DE NUEVA COMPRA ---
    const [mostrarModal, setMostrarModal] = useState(false);
    const [proveedor, setProveedor] = useState('');
    const [idProductoInput, setIdProductoInput] = useState('');
    const [cantidadInput, setCantidadInput] = useState(1);
    const [precioInput, setPrecioInput] = useState(0.0);
    const [detallesNuevaCompra, setDetallesNuevaCompra] = useState<DetalleCompra[]>([]);

    useEffect(() => {
        listarCompras();
    }, []);

    const listarCompras = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/compras");
            if (response.ok) {
                const data = await response.json();
                setCompras(data);
            }
        } catch (error) {
            console.error("Error al conectar con la API de compras:", error);
        }
    };

    // Agregar un producto a la lista temporal del detalle de la compra
    const agregarItemTemporal = () => {
        if (!idProductoInput || cantidadInput <= 0 || precioInput <= 0) {
            alert("Por favor, ingresa un ID de producto, cantidad y precio válidos.");
            return;
        }

        const nuevoItem: DetalleCompra = {
            producto: { id: parseInt(idProductoInput) },
            cantidad: cantidadInput,
            precioCompra: precioInput
        };

        setDetallesNuevaCompra([...detallesNuevaCompra, nuevoItem]);
        // Limpiar inputs del producto para el siguiente
        setIdProductoInput('');
        setCantidadInput(1);
        setPrecioInput(0.0);
    };

    // Enviar la estructura final JSON a tu Spring Boot CompraController
    const guardarNuevaCompra = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!proveedor.trim()) {
            alert("El nombre del proveedor es obligatorio.");
            return;
        }
        if (detallesNuevaCompra.length === 0) {
            alert("Debes añadir al menos un producto al detalle de la compra.");
            return;
        }
        
        // Estructura idéntica al modelo Compra.java
        const payloadCompra: Compra = {
            usuario: { id: 1 }, // ID del administrador logueado
            proveedor: proveedor,
            detalles: detallesNuevaCompra
        };

        try {
            const response = await fetch("http://localhost:8080/api/compras", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payloadCompra)
            });

            if (response.ok) {
                alert("¡Compra e ingreso de stock registrados correctamente!");
                setMostrarModal(false);
                // Resetear el formulario temporal
                setProveedor('');
                setDetallesNuevaCompra([]);
                // Recargar la tabla del historial con los nuevos datos actualizados
                listarCompras();
            } else {
                const errorText = await response.text();
                alert("Error al procesar la compra: " + errorText);
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert("No se pudo conectar con el servidor backend.");
        }
    };

    return (
        <div className="compras-container">
            <DashboardHeader />

            <div className="compras-content">
                <aside className="compras-sidebar">
                    {/* BOTÓN DISPARADOR DE REGISTRO */}
                    <button className="btn-actualizar" style={{backgroundColor: '#28a745', color: 'white'}} onClick={() => setMostrarModal(true)}>
                        + Nueva Compra
                    </button>
                    <button className="btn-anular">Anular Compra</button>
                    <button className="btn-actualizar" onClick={listarCompras}>Actualizar</button>
                    <div className="filter-group">
                        <label>Desde:</label>
                        <input type="date" />
                        <label>Hasta:</label>
                        <input type="date" />
                    </div>
                    <button className="btn-buscar">Buscar</button>
                </aside>

                <main className="compras-main">
                    {/* Historial General */}
                    <div className="table-wrapper">
                        <h3>Historial de Órdenes de Compra</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID Compra</th>
                                    <th>Proveedor</th>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {compras.map((c) => (
                                    <tr key={c.id} onClick={() => setCompraSeleccionada(c)} style={{cursor:'pointer'}}>
                                        <td>#{c.id}</td> {/* Mapeado correctamente a .id */}
                                        <td>{c.proveedor}</td>
                                        <td>{c.fecha ? new Date(c.fecha).toLocaleString() : '---'}</td>
                                        <td>S/ {c.total?.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Detalle */}
                    <div className="table-wrapper" style={{ marginTop: '20px' }}>
                        <h3>Detalle de la Compra Seleccionada</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Producto ID</th>
                                    <th>Cantidad</th>
                                    <th>Precio Compra</th>
                                    <th>Sub Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {compraSeleccionada?.detalles && compraSeleccionada.detalles.length > 0 ? (
                                    compraSeleccionada.detalles.map((d) => (
                                        <tr key={d.id || d.producto.id}>
                                            <td>ID: {d.producto.id}</td>
                                            <td>{d.cantidad} u.</td>
                                            <td>S/ {d.precioCompra.toFixed(2)}</td>
                                            <td>S/ {d.subtotal ? d.subtotal.toFixed(2) : (d.cantidad * d.precioCompra).toFixed(2)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} style={{textAlign: 'center', color: '#888'}}>Selecciona una compra para ver sus artículos</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {/* --- INTERFAZ INTERNA MODAL DE REGISTRO --- */}
            {mostrarModal && (
                <div className="modal-overlay" style={modalStyles.overlay}>
                    <div className="modal-body" style={modalStyles.body}>
                        <h2>Registrar Ingreso de Mercadería (Compra)</h2>
                        <form onSubmit={guardarNuevaCompra}>
                            <div style={{marginBottom: '15px'}}>
                                <label style={{display: 'block'}}>Proveedor:</label>
                                <input 
                                    type="text" 
                                    value={proveedor} 
                                    onChange={(e) => setProveedor(e.target.value)} 
                                    placeholder="Ej. Distribuidora Tecnológica SAC"
                                    style={modalStyles.input}
                                />
                            </div>

                            <fieldset style={{border: '1px solid #ddd', padding: '10px', marginBottom: '15px'}}>
                                <legend>Agregar Artículos al Inventario</legend>
                                <div style={{display: 'flex', gap: '10px', alignItems: 'flex-end'}}>
                                    <div>
                                        <label style={{fontSize: '12px'}}>ID Producto:</label>
                                        <input type="number" value={idProductoInput} onChange={(e) => setIdProductoInput(e.target.value)} style={modalStyles.inputCompact}/>
                                    </div>
                                    <div>
                                        <label style={{fontSize: '12px'}}>Cantidad:</label>
                                        <input type="number" value={cantidadInput} onChange={(e) => setCantidadInput(parseInt(e.target.value) || 0)} style={modalStyles.inputCompact}/>
                                    </div>
                                    <div>
                                        <label style={{fontSize: '12px'}}>P. Compra Unitario (S/):</label>
                                        <input type="number" step="0.01" value={precioInput} onChange={(e) => setPrecioInput(parseFloat(e.target.value) || 0.0)} style={modalStyles.inputCompact}/>
                                    </div>
                                    <button type="button" onClick={agregarItemTemporal} style={{padding: '6px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px'}}>
                                        + Añadir
                                    </button>
                                </div>

                                {/* Previsualización de los productos agregados a la lista actual de compras */}
                                <ul style={{marginTop: '10px', fontSize: '13px', maxHeight: '100px', overflowY: 'auto'}}>
                                    {detallesNuevaCompra.map((item, index) => (
                                        <li key={index}>📦 Prod ID: {item.producto.id} — Cantidad: {item.cantidad} u. — Costo U: S/ {item.precioCompra.toFixed(2)}</li>
                                    ))}
                                </ul>
                            </fieldset>

                            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
                                <button type="button" onClick={() => setMostrarModal(false)} style={{padding: '8px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px'}}>
                                    Cancelar
                                </button>
                                <button type="submit" style={{padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px'}}>
                                    Guardar e Incrementar Stock
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
// Estilos rápidos en línea para el modal
const modalStyles = {
    overlay: { position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    body: { backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '550px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' },
    input: { width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' },
    inputCompact: { width: '90px', padding: '6px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }
};