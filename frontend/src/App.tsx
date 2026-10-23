import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { Home } from './pages/Home.js';
import { AdminLogin } from './pages/AdminLogin.js';
import { AdminDashboard } from './pages/AdminDashboard.js';

const MainApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'admin' || window.location.hash === '#admin') {
        return 'admin';
      }
    }
    return 'home';
  });
  const { user, loading } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      <div style={{ flexGrow: 1 }}>
        {currentView === 'home' ? (
          <Home />
        ) : (
          <>
            {loading ? (
              <div style={{ padding: '4rem', textAlign: 'center' }}>
                <div className="badge badge-primary">Đang xác thực phiên làm việc...</div>
              </div>
            ) : user ? (
              <AdminDashboard onBackToHome={() => setCurrentView('home')} />
            ) : (
              <AdminLogin
                onSuccess={() => setCurrentView('admin')}
                onBackToHome={() => setCurrentView('home')}
              />
            )}
          </>
        )}
      </div>

      {currentView === 'home' && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default App;
