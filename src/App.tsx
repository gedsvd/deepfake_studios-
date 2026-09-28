import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { RegisterView } from './components/RegisterView';
import { LoginView } from './components/LoginView';
import { AdminPanel } from './components/AdminPanel';
import { UserDashboard } from './components/UserDashboard';
import { ModelArchitectureModal } from './components/ModelArchitectureModal';
import { ApiDocsModal } from './components/ApiDocsModal';
import { getSession, clearSession } from './services/db';
import { NavigationMenu, User } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationMenu>('Home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isApiDocsOpen, setIsApiDocsOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);

  // Initialize session on mount
  useEffect(() => {
    const savedUser = getSession();
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentTab('Login'); // Stays on Login view which now renders the dashboard/admin panel
  };

  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
    setCurrentTab('Home');
  };

  return (
    <div className="relative min-h-screen bg-[#060913] text-slate-100 flex overflow-x-hidden selection:bg-cyan-400 selection:text-black">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0 glow-ambient" />
      <div className="fixed inset-0 pointer-events-none z-0 cyber-grid opacity-75" />
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/3 -right-40 w-[28rem] h-[28rem] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Header
          currentUser={currentUser}
          onOpenApiDocs={() => setIsApiDocsOpen(true)}
          onOpenArchitecture={() => setIsArchitectureOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {currentTab === 'Home' && (
            <HomeView
              onNavigate={setCurrentTab}
              currentUser={currentUser}
              onOpenApiDocs={() => setIsApiDocsOpen(true)}
            />
          )}

          {currentTab === 'Register' && (
            <RegisterView onNavigateToLogin={() => setCurrentTab('Login')} />
          )}

          {currentTab === 'Login' && (
            <>
              {currentUser ? (
                currentUser.role === 'admin' ? (
                  <AdminPanel currentUser={currentUser} />
                ) : (
                  <UserDashboard currentUser={currentUser} />
                )
              ) : (
                <LoginView
                  onLoginSuccess={handleLoginSuccess}
                  onNavigateToRegister={() => setCurrentTab('Register')}
                />
              )}
            </>
          )}
        </main>

        {/* Global Footer matching design */}
        <footer className="border-t border-slate-800/80 bg-[#060913]/90 py-4 px-6 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-2">
            <span>© 2025 DeepFake Face Classification Platform. Neural Security Division.</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsArchitectureOpen(true)}
              className="hover:text-slate-300 transition"
            >
              Model Specs
            </button>
            <button
              onClick={() => setIsApiDocsOpen(true)}
              className="hover:text-slate-300 transition"
            >
              API Reference
            </button>
            <a
              href="https://arxiv.org/abs/2004.07676"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-300 transition"
            >
              Research Paper (arXiv)
            </a>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <ModelArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />
      <ApiDocsModal
        isOpen={isApiDocsOpen}
        onClose={() => setIsApiDocsOpen(false)}
      />
    </div>
  );
}
