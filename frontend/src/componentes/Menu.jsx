import { useState } from "react";
import { Link } from "react-router-dom";
import { CiBoxList } from "react-icons/ci";
import { TbTruckDelivery } from "react-icons/tb";
import { FaBox } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { BiSolidReport } from "react-icons/bi";
import { FaHome } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";

export const Menu = () => {
  const [open, setOpen] = useState(false);
  const hidenMenu = () => setOpen(!open);

  // Puedes agregar la propiedad "ruta" para cada item si es necesario
  const menuItems = [
    {
      icons: <FaHome size={24.5} />,
      label: "Home",
      ruta: "/"  // ruta a la home
    },
    {
      icons: <FaBox size={20} />,
      label: "Registro paquete",
      ruta: "/registropaq"  // ruta al CRUD de paquetes
    },
    {
      icons: <FaUserCircle />,
      label: "Usuarios",
      ruta: "/usuarios" // por ejemplo
    },
    {
      icons: <BiSolidReport size={23.9} />,
      label: "Reporte",
      ruta: "/reporte" // por ejemplo
    },
    {
      icons: <TbTruckDelivery size={23.5} />,
      label: "Provedores",
      ruta: "/provedores" // por ejemplo
    },
    {
      icons: <CiLogout size={26.5} />,
      label: "Cerrar Sesion",
      ruta: "/logout" // por ejemplo
    },
  ];

  return (
    <div>
      <nav className={`shadow-md h-screen bg-blue-900 text-white transition-all duration-300 ${open ? "w-64" : "w-10"}`}>
        <button className="w-64" onClick={hidenMenu}>
          <CiBoxList size={30} className="cursor-pointer m-1" />
        </button>
        <div>
          <img src="/logomediano.png" className={`${open ? 'w-50' : 'w-0'}`} alt="Logo" />
        </div>

        <ul className="flex-1">
          {menuItems.map((item, index) => (
            <li key={index} className="my-2 px3 py-2 hover:bg-blue-100 rounded-md duration-300 cursor-pointer flex gap-2 items-center group">
              {/* Envolvemos el contenido con Link para redireccionar */}
              <Link to={item.ruta} className="flex items-center gap-2 w-full">
                <p className="ml-2">{item.icons}</p>
                <p className={`${!open && "w-0 translate-x-24"} duration-500 overflow-hidden`}>
                  {item.label}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
