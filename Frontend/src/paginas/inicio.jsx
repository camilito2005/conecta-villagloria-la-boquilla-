import { Link } from "react-router-dom";
const Manglar = "/imagenes/Manglares_LaBoquilla_Cartagena.jpg";  // ← SIN /public/
const Canoas = "/imagenes/Canoas.jpg";
const Guia = "/imagenes/Guia.jpg";
const Comida = "/imagenes/Comida.jpg";

import "../css/Home.css";

export function Inicio(){
    return (
    <>
      {/* Hero */}
      <section
        className="hero"
        style={{ backgroundImage: `url(${Manglar})` }}
      >
        <div className="overlay">
          <h2 className="text-hero">
            conecta con La Boquilla, turismo comunitario y sostenible
          </h2>
          <Link to="/reservas" className="hero-btn">
            Reserva tu experiencia
          </Link>
        </div>
      </section>

      {/* Tarjetas */}
      <section className="cards">
        <div className="card">
          <img src={Canoas} alt="Canoa" />
          <h3>Reservar Paseo en Canoa</h3>
          <Link to="/reservas" className="botones-enviar">
            Reservar
          </Link>
        </div>

        <div className="card">
          <img src={Guia} alt="Guías" />
          <h3>Guías Locales</h3>
          <Link to="/perfil" className="botones-enviar">
            Conocer
          </Link>
        </div>

        <div className="card">
          <img src={Comida} alt="Marketplace" />
          <h3>Marketplace de Artesanías y Comida</h3>
          <Link to="/marketplace" className="botones-enviar">
            Explorar
          </Link>
        </div>
      </section>
    </>
  );

}


