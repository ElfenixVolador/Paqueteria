// Menu.jsx actualizado para usar <Link> de react-router-dom
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChartPie, FaHome, FaBox, FaTruck, FaBell, FaUserCircle } from 'react-icons/fa';
import { BiSolidReport } from 'react-icons/bi';
import { CiLogout, CiBoxList } from 'react-icons/ci';

const Menu = () => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  const menuItems = [
    { icon: <FaChartPie size={22} />, label: 'Dashboard', ruta: '/dashboard' },
    { icon: <FaHome size={22} />, label: 'Home', ruta: '/home' },
    { icon: <FaBox size={22} />, label: 'Registro paquete', ruta: '/registropaq' },
    { icon: <FaTruck size={22} />, label: 'Seguimiento', ruta: '/seguimiento' },
    { icon: <FaBell size={22} />, label: 'Notificaciones', ruta: '/notificaciones' },
    { icon: <FaUserCircle size={22} />, label: 'Usuarios', ruta: '/usuarios' },
    { icon: <BiSolidReport size={22} />, label: 'Reporte', ruta: '/reporte' },
  ];

  return (
    <nav className={`shadow-md h-screen bg-blue-900 text-white transition-all duration-300 ${open ? 'w-64' : 'w-10'}`}>
      <button className="w-full p-2" onClick={toggle}>
        <CiBoxList size={30} />
      </button>

      <div className="flex justify-center my-4">
        <Link to="/dashboard">
          <img
            src="/logomediano.png"
            alt="Logo"
            className={`transition-all duration-300 ${open ? 'w-48 opacity-100' : 'w-0 opacity-0'}`}
          />
        </Link>
      </div>

      <ul className="space-y-1">
        {menuItems.map((item, index) => (
          <li key={index} className="px-3 py-2 hover:bg-blue-700 rounded-md">
            <Link to={item.ruta} className="flex items-center gap-2">
              {item.icon}
              <span className={`${!open && 'hidden'} transition-all duration-300`}>{item.label}</span>
            </Link>
          </li>
        ))}
        <li className="px-3 py-2 hover:bg-blue-700 rounded-md">
          <Link to="/login" onClick={() => localStorage.removeItem('token')} className="flex items-center gap-2">
            <CiLogout size={22} />
            <span className={`${!open && 'hidden'} transition-all duration-300`}>Cerrar Sesión</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
