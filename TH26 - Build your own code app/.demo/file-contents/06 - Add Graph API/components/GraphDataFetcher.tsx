import type React from "react";
import { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../auth/authConfig";
import { Client } from "@microsoft/microsoft-graph-client";


/**
 * Fetches and displays user profile data from Microsoft Graph API.
 * Notice that this endpoint requires the 'User.Read' scope and calls the beta version of the API.
 * It uses Microsoft Graph Client SDK with MSAL for authentication.
 * 
 * @returns {React.FC} The GraphDataFetcher component.
 */
const GraphDataFetcher: React.FC = () => {
  const [graphData, setGraphData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { instance, accounts } = useMsal();

  const callGraphAPI = async () => {
    const account = accounts[0];
    if (!account) {
      setError('No account logged in');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get access token using MSAL
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: account
      });

      // Create Graph client with custom authentication provider
      const graphClient = Client.init({
        authProvider: (done) => {
          done(null, response.accessToken);
        }
      });

      // Use Graph SDK to fetch user profile
      const data = await graphClient.api('/me/').version('beta').get();
      
      setGraphData(data);
      console.log('Graph API response:', data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Graph API call failed';
      setError(errorMsg);
      console.error('Graph API call failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Graph Data Fetcher</h3>
      <button onClick={callGraphAPI} disabled={loading || accounts.length === 0}>
        {loading ? 'Loading...' : 'Fetch My Profile'}
      </button>

      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Error: {error}
        </div>
      )}

      {graphData && (
        <div style={{ marginTop: '20px', textAlign: 'left' }}>
          <h4>User Profile:</h4>
          <pre>{JSON.stringify(graphData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default GraphDataFetcher;