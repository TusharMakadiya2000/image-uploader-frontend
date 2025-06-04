'use client'
import { getLocalItem } from "@/utils";
import React from "react";

const Header = () => {
 const userStr = getLocalItem('User');
  const user = userStr ? JSON.parse(userStr) : null;


const handleLogout = () =>{
    localStorage.clear();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
}

  return (
    <div className="w-full bg-white shadow-md p-4 flex justify-between items-center">
      <div className="text-xl font-semibold">Welcome, {user && user.name}</div>
      <div>
        <button onClick={handleLogout} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
