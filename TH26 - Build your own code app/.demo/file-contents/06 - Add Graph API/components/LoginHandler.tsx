import { useIsAuthenticated, useMsal } from "@azure/msal-react";


const LoginHandler: React.FC = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const handleLogout = () => {
    instance.logoutPopup();
  };

  return (
    <>
      {isAuthenticated && (
        <>
          <p>Welcome, {accounts[0].name}!</p >
          <button onClick={handleLogout}>Sign Out</button>
        </>
      )}
    </>
  );
};

export default LoginHandler;