"use client"

import React, { useState } from 'react';
import { apiClient } from '../lib/api';

interface PlatformResult {
  appears: boolean;
  position?: number;
  snippet?: string;
  confidence_score: number;
  optimization_score: number;
}

interface TestResult {
  query: string;
  results: Record<string, PlatformResult>;
  visibility_score: number;
}

const PlatformTester: React.FC = () => {
  const [query, setQuery] = useState('');
  const [content, setContent] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const platforms = [
    { id: 'chatgpt', name: 'ChatGPT', color: 'bg-green-500', icon: '🤖' },
    { id: 'claude', name: 'Claude', color: 'bg-orange-500', icon: '🧠' },
    { id: 'perplexity', name: 'Perplexity', color: 'bg-blue-500', icon: '🔍' },
    { id: 'google_ai', name: 'Google AI', color: 'bg-red-500', icon: '🎯' }
  ];

  const handleTest = async () => {
    if (!query.trim() || !content.trim()) {
      setError('Please enter both a search query and content to test');
      return;
    }

    setIsTesting(true);
    setError(null);

    try {
      const result = await apiClient.testPlatforms({
        query,
        content,
        platforms: platforms.map(p => p.id)
      });
      
      setTestResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to test platforms');
    } finally {
      setIsTesting(false);
    }
  };

  const getVisibilityColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPositionBadge = (position?: number) => {
    if (!position) return null;
    
    const colors = {
      1: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      2: 'bg-gray-100 text-gray-800 border-gray-300',
      3: 'bg-orange-100 text-orange-800 border-orange-300',
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
        colors[position as keyof typeof colors] || 'bg-blue-100 text-blue-800 border-blue-300'
      }`}>
        #{position}
      </span>
    );
  };

  // Sample queries for inspiration
  const sampleQueries = [
    "best project management software for remote teams",
    "how to improve digital marketing ROI",
    "what is machine learning",
    "startup funding strategies 2025",
    "content marketing best practices"
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-gray-200 p-6">
        <h1 className="text-2xl font-bold mb-2">Platform Tester</h1>
        <p className="text-gray-600">
          Test how your content appears in AI search results across different platforms
        </p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Search Query Input */}
          <div>
            <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
              Search Query
            </label>
            <input
              type="text"
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a search query to test (e.g., 'best project management tools')"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-2">Sample queries:</p>
              <div className="flex flex-wrap gap-2">
                {sampleQueries.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(sample)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-700"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Input */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Your Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste the content you want to test for AI search visibility..."
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
            />
          </div>

          {/* Test Button */}
          <div>
            <button
              onClick={handleTest}
              disabled={isTesting || !query.trim() || !content.trim()}
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTesting ? 'Testing Platforms...' : 'Test AI Search Visibility'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Test Results */}
          {testResult && (
            <div className="space-y-6">
              {/* Overall Visibility Score */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Visibility Analysis</h2>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getVisibilityColor(testResult.visibility_score)}`}>
                    {Math.round(testResult.visibility_score)}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Overall AI Search Visibility
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Query: "{testResult.query}"
                  </div>
                </div>
              </div>

              {/* Platform Results */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Platform Performance</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {platforms.map((platform) => {
                    const result = testResult.results[platform.id];
                    if (!result) return null;

                    return (
                      <div
                        key={platform.id}
                        className={`border rounded-lg p-6 ${
                          result.appears
                            ? 'border-green-200 bg-green-50'
                            : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 ${platform.color} rounded-full flex items-center justify-center text-white text-sm`}>
                              {platform.icon}
                            </div>
                            <h3 className="font-semibold">{platform.name}</h3>
                          </div>
                          {result.appears ? (
                            <div className="flex items-center space-x-2">
                              {getPositionBadge(result.position)}
                              <span className="text-green-600 font-medium">✓ Visible</span>
                            </div>
                          ) : (
                            <span className="text-red-600 font-medium">✗ Not Found</span>
                          )}
                        </div>

                        <div className="space-y-3">
                          {/* Confidence Score */}
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>Confidence Score</span>
                              <span className="font-medium">{Math.round(result.confidence_score * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className={`h-2 rounded-full ${
                                  result.confidence_score > 0.7 ? 'bg-green-500' :
                                  result.confidence_score > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${result.confidence_score * 100}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Optimization Score */}
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>Optimization Score</span>
                              <span className="font-medium">{Math.round(result.optimization_score)}/100</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className={`h-2 rounded-full ${
                                  result.optimization_score > 80 ? 'bg-green-500' :
                                  result.optimization_score > 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${result.optimization_score}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Snippet Preview */}
                          {result.snippet && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">AI Response Preview:</h4>
                              <div className="bg-white border border-gray-200 rounded p-3 text-sm text-gray-600">
                                "{result.snippet}"
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Insights and Recommendations */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-3">🎯 Platform Testing Insights</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  {testResult.visibility_score >= 75 && (
                    <p>✅ Excellent visibility! Your content is well-optimized for AI search.</p>
                  )}
                  {testResult.visibility_score >= 50 && testResult.visibility_score < 75 && (
                    <p>⚠️ Good visibility with room for improvement. Consider optimizing for platforms where you're not appearing.</p>
                  )}
                  {testResult.visibility_score < 50 && (
                    <p>🔧 Low visibility detected. Your content needs optimization for better AI search performance.</p>
                  )}
                  
                  <div className="mt-3">
                    <p className="font-medium">💡 Pro Tips:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Higher optimization scores correlate with better visibility</li>
                      <li>Different platforms favor different content styles</li>
                      <li>Use the Content Analyzer to improve your optimization scores</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlatformTester;