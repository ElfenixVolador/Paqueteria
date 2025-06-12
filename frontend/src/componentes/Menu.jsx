import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaChartPie,
  FaHome,
  FaBox,
  FaTruck,
  FaBell,
  FaUserCircle,
  FaUserShield
} from 'react-icons/fa';
import { BiSolidReport } from 'react-icons/bi';
import { CiLogout, CiBoxList } from 'react-icons/ci';
import { tienePermiso } from '../utils/permisos';

const Menu = () => {
  const [open, setOpen] = useState(false);
  const usuario = JSON.parse(localStorage.getItem('usuario')); // ✅

  const toggle = () => setOpen(!open);

  const menuItems = [
    {
      icon: <FaChartPie size={22} />,
      label: 'Dashboard',
      ruta: '/dashboard',
      modulo: 'dashboard',
      accion: 'ver'
    },
    {
      icon: <FaHome size={22} />,
      label: 'Home',
      ruta: '/home',
      modulo: null, // visible para todos
      accion: null
    },
    {
      icon: <FaBox size={22} />,
      label: 'Registro paquete',
      ruta: '/registropaq',
      modulo: 'paquetes',
      accion: 'crear'
    },
    {
      icon: <FaTruck size={22} />,
      label: 'Seguimiento',
      ruta: '/seguimiento',
      modulo: 'paquetes',
      accion: 'ver'
    },
    {
      icon: <FaBell size={22} />,
      label: 'Notificaciones',
      ruta: '/notificaciones',
      modulo: 'notificaciones',
      accion: 'ver'
    },
    {
      icon: <FaUserCircle size={22} />,
      label: 'Usuarios',
      ruta: '/usuarios',
      modulo: 'usuarios',
      accion: 'ver'
    },
    {
      icon: <BiSolidReport size={22} />,
      label: 'Reporte',
      ruta: '/reporte',
      modulo: 'reportes',
      accion: 'ver'
    },
    {
      icon: <FaUserShield size={22} />,
      label: 'Roles',
      ruta: '/roles',
      modulo: 'roles',
      accion: 'ver'
    }
  ];

  return (
    <nav className={`shadow-md h-screen bg-slate-700 text-white transition-all duration-300 ${open ? 'w-64' : 'w-10'}`}>
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
        {menuItems.map((item, index) => {
          const puedeVer = !item.modulo || tienePermiso(item.modulo, item.accion);
          if (!puedeVer) return null;

          return (
            <li key={index} className="px-3 py-2 hover:bg-slate-600 rounded-md">
              <Link to={item.ruta} className="flex items-center gap-2">
                {item.icon}
                <span className={`${!open && 'hidden'} transition-all duration-300`}>{item.label}</span>
              </Link>
            </li>
          );
        })}

        <li className="px-3 py-2 hover:bg-slate-600 rounded-md">
          <Link
            to="/login"
            onClick={() => localStorage.removeItem('token')}
            className="flex items-center gap-2"
          >
            <CiLogout size={22} />
            <span className={`${!open && 'hidden'} transition-all duration-300`}>Cerrar Sesión</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
