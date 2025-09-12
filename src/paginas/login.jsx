import "../css/login.css";

export function Login() {
  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <p>Accede a tu cuenta para continuar</p>

      <form className="login-form">
        <label htmlFor="email">Correo electrónico</label>
        <input type="email" id="email" placeholder="ejemplo@correo.com" />

        <label htmlFor="password">Contraseña</label>
        <input type="password" id="password" placeholder="********" />

        <button type="submit" className="login-btn">
          Entrar
        </button>
      </form>

      <div className="login-footer">
        ¿No tienes cuenta? <a href="/registro">Regístrate aquí</a>
      </div>
    </div>
  );
}
