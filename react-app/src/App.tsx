import { useState } from "react";
import RegisterForm from "./components/createdComponents/Registerform";
import LoginForm from "./components/createdComponents/LoginForm";
import ProjectManager from "./components/createdComponents/ProjectManager";

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
          <div className="mb-4 flex justify-between items-center">
            <button 
              onClick={handleLogout}
              className="text-blue-500 hover:underline"
            >
              ← Logout
            </button>
            {currentUser && (
              <div className="text-gray-600">
                Welcome, <span className="font-semibold">{currentUser}</span>!
              </div>
            )}
          </div>
          <ProjectManager />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto mb-4">
        <button 
          onClick={() => setCurrentView('projects')}
          className="w-full text-center text-blue-500 hover:underline mb-4"
        >
          View Projects Demo (Skip Auth) →
        </button>
      </div>
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
