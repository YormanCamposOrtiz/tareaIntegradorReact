import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';



import { DashboardHeader } from './fragments/DashboardHeader';



import "../static/DashboardCompras.css";



// Definimos la estructura de los datos que vendrán de Spring Boot

interface DashboardCompras {

    id_compra: number;

    usuario: string;

    tipo: string;

    fecha: string;

    total: number;

}



export function DashboardCompras() {

    const navigate = useNavigate();

    const [compras, setCompras] = useState<DashboardCompras[]>([]);



    return (

        <div className="compras-container">



           <DashboardHeader />



            <div className="compras-content">

                <aside className="compras-sidebar">

                    <button className="btn-anular">Anular Compra</button>

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



                <main className="compras-main">

                    <div className="table-wrapper">

                        <table>

                            <thead>

                                <tr>

                                    <th>ID_Compra</th>

                                    <th>Usuario</th>

                                    <th>Proveedor</th>

                                    <th>Tipo</th>

                                    <th>Fecha</th>

                                    <th>Total</th>

                                </tr>

                            </thead>


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