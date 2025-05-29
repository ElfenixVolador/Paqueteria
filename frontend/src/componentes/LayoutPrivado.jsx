import React from 'react';
import { Outlet } from 'react-router-dom';
import Menu from './Menu';

const LayoutPrivado = () => {
  return (
    <div className="flex h-screen">
      <Menu />
      <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutPrivado;
