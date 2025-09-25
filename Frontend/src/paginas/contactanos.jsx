import React from "react";
import "../css/contactanos.css";

export function Contactanos() {
  return (
    <section className="contact-container">
      <h2>Contáctanos</h2>
      <p>¿Tienes dudas o sugerencias? Escríbenos y te responderemos lo antes posible.</p>

      <form className="contact-form">
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input type="text" id="nombre" placeholder="Tu nombre" required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo</label>
          <input type="email" id="email" placeholder="Tu correo electrónico" required />
        </div>

        <div className="form-group">
          <label htmlFor="mensaje">Mensaje</label>
          <textarea id="mensaje" rows="5" placeholder="Escribe tu mensaje..." required></textarea>
        </div>

        <button type="submit">Enviar</button>
      </form>
    </section>
  );
}
