"use client"

import React, { useState, createContext, useContext, useEffect } from 'react';
import { User, LogIn, LogOut, Menu, X, BarChart3, FileText, TestTube, Settings, ChevronRight } from 'lucide-react';

// Import the GEO tools
import ContentAnalyzer from './ContentAnalyzer';
import PlatformTester from './PlatformTester';

// Auth Context
interface AuthContextType {
  user: any;
  login: (email: string, password: string) => boolean;
  signup: (email: string, password: string, company: string) => boolean;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth
    const storedUser = sessionStorage.getItem('langsacape_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    // Simulate auth - replace with real API call
    const mockUser = { 
      id: '1', 
      email, 
      name: email.split('@')[0],
      company: 'Demo Company',
      plan: 'enterprise'
    };
    setUser(mockUser);
    sessionStorage.setItem('langsacape_user', JSON.stringify(mockUser));
    return true;
  };

  const signup = (email: string, password: string, company: string) => {
    // Simulate signup - replace with real API call
    const mockUser = { 
      id: '1', 
      email, 
      name: email.split('@')[0],
      company,
      plan: 'trial'
    };
    setUser(mockUser);
    sessionStorage.setItem('langsacape_user', JSON.stringify(mockUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('langsacape_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Components
const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const { login, signup } = useAuth();

  const handleSubmit = () => {
    if (!email || !password || (!isLogin && !company)) {
      alert('Please fill in all fields');
      return;
    }
    
    if (isLogin) {
      login(email, password);
    } else {
      signup(email, password, company);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-thin text-white mb-3 tracking-wider lowercase">langscape</h1>
          <p className="text-gray-400 font-light text-sm tracking-wide uppercase">Enterprise GEO Command Center</p>
        </div>
        
        <div className="bg-white p-10 border-2 border-white">
          <h2 className="text-3xl font-thin mb-8 text-center">{isLogin ? 'Sign In' : 'Create Account'}</h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-normal mb-2 uppercase tracking-wider text-gray-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-0 py-3 border-0 border-b-2 border-gray-900 focus:outline-none focus:border-black transition-colors bg-transparent"
                placeholder="you@company.com"
              />
            </div>
            
            <div>
              <label className="block text-xs font-normal mb-2 uppercase tracking-wider text-gray-600">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-0 py-3 border-0 border-b-2 border-gray-900 focus:outline-none focus:border-black transition-colors bg-transparent"
                placeholder="••••••••"
              />
            </div>
            
            {!isLogin && (
              <div>
                <label className="block text-xs font-normal mb-2 uppercase tracking-wider text-gray-600">Company</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-0 py-3 border-0 border-b-2 border-gray-900 focus:outline-none focus:border-black transition-colors bg-transparent"
                  placeholder="Acme Corp"
                />
              </div>
            )}
          </div>
          
          <button
            onClick={handleSubmit}
            className="w-full mt-10 bg-black text-white py-4 font-light tracking-wider hover:bg-gray-900 transition-all duration-200 text-sm uppercase"
          >
            {isLogin ? 'Sign In' : 'Start 14-Day Trial'}
          </button>
          
          <p className="text-center mt-8 text-xs text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-normal text-black underline hover:no-underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

  const navigation = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'analyzer', name: 'Content Analyzer', icon: FileText },
    { id: 'tester', name: 'Platform Tester', icon: TestTube },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const stats = [
    { label: 'AI Visibility Score', value: '87%', change: '+12%' },
    { label: 'Content Optimized', value: '234', change: '+45' },
    { label: 'Platform Coverage', value: '4/4', change: '100%' },
    { label: 'Monthly ROI', value: '$45.2K', change: '+23%' },
  ];

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-black text-white transition-all duration-200 flex-shrink-0`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className={`text-2xl font-thin tracking-wider lowercase ${!sidebarOpen && 'hidden'}`}>langscape</h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-900 rounded transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          
          <nav className="space-y-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 hover:bg-gray-900 transition-colors text-sm ${
                  activeSection === item.id ? 'bg-gray-900 border-l-2 border-white' : ''
                }`}
              >
                <item.icon size={20} />
                {sidebarOpen && <span className="font-light">{item.name}</span>}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-full p-6 border-t border-gray-800">
          <div className={`flex items-center space-x-3 mb-4 ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="text-sm font-normal">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.company}</p>
              </div>
            )}
          </div>
          <button
            onClick={logout}
            className={`flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors ${!sidebarOpen && 'justify-center'}`}
          >
            <LogOut size={16} />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-thin">{navigation.find(n => n.id === activeSection)?.name}</h2>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-500 uppercase tracking-wider">Plan: <span className="text-black font-normal">{user?.plan}</span></span>
              <button className="px-6 py-2 bg-black text-white text-sm hover:bg-gray-900 transition-colors uppercase tracking-wider font-light">
                Upgrade
              </button>
            </div>
          </div>
        </header>
        
        <main className="p-8 overflow-y-auto h-[calc(100vh-5rem)]">
          {activeSection === 'overview' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-white border-2 border-black p-6 hover:shadow-lg transition-shadow">
                    <p className="text-xs uppercase tracking-wider text-gray-600 mb-2">{stat.label}</p>
                    <p className="text-4xl font-thin mb-2">{stat.value}</p>
                    <p className="text-sm text-green-600 font-light">{stat.change} this month</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-white border-2 border-black p-8">
                <h3 className="text-2xl font-thin mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { title: 'Content optimization completed', desc: 'Blog post: "AI Search Strategies for 2025"' },
                    { title: 'Platform test completed', desc: '4/4 platforms analyzed for "best CRM software"' },
                    { title: 'New competitor detected', desc: 'Competitor X now ranking for your keywords' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0">
                      <div>
                        <p className="font-normal text-lg">{item.title}</p>
                        <p className="text-sm text-gray-600 font-light">{item.desc}</p>
                      </div>
                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'analyzer' && <ContentAnalyzer />}
          
          {activeSection === 'tester' && <PlatformTester />}
          
          {activeSection === 'settings' && (
            <div className="max-w-2xl">
              <div className="bg-white border-2 border-black p-8 mb-6">
                <h3 className="text-2xl font-thin mb-6">Account Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">Email</label>
                    <p className="text-lg font-light">{user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">Company</label>
                    <p className="text-lg font-light">{user?.company}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border-2 border-black p-8">
                <h3 className="text-2xl font-thin mb-6">API Configuration</h3>
                <p className="text-sm text-gray-600 mb-6 font-light">Connect your API keys for platform testing</p>
                <button className="px-6 py-3 bg-black text-white text-sm hover:bg-gray-900 transition-colors uppercase tracking-wider font-light">
                  Configure APIs
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Main App
export default function App() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-light">Loading...</p>
        </div>
      </div>
    );
  }
  
  return user ? <Dashboard /> : <LoginForm />;
}