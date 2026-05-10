import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { DashboardHeader } from './fragments/DashboardHeader';

import "../static/DashboardVentas.css";

// Definimos la estructura de los datos que vendrán de Spring Boot
interface DashboardVentas {
    id_venta: number;
    usuario: string;
    tipo: string;
    fecha: string;
    total: number;
}

export function DashboardVentas() {
    const navigate = useNavigate();
    const [ventas, setVentas] = useState<DashboardVentas[]>([]);

    return (
        <div className="ventas-container">

           <DashboardHeader />

            <div className="ventas-content">
                <aside className="ventas-sidebar">
                    <button className="btn-anular">Anular Venta</button>
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

                <main className="ventas-main">
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID_Venta</th>
                                    <th>Usuario</th>
                                    <th>Tipo</th>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>001</td>
                                    <td>Admin</td>
                                    <td>Contado</td>
                                    <td>07/05/2026</td>
                                    <td>$150.00</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Presentación</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unid</th>
                                    <th>Sub Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Aquí irán los detalles */}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}
