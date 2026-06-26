import { getContext } from '@microsoft/power-apps/app';
import { SampleflowService, SamplelistService, StandardapprovalsService } from './generated';
import './App.css'
import { useState } from 'react';

function App() {
  const [fullName, setFullName] = useState<string | undefined>(undefined);
  const [spoItems, setSpoItems] = useState<any[] | undefined>(undefined);
  const [upn, setUpn] = useState<string | undefined>(undefined);

  async function getUserInfo() {
    const ctx = await getContext();

    const fullName = ctx.user.fullName;
    setFullName(fullName);

    const userPrincipalName = ctx.user.userPrincipalName;
    setUpn(userPrincipalName);
  }

  async function listSPOItems() {
    const items = await SamplelistService.getAll();

    if (!items.success) {
      alert('Failed to retrieve items from SharePoint Online list');
      return;
    }

    setSpoItems(items.data);
    console.log('Retrieved items from SharePoint Online list:', items.data);
  }

  async function createApproval() {
    const result = await StandardapprovalsService.CreateAnApproval({
      "assignedTo": upn ?? "",
      "title": "Test approval from Code App",
      "details": "This is a test approval created from a Code App"
    }, "Basic");

    if (result.success) {
      console.log("Approval created successfully!");
      alert("Approval created!");
    } else {
      console.error("Failed to create approval:", result.error);
      alert("Failed to create approval task!");
    }
  }

  async function runFlow() {
    const result = await SampleflowService.Run(
      {
        text: "Hello from Code App!"
      }
    );

    if (result.success) {
      console.log("Flow run successfully!", result);
      alert(result.data.return);
    } else {
      console.error("Failed to run flow:", result.error);
      alert("Failed to run flow!");
    }
  }

  return (
    <div className="app-container">
      <h1 data-control-name="welcome-message">Welcome {fullName !== undefined ? fullName : 'to your first Code App!'}</h1>
      <p>This is a very basic code app 😎</p>
      <div className="button-container">
        <button onClick={getUserInfo} data-control-name="load-user-info">Load user info</button>
        <button onClick={listSPOItems} disabled={upn === undefined} data-control-name="list-spo-items">List SharePoint Online items</button>
        <button onClick={createApproval} disabled={upn === undefined} data-control-name="create-approval">Create approval</button>
        <button onClick={runFlow} disabled={upn === undefined} data-control-name="run-flow">Run flow</button>
      </div>
      {spoItems !== undefined && spoItems.length > 0 &&
      <div>
        <h2>SharePoint Online Items</h2>
        <ul>
          {spoItems.map((item) => (
            <li key={item.ID}>{item.Title}</li>
          ))}
        </ul>
      </div>}
      <footer className="app-footer">
        Made with ❤️ and 🌈 by the Bishop Team for EPPC 26
      </footer>
    </div>
  );
}

export default App;
