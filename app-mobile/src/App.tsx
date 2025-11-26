import { Redirect, Route, useLocation } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  IonPage,
  IonContent,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Login from './pages/Login';
import Home from './pages/Home';
import './global.css';
import Lancamentos from './pages/Lancamentos';
import Header from './components/Header';

import { DashboardProvider } from './contexts/DashboardContext';

setupIonicReact();

const MainContent: React.FC = () => {
  const location = useLocation();
  const authPages = ['/login', '/cadastro', '/esqueci-senha'];
  const isAuthPage = authPages.includes(location.pathname.toLowerCase());

  return (
    <>
      {!isAuthPage && <Header />}
      <IonRouterOutlet>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route path="/lancamentos">
          <Lancamentos />
        </Route>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
      </IonRouterOutlet>
    </>
  );
};

const App: React.FC = () => (
  <IonApp>
    <DashboardProvider>
      <IonReactRouter>
        <MainContent />
      </IonReactRouter>
    </DashboardProvider>
  </IonApp>
);

export default App;
