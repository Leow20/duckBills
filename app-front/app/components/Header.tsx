"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [usuarioLogadoState, setUsuarioLogado] = useState<any>(null);
  useEffect(() => {
    setUsuarioLogado(localStorage.getItem("usuarioLogado"));
  }, []);
  const [open, setOpen] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado");
    router.push("/login");
  };
  const navItems = [
    { href: "/", label: "Visão Geral" },
    { href: "/lancamentos", label: "Lançamentos" },
    { href: "/orcamentos", label: "Orçamentos" },
    { href: "/metas", label: "Metas" },
  ];

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <div className="logo-icon">D</div>
          DuckBills
        </div>

        <nav className="nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${pathname === item.href ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="user-info">
          <button
            onClick={() => setOpen(!open)}
            className="user-button"
          >
            {usuarioLogadoState ? JSON.parse(usuarioLogadoState).charAt(0).toUpperCase() : ""}
          </button>

          {open && (
            <div className="dropdown">
              <div className="user-info">
                {JSON.parse(usuarioLogadoState)}
              </div>
              <button
                onClick={handleLogout}
                className="logout-btn"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
