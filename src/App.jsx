import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import api from './api';

import { Inicio } from "./resources/templates/Inicio";
import { Login } from "./resources/templates/Login";
import { DashboardHome } from "./resources/templates/DashboardHome";
import { Carrito } from "./resources/templates/Carrito";
import { Perfil } from "./resources/templates/Perfil";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/DashboardHome" element={<DashboardHome />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;