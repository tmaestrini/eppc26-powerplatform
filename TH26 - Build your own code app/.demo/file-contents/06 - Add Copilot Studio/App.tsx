import { getContext } from '@microsoft/power-apps/app';
import { SamplelistService } from './generated';
import { SystemusersService } from './generated/services/SystemusersService';
import { StandardapprovalsService } from './generated/services/StandardapprovalsService';
import { MicrosoftCopilotStudioService } from './generated/services/MicrosoftCopilotStudioService';
import './App.css'
import { useState } from 'react';

function App() {
  const [fullName, setFullName] = useState<string | undefined>(undefined);
  const [spoItems, setSpoItems] = useState<any[] | undefined>(undefined);
  const [userTitle, setUserTitle] = useState<string | undefined>(undefined);
  const [upn, setUpn] = useState<string | undefined>(undefined);

  async function getUserInfo() {
    const ctx = await getContext();

    const fullName = ctx.user.fullName;
    setFullName(fullName);

    const userPrincipalName = ctx.user.userPrincipalName;
    setUpn(userPrincipalName);

    const userId = ctx.user.objectId;

    if (userId !== undefined) {
      const userRecordResult = await SystemusersService.getAll({ filter: `azureactivedirectoryobjectid eq '${userId}'` });
      if (userRecordResult.success && userRecordResult.data.length > 0) {
        const userRecord = userRecordResult.data[0];
        setUserTitle(userRecord.title);
      } else {
        console.error("Failed to retrieve user record:", userRecordResult.error);
      }
    }
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

  async function listCopilots()
  {
    const result = await MicrosoftCopilotStudioService.ListCopilots();
    console.log(result);
  }

  async function executeCopilot() {
    await listCopilots();

    const result = await MicrosoftCopilotStudioService.ExecuteCopilotAsyncV2("<YOUR COPILOT NAME HERE>", { prompt: "Help me staying motivated" });
    console.log(result);

    if (result.success) {  
      // TODO: check result data and return a message to the user based on that
      
    } else {
      alert("Failed to execute copilot!");
    }
  }

  return (
    <div className="app-container">
      <h1>Welcome {fullName !== undefined ? fullName : 'to your first Code App!'}</h1>
      {userTitle && <h2>Your title: {userTitle}</h2>}
      <p>This is a very basic code app 😎</p>
      <div className="button-container">
        <button onClick={getUserInfo}>Load user info</button>
        <button onClick={listSPOItems}>List SharePoint Online items</button>
        <button onClick={createApproval} disabled={upn === undefined}>Create approval</button>
        <button onClick={executeCopilot}>Execute Copilot</button>
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
