// components/ContentAnalyzer.tsx
"use client"

import React, { useState } from 'react';
import { BarChart3, AlertCircle, TrendingUp, Target, Zap } from 'lucide-react';

interface Score {
  platform: string;
  score: number;
  color: string;
}

interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  action: string;
  impact: string;
  effort: string;
}

export default function ContentAnalyzer() {
  const [content, setContent] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const analyzeContent = async () => {
    if (!content.trim()) return;
    
    setAnalyzing(true);
    
    // Simulate API call - replace with real API
    setTimeout(() => {
      const scores: Score[] = [
        { platform: 'ChatGPT', score: 72, color: 'bg-blue-500' },
        { platform: 'Claude', score: 85, color: 'bg-purple-500' },
        { platform: 'Perplexity', score: 68, color: 'bg-orange-500' },
        { platform: 'Google AI', score: 79, color: 'bg-green-500' }
      ];

      const recommendations: Recommendation[] = [
        {
          priority: 'high',
          action: 'Add Q&A structure',
          impact: 'High',
          effort: 'Low'
        },
        {
          priority: 'high',
          action: 'Include specific data points',
          impact: 'High',
          effort: 'Medium'
        },
        {
          priority: 'medium',
          action: 'Break into bullet points',
          impact: 'Medium',
          effort: 'Low'
        },
        {
          priority: 'low',
          action: 'Add topic summary',
          impact: 'Low',
          effort: 'Low'
        }
      ];

      setResults({
        scores,
        recommendations,
        avgScore: Math.round(scores.reduce((acc, s) => acc + s.score, 0) / scores.length),
        wordCount: content.split(' ').length
      });
      
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-thin mb-2">Content Analyzer</h1>
        <p className="text-gray-600 font-light">Analyze how your content will perform across AI search platforms</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white border-2 border-black p-6">
          <label className="block text-xs uppercase tracking-wider text-gray-600 mb-4">Content to Analyze</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your content here..."
            className="w-full h-64 p-4 border-2 border-gray-300 focus:border-black transition-colors resize-none font-light"
          />
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-500">{content.split(' ').filter(w => w).length} words</span>
            <button
              onClick={analyzeContent}
              disabled={!content.trim() || analyzing}
              className="px-6 py-3 bg-black text-white hover:bg-gray-900 transition-colors uppercase tracking-wider text-sm font-light disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {analyzing ? 'Analyzing...' : 'Analyze Content'}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {results ? (
            <>
              {/* Overall Score */}
              <div className="bg-white border-2 border-black p-6">
                <h3 className="text-xs uppercase tracking-wider text-gray-600 mb-4">Overall AI Optimization Score</h3>
                <div className="text-5xl font-thin mb-2">{results.avgScore}%</div>
                <div className="w-full bg-gray-200 h-2">
                  <div 
                    className="bg-black h-2 transition-all duration-1000"
                    style={{ width: `${results.avgScore}%` }}
                  />
                </div>
              </div>

              {/* Platform Scores */}
              <div className="bg-white border-2 border-black p-6">
                <h3 className="text-xs uppercase tracking-wider text-gray-600 mb-4">Platform Performance</h3>
                <div className="space-y-3">
                  {results.scores.map((score: Score) => (
                    <div key={score.platform}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-light">{score.platform}</span>
                        <span className="text-sm font-normal">{score.score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-1">
                        <div 
                          className={`${score.color} h-1 transition-all duration-1000`}
                          style={{ width: `${score.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white border-2 border-black p-6">
                <h3 className="text-xs uppercase tracking-wider text-gray-600 mb-4">Optimization Recommendations</h3>
                <div className="space-y-3">
                  {results.recommendations.map((rec: Recommendation, i: number) => (
                    <div key={i} className="flex items-start space-x-3 pb-3 border-b border-gray-200 last:border-0">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${
                        rec.priority === 'high' ? 'bg-red-500' : 
                        rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div className="flex-1">
                        <p className="font-normal">{rec.action}</p>
                        <div className="flex space-x-4 mt-1 text-xs text-gray-500">
                          <span>Impact: {rec.impact}</span>
                          <span>Effort: {rec.effort}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-gray-50 border-2 border-gray-300 border-dashed p-12 text-center">
              <BarChart3 size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 font-light">Analysis results will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}