import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import api from './api';


import { Inicio } from "./resources/templates/Inicio";
import { Login } from "./resources/templates/Login";
import { Carrito } from "./resources/templates/Carrito";
import { Perfil } from "./resources/templates/Perfil";
import { Registro } from "./resources/templates/Registro";
import { RecuperarPassword } from "./resources/templates/RecuperarPassword";
import { RestablecerPassword } from "./resources/templates/RestablecerPassword";

import { DashboardProductos } from './resources/templates/DashboardProductos';
import { DashboardHome } from "./resources/templates/DashboardHome";
import { DashboardVentas } from "./resources/templates/DashboardVentas";
import { DashboardCompras } from "./resources/templates/DashboardCompras";


function App() {

  return (

    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar" element={<RecuperarPassword />} />
        <Route path="/restablecer" element={<RestablecerPassword />} />

        <Route path="/DashboardHome" element={<DashboardHome />} />
        <Route path="/DashboardVentas" element={<DashboardVentas />} />
        <Route path="/DashboardCompras" element={<DashboardCompras />} />
        <Route path="/DashboardProductos" element={<DashboardProductos />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;