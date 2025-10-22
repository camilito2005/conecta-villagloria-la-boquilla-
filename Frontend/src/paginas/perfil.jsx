import "../css/perfil.css";

export function Perfil() {
  return (
    <div className="perfil-container">
      {/* Cabecera del perfil */}
      <div className="perfil-header">
        <img
          src="/src/assets/Guia.jpg"
          alt="Foto de perfil"
        />
        <h2>Camilo marrugo barrios</h2>
        <p>Guía local certificado</p>
      </div>

      {/* Información del usuario */}
      <div className="perfil-info">
        <div>
          <label>Nombre</label>
          <p>Camilo</p>
        </div>
        <div>
          <label>Correo</label>
          <p>Camilo@correo.com</p>
        </div>
        <div>
          <label>cargo</label>
          <p>El fk admin</p>
        </div>
        <div>
          <label>Teléfono</label>
          <p>+57 300 123 4567</p>
        </div>
        <div>
          <label>direccion</label>
          <p>la boquilla</p>
        </div>
        <div>
          <label>Idiomas</label>
          <p>Español, Inglés</p>
        </div>
      </div>

      {/* Acciones */}
      <div className="perfil-actions">
        <button className="perfil-btn">Editar Perfil</button>
        <button className="perfil-btn">Cerrar Sesión</button>
      </div>
    </div>
  );
}
