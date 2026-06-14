import { getContext } from '@microsoft/power-apps/app';
import { SamplelistService } from './generated';
import './App.css'
import { useState } from 'react';

function App() {
  const [fullName, setFullName] = useState<string | undefined>(undefined);
  const [spoItems, setSpoItems] = useState<any[] | undefined>(undefined);

  async function getUserInfo() {
    const ctx = await getContext();

    const fullName = ctx.user.fullName;
    setFullName(fullName);
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
      <p>This is a very basic code app 😎</p>
      <div className="button-container">
        <button onClick={getUserInfo}>Load user info</button>
        <button onClick={listSPOItems} disabled={fullName === undefined}>List SharePoint Online items</button>
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
