'use client'
import React from "react";
import Link from "next/link";
import { getLocalItem } from "@/utils";
import { usePathname } from "next/navigation";

const Sidebar = () => {
    const userStr = getLocalItem('User');
      const user = userStr ? JSON.parse(userStr) : null;
        const pathname = usePathname()
        const getLinkClass = (href: string) => {
    return `px-3 py-2 rounded ${
      pathname === href ? "bg-gray-700 font-semibold" : "hover:bg-gray-700"
    }`;
  };
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        MyApp
      </div>
      <nav className="flex flex-col flex-grow p-4 space-y-2">
        <Link href="/dashboard" className={getLinkClass("/dashboard")}>
          Dashboard
        </Link>
        <Link href="/imageList" className={getLinkClass("/imageList")}>
          images
        </Link>
        {user && user.role === "SA" && 
        <Link href="/users" className={getLinkClass("/users")}>
          users
        </Link>
        }
      </nav>
    </aside>
  );
};

export default Sidebar;
