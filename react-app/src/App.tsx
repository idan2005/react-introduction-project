import { useState } from "react";
import RegisterForm from "./components/createdComponents/Registerform";
import LoginForm from "./components/createdComponents/LoginForm";
import ProjectManager from "./components/createdComponents/ProjectManager";
import Header from "./components/createdComponents/Header";

function App() {
  const [currentView, setCurrentView] = useState<'auth' | 'projects'>('auth');
  const [showRegister, setShowRegister] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const handleLoginSuccess = (username: string) => {
    setCurrentUser(username);
    setCurrentView('projects');
  };

  const handleRegisterSuccess = (username: string) => {
    setCurrentUser(username);
    setCurrentView('projects');
    setShowRegister(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setCurrentUser(null);
    setCurrentView('auth');
    setShowRegister(false);
  };

  if (currentView === 'projects') {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto">
          <Header 
            currentUser={currentUser}
            onLogout={handleLogout}
          />
          <ProjectManager />
        </div>
      </div>
    );
  }
  localStorage.removeItem('jwt_token');
  return (
    <div className="min-h-screen bg-gray-100 py-8 mx-auto">
      {showRegister ? (
        <RegisterForm 
          onSwitchToLogin={() => setShowRegister(false)} 
          onRegisterSuccess={handleRegisterSuccess}
        />
      ) : (
        <LoginForm 
          onSwitchToRegister={() => setShowRegister(true)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default App;
