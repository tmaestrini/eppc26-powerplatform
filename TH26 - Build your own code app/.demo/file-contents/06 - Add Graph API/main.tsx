import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { configuration } from './auth/authConfig.ts'

const pca = new PublicClientApplication(configuration);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MsalProvider instance={pca}>
        <App />
    </MsalProvider>
  </StrictMode>,
)
