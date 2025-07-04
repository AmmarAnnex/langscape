// components/PlatformTester.tsx
"use client"

import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, Clock, Sparkles } from 'lucide-react';

interface PlatformResult {
  platform: string;
  cited: boolean;
  position?: number;
  snippet?: string;
  confidence: number;
  responseTime: number;
}

export default function PlatformTester() {
  const [query, setQuery] = useState('');
  const [content, setContent] = useState('');
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<PlatformResult[] | null>(null);

  const testPlatforms = async () => {
    if (!query.trim() || !content.trim()) return;
    
    setTesting(true);
    
    // Simulate API calls to different platforms
    setTimeout(() => {
      const mockResults: PlatformResult[] = [
        {
          platform: 'ChatGPT',
          cited: true,
          position: 2,
          snippet: 'According to recent analysis, ' + content.substring(0, 100) + '...',
          confidence: 0.92,
          responseTime: 1.2
        },
        {
          platform: 'Claude',
          cited: true,
          position: 1,
          snippet: 'Based on the comprehensive guide, ' + content.substring(0, 100) + '...',
          confidence: 0.88,
          responseTime: 0.9
        },
        {
          platform: 'Perplexity',
          cited: false,
          confidence: 0.45,
          responseTime: 1.5
        },
        {
          platform: 'Google AI',
          cited: true,
          position: 3,
          snippet: 'The analysis shows that ' + content.substring(0, 100) + '...',
          confidence: 0.76,
          responseTime: 2.1
        }
      ];
      
      setResults(mockResults);
      setTesting(false);
    }, 2000);
  };

  const citationRate = results 
    ? Math.round((results.filter(r => r.cited).length / results.length) * 100)
    : 0;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-thin mb-2">Platform Tester</h1>
        <p className="text-gray-600 font-light">Test how your content appears across AI search platforms</p>
      </div>

      {/* Input Section */}
      <div className="bg-white border-2 border-black p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">Search Query</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What users will search for..."
              className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black transition-colors font-light"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">Your Content URL (Optional)</label>
            <input
              type="text"
              placeholder="https://yoursite.com/content"
              className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black transition-colors font-light"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">Content to Test</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste the content you want to test..."
            className="w-full h-32 p-4 border-2 border-gray-300 focus:border-black transition-colors resize-none font-light"
          />
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={testPlatforms}
            disabled={!query.trim() || !content.trim() || testing}
            className="px-8 py-3 bg-black text-white hover:bg-gray-900 transition-colors uppercase tracking-wider text-sm font-light disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Search size={16} />
            <span>{testing ? 'Testing Platforms...' : 'Test All Platforms'}</span>
          </button>
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border-2 border-black p-6">
              <h3 className="text-xs uppercase tracking-wider text-gray-600 mb-2">Citation Rate</h3>
              <p className="text-4xl font-thin">{citationRate}%</p>
              <p className="text-sm text-gray-500 font-light mt-1">
                {results.filter(r => r.cited).length}/{results.length} platforms
              </p>
            </div>
            <div className="bg-white border-2 border-black p-6">
              <h3 className="text-xs uppercase tracking-wider text-gray-600 mb-2">Avg Position</h3>
              <p className="text-4xl font-thin">
                {results.filter(r => r.cited && r.position).length > 0
                  ? (results.filter(r => r.cited && r.position)
                      .reduce((acc, r) => acc + (r.position || 0), 0) / 
                      results.filter(r => r.cited && r.position).length).toFixed(1)
                  : 'N/A'}
              </p>
              <p className="text-sm text-gray-500 font-light mt-1">When cited</p>
            </div>
            <div className="bg-white border-2 border-black p-6">
              <h3 className="text-xs uppercase tracking-wider text-gray-600 mb-2">Avg Response Time</h3>
              <p className="text-4xl font-thin">
                {(results.reduce((acc, r) => acc + r.responseTime, 0) / results.length).toFixed(1)}s
              </p>
              <p className="text-sm text-gray-500 font-light mt-1">Across all platforms</p>
            </div>
          </div>

          {/* Platform Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((result) => (
              <div key={result.platform} className="bg-white border-2 border-black p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-normal">{result.platform}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {result.cited ? (
                        <CheckCircle size={16} className="text-green-500" />
                      ) : (
                        <XCircle size={16} className="text-red-500" />
                      )}
                      <span className="text-sm text-gray-600">
                        {result.cited ? `Cited at position ${result.position}` : 'Not cited'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{result.responseTime}s</span>
                    </div>
                  </div>
                </div>
                
                {result.snippet && (
                  <div className="mt-4 p-4 bg-gray-50 border-l-4 border-black">
                    <p className="text-sm font-light italic">"{result.snippet}"</p>
                  </div>
                )}
                
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Confidence Score</span>
                    <span>{Math.round(result.confidence * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1">
                    <div 
                      className="bg-black h-1 transition-all duration-1000"
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Optimization Tips */}
          <div className="mt-8 bg-black text-white p-8">
            <h3 className="text-xl font-thin mb-4 flex items-center space-x-2">
              <Sparkles size={20} />
              <span>Quick Optimization Tips</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-light">
              {citationRate < 50 && (
                <p>• Your content is underperforming. Consider adding more Q&A structure and specific data points.</p>
              )}
              {citationRate >= 50 && citationRate < 75 && (
                <p>• Good performance, but room for improvement. Focus on the platforms where you're not cited.</p>
              )}
              {citationRate >= 75 && (
                <p>• Excellent citation rate! Focus on improving your position on platforms where you're already cited.</p>
              )}
              <p>• Platforms favor content with clear structure, authoritative tone, and specific examples.</p>
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {!results && !testing && (
        <div className="bg-gray-50 border-2 border-gray-300 border-dashed p-16 text-center">
          <Search size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 font-light">Enter a query and content to test how it performs across AI platforms</p>
        </div>
      )}
    </div>
  );
}