import { getContext } from '@microsoft/power-apps/app';
import { SamplelistService } from './generated';
import { SystemusersService } from './generated/services/SystemusersService';
import './App.css'
import { useState } from 'react';

function App() {
  const [fullName, setFullName] = useState<string | undefined>(undefined);
  const [spoItems, setSpoItems] = useState<any[] | undefined>(undefined);
  const [userTitle, setUserTitle] = useState<string | undefined>(undefined);

  async function getUserInfo() {
    const ctx = await getContext();

    const fullName = ctx.user.fullName;
    setFullName(fullName);

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

  return (
    <div className="app-container">
      <h1>Welcome {fullName !== undefined ? fullName : 'to your first Code App!'}</h1>
      {userTitle && <h2>Your title: {userTitle}</h2>}
      <p>This is a very basic code app 😎</p>
      <div className="button-container">
        <button onClick={getUserInfo}>Load user info</button>
        <button onClick={listSPOItems}>List SharePoint Online items</button>
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
