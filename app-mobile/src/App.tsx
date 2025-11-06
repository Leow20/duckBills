import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse,  triangle } from 'ionicons/icons';
import Login from './pages/Login';
import Home from './pages/Home';
// import Tab3 from './pages/Tab3';


import './global.css';
import { DashboardProvider } from './contexts/DashboardContext';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <DashboardProvider>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/Login">
              <Login />
            </Route>
            <Route exact path="/Home">
              <Home />
            </Route>
            {/* <Route path="/tab3">
              <Tab3 />
            </Route> */}
            <Route exact path="/">
              <Redirect to="/Login" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="Login" href="/Login">
              <IonIcon aria-hidden="true" icon={triangle} />
              <IonLabel>Tab 1</IonLabel>
            </IonTabButton>
            <IonTabButton tab="Home" href="/Home">
              <IonIcon aria-hidden="true" icon={ellipse} />
              <IonLabel>Tab 2</IonLabel>
            </IonTabButton>
            {/* <IonTabButton tab="tab3" href="/tab3">
              <IonIcon aria-hidden="true" icon={square} />
              <IonLabel>Tab 3</IonLabel>
            </IonTabButton> */}
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </DashboardProvider>
  </IonApp>
);

export default App;
