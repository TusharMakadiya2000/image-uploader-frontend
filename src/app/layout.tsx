'use client'
import Sidebar from "@/components/comman/Sidebar";
import "./globals.css";
import Header from "@/components/comman/Header";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/'
  
  return (
     <html lang="en">
      <body>
        <div className="flex min-h-screen">
          {!isAuthPage && <Sidebar />}
          <div className="flex flex-col flex-grow">
          {!isAuthPage && <Header />}
            <main className="py-6 bg-gray-100 flex-grow">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
