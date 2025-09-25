'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Visão Geral' },
    { href: '/lancamentos', label: 'Lançamentos' },
    { href: '/orcamentos', label: 'Orçamentos' },
    { href: '/metas', label: 'Metas' },
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
              className={`nav-link ${pathname === item.href ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="user-info">
          L
        </div>
      </div>
    </header>
  );
}