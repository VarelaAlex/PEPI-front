import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as swr from './serviceWorkerRegistration';
import './i18n';
import { BrowserRouter }   from 'react-router-dom';
import { SessionProvider } from './components/SessionComponent';
import {AvatarProvider} from "./components/AvatarContext";
import Avatar from "./components/Avatar";
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById('root'));

// Disable SW caching to avoid stale production bundles/state behavior.
swr.unregister();

root.render(
  <BrowserRouter>
    <SessionProvider>
        <AvatarProvider>
            <App />
            <Avatar />
        </AvatarProvider>
    </SessionProvider>
  </BrowserRouter>
);