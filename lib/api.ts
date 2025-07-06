// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface AnalysisRequest {
  content: string;
  target_platforms?: string[];
  industry?: string;
  brand_voice?: string;
}

export interface OptimizationRequest {
  content: string;
  target_platform: string;
  optimization_level?: 'balanced' | 'aggressive' | 'conservative';
  maintain_voice?: boolean;
}

export interface PlatformTestRequest {
  query: string;
  content: string;
  platforms: string[];
}

export interface AnalysisResult {
  platforms: Record<string, {
    overall_score: number;
    features: Record<string, number>;
    recommendations: Array<{
      priority: string;
      action: string;
      impact: number;
      effort: string;
      description: string;
    }>;
  }>;
  average_score: number;
  top_platform: string;
  industry_benchmark: number;
}

export interface OptimizationResult {
  original_content: string;
  optimized_content: string;
  original_score: number;
  optimized_score: number;
  improvements: number;
  transformations: Array<{
    type: string;
    description: string;
  }>;
}

export interface PlatformTestResult {
  query: string;
  results: Record<string, {
    appears: boolean;
    position?: number;
    snippet?: string;
    confidence_score: number;
    optimization_score: number;
  }>;
  visibility_score: number;
}

export interface ROIPrediction {
  current_monthly_revenue: number;
  projected_monthly_revenue: number;
  monthly_increase: number;
  annual_roi: number;
  confidence: number;
}

class APIClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async analyzeContent(request: AnalysisRequest): Promise<AnalysisResult> {
    return this.request<AnalysisResult>('/analyze', {
      method: 'POST',
      body: JSON.stringify({
        content: request.content,
        target_platforms: request.target_platforms || ['chatgpt', 'claude', 'perplexity', 'google_ai'],
        industry: request.industry,
        brand_voice: request.brand_voice,
      }),
    });
  }

  async optimizeContent(request: OptimizationRequest): Promise<OptimizationResult> {
    return this.request<OptimizationResult>('/optimize', {
      method: 'POST',
      body: JSON.stringify({
        content: request.content,
        target_platform: request.target_platform,
        optimization_level: request.optimization_level || 'balanced',
        maintain_voice: request.maintain_voice ?? true,
      }),
    });
  }

  async testPlatforms(request: PlatformTestRequest): Promise<PlatformTestResult> {
    return this.request<PlatformTestResult>('/test-platforms', {
      method: 'POST',
      body: JSON.stringify({
        query: request.query,
        content: request.content,
        platforms: request.platforms,
      }),
    });
  }

  async predictROI(
    currentScore: number,
    optimizedScore: number,
    monthlyTraffic: number = 10000,
    conversionRate: number = 0.02,
    averageOrderValue: number = 2000
  ): Promise<ROIPrediction> {
    return this.request<ROIPrediction>('/predict-roi', {
      method: 'POST',
      body: JSON.stringify({
        current_score: currentScore,
        optimized_score: optimizedScore,
        monthly_traffic: monthlyTraffic,
        conversion_rate: conversionRate,
        average_order_value: averageOrderValue,
      }),
    });
  }

  async healthCheck(): Promise<{ status: string; version: string; timestamp: string }> {
    return this.request<{ status: string; version: string; timestamp: string }>('/health');
  }
}

export const apiClient = new APIClient();