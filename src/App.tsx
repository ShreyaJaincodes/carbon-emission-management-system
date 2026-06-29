import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { LoginSelection } from './components/LoginSelection';
import { MineRegistration } from './components/manager/MineRegistration';
import { ManagerDashboard } from './components/manager/ManagerDashboard';
import { EmissionCalculator } from './components/manager/EmissionCalculator';
import { WasteManagement } from './components/manager/WasteManagement';
import { OwnerDashboard } from './components/other/OwnerDashboard';
import { GovernmentDashboard } from './components/other/GovernmentDashboard';
import { PublicDashboard } from './components/other/PublicDashboard';
import type { UserRole, Mine } from './types';

type Page =
  | 'home'
  | 'login'
  | 'manager-registration'
  | 'manager-dashboard'
  | 'emission-calculator'
  | 'waste-management'
  | 'owner'
  | 'government'
  | 'public';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentMine, setCurrentMine] = useState<Mine | null>(null);

  const handleNavigate = (page: string) => {
    if (page === 'home') setCurrentPage('home');
    else if (page === 'login') setCurrentPage('login');
  };

  const handleRoleSelect = (role: UserRole) => {
    switch (role) {
      case 'manager':
        setCurrentPage('manager-registration');
        break;
      case 'owner':
        setCurrentPage('owner');
        break;
      case 'government':
        setCurrentPage('government');
        break;
      case 'user':
        setCurrentPage('public');
        break;
    }
  };

  const handleMineRegistered = (mine: Mine) => {
    setCurrentMine(mine);
    setCurrentPage('manager-dashboard');
  };

  const handleManagerLogout = () => {
    setCurrentMine(null);
    setCurrentPage('login');
  };

  const handleSelectCalculator = (type: 'emission' | 'waste') => {
    if (type === 'emission') {
      setCurrentPage('emission-calculator');
    } else {
      setCurrentPage('waste-management');
    }
  };

  const handleBackToDashboard = () => {
    setCurrentPage('manager-dashboard');
  };

  const handleBackToLogin = () => {
    setCurrentMine(null);
    setCurrentPage('login');
  };

  return (
    <div className="min-h-screen bg-white">
      {currentPage === 'home' && <Navbar onNavigate={handleNavigate} />}

      {currentPage === 'home' && <LandingPage onGetStarted={() => setCurrentPage('login')} />}

      {currentPage === 'login' && <LoginSelection onSelectRole={handleRoleSelect} />}

      {currentPage === 'manager-registration' && (
        <MineRegistration onBack={handleBackToLogin} onSuccess={handleMineRegistered} />
      )}

      {currentPage === 'manager-dashboard' && currentMine && (
        <ManagerDashboard
          mine={currentMine}
          onSelectCalculator={handleSelectCalculator}
          onLogout={handleManagerLogout}
        />
      )}

      {currentPage === 'emission-calculator' && currentMine && (
        <EmissionCalculator mine={currentMine} onBack={handleBackToDashboard} />
      )}

      {currentPage === 'waste-management' && currentMine && (
        <WasteManagement mine={currentMine} onBack={handleBackToDashboard} />
      )}

      {currentPage === 'owner' && <OwnerDashboard onBack={handleBackToLogin} />}

      {currentPage === 'government' && <GovernmentDashboard onBack={handleBackToLogin} />}

      {currentPage === 'public' && <PublicDashboard onBack={handleBackToLogin} />}
    </div>
  );
}

export default App;
