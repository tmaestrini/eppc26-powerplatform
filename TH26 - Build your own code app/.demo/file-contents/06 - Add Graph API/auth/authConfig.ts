import type { Configuration } from "@azure/msal-browser";

export const configuration: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_ENTRA_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_ENTRA_TENANT_ID || 'common'}`,
    redirectUri: window.location.origin,
  }
};

export const loginRequest = {
  scopes: [import.meta.env.VITE_ENTRA_SCOPES]
};
