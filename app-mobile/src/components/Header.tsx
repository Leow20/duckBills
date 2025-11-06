import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon } from '@ionic/react';
import { useLocation } from 'react-router-dom';
import { home, wallet, pricetag, trophy, person } from 'ionicons/icons';

export default function Header() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Visão Geral', icon: home },
    { path: '/lancamentos', label: 'Lançamentos', icon: wallet },
    { path: '/orcamentos', label: 'Orçamentos', icon: pricetag },
    { path: '/metas', label: 'Metas', icon: trophy },
  ];

  return (
    <IonHeader>
      <IonToolbar>
        <IonTitle>DuckBills</IonTitle>
        <IonButtons slot="end">
          {navItems.map((item) => (
            <IonButton
              key={item.path}
              routerLink={item.path}
              routerDirection="none"
              color={location.pathname === item.path ? 'primary' : 'medium'}
            >
              <IonIcon icon={item.icon} />
            </IonButton>
          ))}
          <IonButton>
            <IonIcon icon={person} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
}