import { IonHeader, IonToolbar, IonButtons, IonButton } from '@ionic/react';
import { useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const location = useLocation();

  const navItems = [
    { path: '/home', label: 'Visão Geral' },
    { path: '/lancamentos', label: 'Lançamentos' },
    // { path: '/orcamentos', label: 'Orçamentos' },
    // { path: '/metas', label: 'Metas' },
  ];

  return (
    <IonHeader>
      <IonToolbar>
        <div className="header-content">
          <div className="logo-container">
            <div className="logo-circle">D</div>
            <span>DuckBills</span>
          </div>
          <div className="nav-container">
            <IonButtons>
              {navItems.map((item) => (
                <IonButton
                  key={item.path}
                  routerLink={item.path}
                  routerDirection="none"
                  className={`${location.pathname === item.path ? 'active' : ''} nav-link-ionic`}
                >
                  {item.label}
                </IonButton>
              ))}
            </IonButtons>
            <div className="profile-letter">L</div>
          </div>
        </div>
      </IonToolbar>
    </IonHeader>
  );
}