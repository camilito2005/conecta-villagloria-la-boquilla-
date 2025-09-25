import "../css/catalogo.css";

export function Marketplace() {
  const productos = [
    { id: 1, nombre: "Collar artesanal", precio: "50.000", img: "/src/assets/collares-artesanales.jpeg" },
    { id: 2, nombre: "Comida típica", precio: "30.000", img: "/src/assets/comida.jpg" },
  ];

  return (
    <div className="marketplace-container">
      <h2>Marketplace</h2>
      <div className="marketplace-grid">
        {productos.map((p) => (
          <div key={p.id} className="marketplace-card">
            <img src={p.img} alt={p.nombre} />
            <h3>{p.nombre}</h3>
            <p>Precio: ${p.precio}</p>
            <button>Comprar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
