import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { useEffect } from "react";

function useOneSignal() {
  useEffect(() => {
    // @ts-ignore
    window.OneSignal = window.OneSignal || [];
    // @ts-ignore
    OneSignal.push(function() {
      OneSignal.init({
        appId: "54cd2ee7-95ad-413a-9db4-d5948d98896c",
        notifyButton: { enable: true },
        allowLocalhostAsSecureOrigin: true,
      });
    });
  }, []);
}

function AppRoot() {
  useOneSignal();
  return <App />;
}

createRoot(document.getElementById("root")!).render(<AppRoot />);
