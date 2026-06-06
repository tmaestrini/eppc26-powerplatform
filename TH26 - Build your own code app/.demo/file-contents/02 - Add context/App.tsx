import { getContext } from '@microsoft/power-apps/app';

import './App.css'
import { useState } from 'react';

function App() {
  const [fullName, setFullName] = useState<string | undefined>(undefined);

  async function getUserInfo() {
    const ctx = await getContext();

    const fullName = ctx.user.fullName;
    setFullName(fullName);
  }

  return (
    <div className="app-container">
      <h1>Welcome {fullName !== undefined ? fullName : 'to your first Code App!'}</h1>
      <p>This is a very basic code app 😎</p>
      <button onClick={getUserInfo}>Load user info</button>
      <footer className="app-footer">
        Made with ❤️ and 🌈 by the Bishop Team for EPPC 26
      </footer>
    </div>
  );
}

export default App;
