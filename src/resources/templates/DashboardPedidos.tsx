import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardHeader } from './fragments/DashboardHeader';

// Importación corregida según tu estructura de carpetas
import "../static/DashboardPedidos.css";

interface Pedido {
    id: string;
    cliente: string;
    fecha: string;
    total: number;
    estado: 'Entregado' | 'En Proceso' | 'Pendiente' | 'Cancelado';
}

export function DashboardPedidos() {
    const navigate = useNavigate();
    
    // Datos de ejemplo
    const [pedidos] = useState<Pedido[]>([
        { id: "#101", cliente: "Juan Torres", fecha: "2026-05-12", total: 150.50, estado: "Entregado" },
        { id: "#102", cliente: "Monica Sanchez", fecha: "2026-05-13", total: 85.00, estado: "En Proceso" },
        { id: "#103", cliente: "Ericka Delgado", fecha: "2026-05-13", total: 210.00, estado: "Pendiente" },
    ]);

    return (
        <div className="pedidos-container">
            <DashboardHeader />

            <div className="pedidos-content">
                {/* Sidebar similar al de compras */}
                <aside className="pedidos-sidebar">
                    <button className="btn-nuevo">Nuevo Pedido</button>
                    <button className="btn-actualizar">Actualizar</button>
                    <div className="filter-group">
                        <label>Desde:</label>
                        <input type="date" />
                        <label>Hasta:</label>
                        <input type="date" />
                    </div>
                    <button className="btn-buscar">Buscar</button>
                    <button className="btn-cerrar" onClick={() => navigate('/DashboardHome')}>Cerrar</button>
                </aside>

                <main className="pedidos-main">
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Cliente</th>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidos.map((p) => (
                                    <tr key={p.id}>
                                        <td>{p.id}</td>
                                        <td><strong>{p.cliente}</strong></td>
                                        <td>{p.fecha}</td>
                                        <td className="total-text">s/{p.total.toFixed(2)}</td>
                                        <td>
                                            <span className={`badge-status ${p.estado.toLowerCase().replace(" ", "-")}`}>
                                                {p.estado}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn-action">✏️</button>
                                            <button className="btn-action">🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}