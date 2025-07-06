"use client"

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import ContentAnalyzer from './ContentAnalyzer';
import PlatformTester from './PlatformTester';

interface AuthFormData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  company?: string;
}

const LangscapeApp: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [activeTab, setActiveTab] = useState('content-analyzer');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    company: ''
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            company: formData.company,
          }
        }
      });

      if (error) {
        setAuthError(error.message);
      } else if (data.user && !data.session) {
        setAuthError('Please check your email for the confirmation link.');
      }
    } catch (error) {
      setAuthError('An unexpected error occurred. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setAuthError(error.message);
      }
    } catch (error) {
      setAuthError('An unexpected error occurred. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      company: ''
    });
    setAuthError(null);
  };

  const switchAuthMode = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    resetForm();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Langscape</h1>
            <p className="text-gray-600">
              {authMode === 'login' ? 'Sign in to your account' : 'Create your account'}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            {authError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm">{authError}</p>
              </div>
            )}

            <form onSubmit={authMode === 'login' ? handleSignIn : handleSignUp}>
              {authMode === 'signup' && (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                  </div>
                </>
              )}

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {authLoading ? 'Loading...' : (authMode === 'login' ? 'Sign In' : 'Sign Up')}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => switchAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="text-sm text-gray-600 hover:text-black"
              >
                {authMode === 'login' 
                  ? "Don't have an account? Sign up" 
                  : 'Already have an account? Sign in'
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold">Langscape</h1>
          <p className="text-sm text-gray-600 mt-1">
            Welcome, {user?.user_metadata?.first_name || user?.email?.split('@')[0]}
          </p>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab('content-analyzer')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'content-analyzer'
                    ? 'bg-white border border-gray-200 text-black'
                    : 'text-gray-600 hover:text-black hover:bg-white'
                }`}
              >
                Content Analyzer
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('platform-tester')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'platform-tester'
                    ? 'bg-white border border-gray-200 text-black'
                    : 'text-gray-600 hover:text-black hover:bg-white'
                }`}
              >
                Platform Tester
              </button>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-black hover:bg-white"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'content-analyzer' && <ContentAnalyzer />}
        {activeTab === 'platform-tester' && <PlatformTester />}
      </div>
    </div>
  );
};

export default LangscapeApp;