import { Link } from "react-router-dom";
const UnauthorizedPage = () => {
    return (
      <div>
        <h1>Acceso no autorizado 🔒</h1>
        <p>No tienes permiso para ver esta página.</p>
        <Link to="/home">Volver al inicio</Link>
      </div>
    );
  };
  
  export default UnauthorizedPage;