import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardHeader } from './fragments/DashboardHeader';
import api from "../../api"; 

import "../static/DashboardPedidos.css";
import "../static/DashboardVentas.css";
import "../static/RegistrarMovimiento.css";

interface DetallePedido {
    id?: number;
    cantidad: number;
    producto?: {
        id: number;
        nombre: string;
        precio_venta: number; 
    };
}

interface Pedido {
    id: number;
    usuario?: {
        id: number;
        username?: string;
        nombre?: string;
    } | null;
    fecha: string;
    total: number;
    estado: string; // PENDIENTE, PREPARANDO, ENVIADO, ENTREGADO, CANCELADO
    detalles?: DetallePedido[]; 
}

export function DashboardPedidos() {
    const navigate = useNavigate();

    // Estados de datos de la API
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);

    // Estados para el filtrado por fechas
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');

    useEffect(() => {
        fetchPedidos();
    }, []);

    const fetchPedidos = async (desde?: string, hasta?: string) => {
        try {
            let url = '/pedidos';
            if (desde && hasta) {
                url += `?inicio=${desde}&fin=${hasta}`;
            }

            const response = await api.get(url);
            setPedidos(response.data);
            setPedidoSeleccionado(null);
        } catch (error) {
            console.error("Error al cargar pedidos desde Spring Boot:", error);
        }
    };

    // FUNCIÓN PARA DESCARGAR EL REPORTE EN PDF (CORREGIDA)
    const descargarReportePdf = async (endpoint: string, nombreArchivo: string) => {
        try {
            const token = localStorage.getItem("token"); // Obtenemos tu Token JWT

            // Si hay filtros de fecha aplicados, los añadimos al endpoint del PDF
            let urlFinal = endpoint;
            if (fechaDesde && fechaHasta) {
                urlFinal += `?inicio=${fechaDesde}&fin=${fechaHasta}`;
            }

            const response = await api.get(urlFinal, {
                responseType: 'blob', // OBLIGATORIO para leer flujos binarios de PDF
                headers: {
                    'Authorization': `Bearer ${token}` // Evita el error 403 Forbidden
                }
            });

            // Crear una URL del objeto binario del PDF
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', nombreArchivo); 
            document.body.appendChild(link);
            link.click();
            
            // Limpiar el DOM de forma segura
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error al descargar el archivo PDF:", error);
            alert("No se pudo generar el documento PDF. Comprueba tus accesos.");
        }
    };

    const descargarExcel = async () => {
        try {
            let url = '/pedidos/exportar';
            if (fechaDesde && fechaHasta) {
                url += `?inicio=${fechaDesde}&fin=${fechaHasta}`;
            }

            const response = await api.get(url, {
                responseType: 'blob', // OBLIGATORIO para procesar datos binarios
            });

            const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = urlBlob;
            link.setAttribute('download', 'reporte_pedidos.xlsx'); 
            document.body.appendChild(link);
            link.click();
            
            // Limpieza segura en el DOM
            link.remove();
            window.URL.revokeObjectURL(urlBlob);
        } catch (error) {
            console.error("Error al descargar el archivo Excel", error);
            alert("No se pudo descargar el reporte en Excel.");
        }
    };

    const actualizarEstado = async (nuevoEstado: string) => {
        if (!pedidoSeleccionado) {
            alert("Por favor, seleccione un pedido en la tabla superior.");
            return;
        }

        try {
            await api.put(
                `/pedidos/${pedidoSeleccionado.id}/estado`,
                null,
                {
                    params: { nuevoEstado }
                }
            );

            alert(`¡Estado del pedido actualizado a ${nuevoEstado} correctamente!`);
            fetchPedidos(fechaDesde, fechaHasta);
        } catch (error) {
            console.error(error);
            alert("No se pudo actualizar el estado del pedido.");
        }
    };

    const cancelarPedido = async () => {
        if (!pedidoSeleccionado) {
            alert("Por favor, seleccione un pedido.");
            return;
        }

        const confirmar = window.confirm(
            `¿Está seguro de que desea CANCELAR el pedido #${String(pedidoSeleccionado.id).padStart(3, '0')}?\n` +
            `Esto anulará el proceso de envío y gestionará el inventario asignado.`
        );

        if (!confirmar) return;

        try {
            await api.put(`/pedidos/${pedidoSeleccionado.id}/cancelar`);
            alert("¡Pedido cancelado correctamente!");
            fetchPedidos(fechaDesde, fechaHasta);
        } catch (error) {
            console.error(error);
            alert("No se pudo cancelar el pedido.");
        }
    };

    const handleBuscarPorFechas = () => {
        if (!fechaDesde || !fechaHasta) {
            alert("Por favor, seleccione ambas fechas para aplicar el filtro.");
            return;
        }
        if (new Date(fechaDesde) > new Date(fechaHasta)) {
            alert("La fecha inicial ('Desde') no puede ser posterior a la fecha final ('Hasta').");
            return;
        }
        fetchPedidos(fechaDesde, fechaHasta);
    };

    const handleLimpiarFiltro = () => {
        setFechaDesde('');
        setFechaHasta('');
        fetchPedidos(); 
    };

    return (
        <div className="ventas-container"> 
            <DashboardHeader />

            <div className="ventas-content">
                {/* SIDEBAR CON CONTROLES */}
                <aside className="ventas-sidebar">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                        <label 
                            htmlFor="estado-pedido" 
                            style={{ fontSize: '12px', fontWeight: 'bold', color: '#7f8c8d' }}
                        >
                            Cambiar Estado del Pedido:
                        </label>
                        <select
                            id="estado-pedido"
                            className="select-estado"
                            style={{
                                padding: '10px',
                                borderRadius: '6px',
                                border: '1px solid #ccc',
                                fontSize: '14px',
                                fontWeight: '600',
                                backgroundColor: !pedidoSeleccionado 
                                    ? '#95a5a6' 
                                    : pedidoSeleccionado.estado === 'PREPARANDO' ? '#f39c12'
                                    : pedidoSeleccionado.estado === 'ENVIADO' ? '#3498db'
                                    : pedidoSeleccionado.estado === 'ENTREGADO' ? '#2ecc71'
                                    : '#34495e', 
                                color: 'white',
                                cursor: pedidoSeleccionado ? 'pointer' : 'not-allowed',
                                outline: 'none',
                                transition: 'background-color 0.3s ease'
                            }}
                            disabled={!pedidoSeleccionado}
                            value={pedidoSeleccionado?.estado || ""}
                            onChange={(e) => {
                                if (e.target.value) {
                                    actualizarEstado(e.target.value);
                                }
                            }}
                        >
                            {!pedidoSeleccionado && <option value="">Seleccione un pedido...</option>}
                            
                            {pedidoSeleccionado?.estado === 'PENDIENTE' && (
                                <option value="PENDIENTE" style={{ color: '#34495e', backgroundColor: 'white' }}>
                                    ⏳ Pendiente
                                </option>
                            )}

                            <option value="PREPARANDO" style={{ color: '#f39c12', backgroundColor: 'white' }}>
                                👨‍🍳 Preparando
                            </option>
                            <option value="ENVIADO" style={{ color: '#3498db', backgroundColor: 'white' }}>
                                🚚 Enviado
                            </option>
                            <option value="ENTREGADO" style={{ color: '#2ecc71', backgroundColor: 'white' }}>
                                ✅ Entregado
                            </option>
                        </select>
                    </div>

                    <button
                        className="btn-anular"
                        onClick={cancelarPedido}
                        style={{
                            backgroundColor: pedidoSeleccionado ? '#e74c3c' : '#95a5a6',
                            color: 'white',
                            marginTop: '15px',
                            cursor: pedidoSeleccionado ? 'pointer' : 'not-allowed'
                        }}
                        disabled={!pedidoSeleccionado}
                    >
                        Cancelar Pedido
                    </button>

                    {/* SECCIÓN DEL FILTRO DE FECHAS */}
                    <div className="filter-group" style={{ marginTop: '15px' }}>
                        <label>Desde:</label>
                        <input 
                            type="date" 
                            value={fechaDesde}
                            onChange={(e) => setFechaDesde(e.target.value)}
                        />
                        <label>Hasta:</label>
                        <input 
                            type="date" 
                            value={fechaHasta}
                            onChange={(e) => setFechaHasta(e.target.value)}
                        />
                    </div>

                    <button className="btn-buscar" onClick={handleBuscarPorFechas}>Buscar</button>

                    {(fechaDesde || fechaHasta) && (
                        <button 
                            className="btn-buscar" 
                            style={{ backgroundColor: '#ffffff', marginTop: '5px' }} 
                            onClick={handleLimpiarFiltro}
                        >
                            Limpiar Filtro
                        </button>
                    )}
                    <button className="btn-buscar" onClick={descargarExcel}>Descargar Excel</button>
                    {/* CORRECCIÓN AQUÍ: Cambiado de /productos/exportar-pdf a /pedidos/exportar-pdf */}
                    <button onClick={() => descargarReportePdf('/pedidos/exportar-pdf', 'reporte_pedidos.pdf')} className="btn-pdf">Exportar a PDF</button>
                    <button className="btn-cerrar" onClick={() => navigate('/DashboardHome')}>Cerrar</button>
                </aside>

                {/* CUERPO PRINCIPAL CON TABLAS */}
                <main className="ventas-main">
                    <div className="table-wrapper">
                        <h3>Historial de Pedidos Web</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID Pedido</th>
                                    <th>Cliente / Usuario</th>
                                    <th>Fecha Solicitud</th>
                                    <th>Total a Pagar</th>
                                    <th>Estado Actual</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidos.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', padding: '10px' }}>No hay pedidos registrados en este rango.</td>
                                    </tr>
                                ) : (
                                    pedidos.map(p => {
                                        const isSelected = pedidoSeleccionado?.id === p.id;
                                        
                                        let estadoColor = '#7f8c8d';
                                        if (p.estado === 'PENDIENTE') estadoColor = '#e67e22';
                                        if (p.estado === 'PREPARANDO') estadoColor = '#f1c40f';
                                        if (p.estado === 'ENVIADO') estadoColor = '#3498db';
                                        if (p.estado === 'ENTREGADO') estadoColor = '#2ecc71';
                                        if (p.estado === 'CANCELADO') estadoColor = '#e74c3c';

                                        return (
                                            <tr
                                                key={p.id}
                                                onClick={() => setPedidoSeleccionado(p)}
                                                style={{
                                                    cursor: 'pointer',
                                                    backgroundColor: isSelected ? '#ebf5fb' : '',
                                                    fontWeight: isSelected ? 'bold' : 'normal'
                                                }}
                                                className={isSelected ? "fila-seleccionada" : ""}
                                            >
                                                <td>{String(p.id).padStart(3, '0')}</td>
                                                <td>{p.usuario?.nombre || p.usuario?.username || 'Cliente Externo'}</td>
                                                <td>{p.fecha ? new Date(p.fecha).toLocaleString() : 'Fecha no disponible'}</td>
                                                <td style={{ fontWeight: 'bold', color: '#27ae60' }}>
                                                    S/. {(p.total || 0).toFixed(2)}
                                                </td>
                                                <td style={{ fontWeight: 'bold', color: estadoColor }}>
                                                    {p.estado}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="table-wrapper">
                        <h3>
                            {pedidoSeleccionado
                                ? `Productos del Pedido #${String(pedidoSeleccionado.id).padStart(3, '0')}`
                                : 'Seleccione un pedido para ver sus artículos'}
                        </h3>

                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre del Producto</th>
                                    <th>Cantidad Solicitada</th>
                                    <th>Precio Unitario</th>
                                    <th>Sub Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!pedidoSeleccionado ? (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: 'center', padding: '15px', color: '#7f8c8d' }}>
                                            Ningún pedido seleccionado en la tabla superior.
                                        </td>
                                    </tr>
                                ) : !pedidoSeleccionado.detalles || pedidoSeleccionado.detalles.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: 'center', padding: '15px', color: '#e74c3c' }}>
                                            Este pedido no registra artículos asociados.
                                        </td>
                                    </tr>
                                ) : (
                                    pedidoSeleccionado.detalles.map((d, index) => {
                                        const precUnit = d.producto?.precio_venta || 0;
                                        const subT = precUnit * d.cantidad;
                                        
                                        return (
                                            <tr key={d.id || index}>
                                                <td>{d.producto?.nombre || `Producto ID: ${d.producto?.id || 'Desconocido'}`}</td>
                                                <td>{d.cantidad} u.</td>
                                                <td>S/. {precUnit.toFixed(2)}</td>
                                                <td style={{ fontWeight: 'bold' }}>S/. {subT.toFixed(2)}</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}