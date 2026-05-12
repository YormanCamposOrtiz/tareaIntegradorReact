import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import { ShoppingBag, User, Heart, Clock, Shield, Zap , Home ,TrendingUp } from "lucide-react";

import { Header } from './fragments/Header';
import { Footer } from './fragments/Footer';

import api from "../../api";

import "../static/Inicio.css";
import "../static/Header.css";
import "../static/Footer.css";
import "../static/Global.css";

import imagen1 from "/src/resources/static/assets/imagen1.jpg";
import imagen2 from "/src/resources/static/assets/imagen2.png";
import imagen3 from "/src/resources/static/assets/imagen3.jpg";

export function Inicio() {

  // --- NUEVOS ESTADOS PARA LA API ---
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Mantenemos el estado para el temporizador y el carrusel
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });
  const [selectedOffer, setSelectedOffer] = useState(0);

  // 2. Datos locales (Sin llamadas a API por ahora)
  const offers = [
    { title: "20% OFF Vitaminas", image: imagen3, discount: 20, category: "Vitaminas" },
    { title: "Envío GRATIS +$50", image: imagen2, discount: 0, category: "Envío" },
    { title: "15% OFF Medicamentos", image: imagen1, discount: 15, category: "Medicamentos" },
  ];


  // --- LLAMADA A SPRING BOOT ---
  useEffect(() => {
    api.get("/inicio/datos")
      .then((response) => {
        // Guardamos las categorías que vienen de tu BaseController.java
        setCategories(response.data.categorias);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error conectando con el backend:", error);
        setLoading(false);
      });
  }, []);

  // 3. Temporizador
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
            else { hours = 12; minutes = 45; seconds = 30; }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 4. Auto-carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedOffer(prev => (prev + 1) % offers.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [offers.length]);

return (

<div className="home-container min-h-screen bg-gray-50">

<Header />

{/* Banner de Oferta */}
<section className="promo-banner">
  <div className="promo-content">
    {/* Texto de la izquierda */}
    <div className="flex items-center gap-2 text-white">
<span className="font-extrabold tracking-wider text-sm flex items-center gap-2">
  OFERTA ESPECIAL TERMINA EN:
</span>
    </div>
    
    {/* Contenedor de los bloques del reloj */}
    <div className="timer-group">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="timer-box">
          {/* Valor numérico */}
          <span className="timer-value">
            {String(value).padStart(2, '0')}
          </span>
          {/* Texto descriptivo al lado */}
          <span className="timer-label">
            {unit === "hours" ? "horas" : unit === "minutes" ? "min" : "seg"}
          </span>
        </div>
      ))}
    </div>
  </div>
</section>

<main className="w-full px-6 py-10">

  <div className="section-header">
    <h2 className="section-title">
      ¡Cuida tu salud!
    </h2>
    <p className="section-subtitle">
      Todo lo que necesitas en un solo lugar
    </p>
  </div>


{/* Carrusel */}
<div className="carousel-container">

  {/* 🔥 TEXTO ARRIBA (FUERA DEL CARRUSEL) */}
  <div className="carousel-header">
    <h2 className="carousel-title">
      {offers[selectedOffer].title}
    </h2>
  </div>

  {/* 🔥 CARRUSEL */}
  <div className="carousel-card fade-in">
    
    <img 
      src={offers[selectedOffer].image} 
      alt={offers[selectedOffer].title} 
      className="carousel-image"
    />

    <div className="carousel-overlay">
      <button className="carousel-btn">
        Ver Ofertas
      </button>
    </div>

  </div>
</div>


{/* Sección de Categorías */}
<section className="mt-16 w-full flex flex-col items-center px-4">

  <div className="category-grid">
    {categories.map((cat, idx) => (
      <Link key={idx} to="/productos" className="category-card">
        {/* El círculo con el emoji centrado */}
        <div className={`icon-circle ${cat.color}`}>
          {cat.icon}
        </div>
        
        {/* Texto en Negro */}
        <h4>{cat.name}</h4>
        
        {/* Contador en Naranja */}
        <p>{cat.count} productos</p>
      </Link>
    ))}
  </div>
</section>


{/* Sección de Beneficios */}
<section className="benefits-section">
  <div className="container mx-auto">
    <h3 className="text-4xl font-extrabold mb-12 text-center text-gray-900 main-title">
      ¿Por qué MediExpress?
    </h3>
    
    {/* Contenedor con la nueva clase grid */}
    <div className="benefits-grid">
      {[
        { 
          icon: Zap, 
          title: "Rápido y Fácil", 
          desc: "Compra en minutos con nuestra interfaz optimizada." 
        },
        { 
          icon: Shield, 
          title: "Calidad Garantizada", 
          desc: "Productos con certificación sanitaria oficial." 
        },
        { 
          icon: ShoppingBag, 
          title: "Entrega Express", 
          desc: "Logística propia para entregas en el mismo día." 
        },
      ].map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="benefit-card">
            <div className="icon-wrapper">
              <Icon className="w-10 h-10" />
            </div>
            <h4 className="benefit-title">{item.title}</h4>
            <p className="benefit-desc">{item.desc}</p>
          </div>
        );
      })}
    </div>
  </div>
</section>

</main>

<Footer/>

</div>

  );
}