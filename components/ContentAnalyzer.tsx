"use client"

import React, { useState } from 'react';
import { apiClient } from '../lib/api';

interface PlatformScore {
  overall_score: number;
  features: Record<string, number>;
  recommendations: Array<{
    priority: string;
    action: string;
    impact: number;
    effort: string;
    description: string;
  }>;
}

interface AnalysisResult {
  platforms: Record<string, PlatformScore>;
  average_score: number;
  top_platform: string;
  industry_benchmark: number;
}

const ContentAnalyzer: React.FC = () => {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState('chatgpt');

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError('Please enter some content to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await apiClient.analyzeContent({
        content,
        target_platforms: ['chatgpt', 'claude', 'perplexity', 'google_ai']
      });
      
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze content');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const platformNames = {
    chatgpt: 'ChatGPT',
    claude: 'Claude',
    perplexity: 'Perplexity',
    google_ai: 'Google AI'
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-gray-200 p-6">
        <h1 className="text-2xl font-bold mb-2">Content Analyzer</h1>
        <p className="text-gray-600">
          Analyze your content for AI search optimization across platforms
        </p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Content Input */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content to Analyze
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your content here for AI optimization analysis..."
              className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
            />
          </div>

          {/* Analyze Button */}
          <div>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !content.trim()}
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Analysis Results */}
          {analysisResult && (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Overall Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(analysisResult.average_score)}`}>
                      {Math.round(analysisResult.average_score)}
                    </div>
                    <div className="text-sm text-gray-600">Average Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">
                      {platformNames[analysisResult.top_platform as keyof typeof platformNames]}
                    </div>
                    <div className="text-sm text-gray-600">Best Platform</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-700">
                      {analysisResult.industry_benchmark}
                    </div>
                    <div className="text-sm text-gray-600">Industry Benchmark</div>
                  </div>
                </div>
              </div>

              {/* Platform Scores */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Platform Scores</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(analysisResult.platforms).map(([platform, data]) => (
                    <div
                      key={platform}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPlatform === platform
                          ? 'border-black bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPlatform(platform)}
                    >
                      <div className="text-center">
                        <h3 className="font-medium mb-2">
                          {platformNames[platform as keyof typeof platformNames]}
                        </h3>
                        <div className={`text-2xl font-bold ${getScoreColor(data.overall_score)}`}>
                          {Math.round(data.overall_score)}
                        </div>
                        <div className="text-sm text-gray-600">Score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Analysis for Selected Platform */}
              {selectedPlatform && analysisResult.platforms[selectedPlatform] && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">
                    {platformNames[selectedPlatform as keyof typeof platformNames]} Analysis
                  </h2>

                  {/* Feature Breakdown */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-medium mb-4">Feature Analysis</h3>
                    <div className="space-y-3">
                      {Object.entries(analysisResult.platforms[selectedPlatform].features).map(([feature, value]) => (
                        <div key={feature} className="flex justify-between items-center">
                          <span className="text-sm capitalize">
                            {feature.replace(/_/g, ' ')}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${Math.min(value * 100, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium w-12">
                              {(value * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-medium mb-4">Optimization Recommendations</h3>
                    <div className="space-y-3">
                      {analysisResult.platforms[selectedPlatform].recommendations.map((rec, index) => (
                        <div
                          key={index}
                          className={`border rounded-md p-4 ${
                            rec.priority === 'high'
                              ? 'border-red-200 bg-red-50'
                              : rec.priority === 'medium'
                              ? 'border-yellow-200 bg-yellow-50'
                              : 'border-green-200 bg-green-50'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{rec.action}</h4>
                            <div className="flex items-center space-x-2 text-sm">
                              <span className={`px-2 py-1 rounded text-xs ${
                                rec.priority === 'high'
                                  ? 'bg-red-100 text-red-800'
                                  : rec.priority === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {rec.priority}
                              </span>
                              <span className="text-gray-600">+{rec.impact}pts</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{rec.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentAnalyzer;