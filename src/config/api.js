/**
 * API Configuration
 * 
 * Centralized configuration for external API integrations
 */

// Grok API Configuration
export const GROK_API_CONFIG = {
  apiKey: import.meta.env.VITE_GROK_API_KEY || 'YOUR_GROK_API_KEY_HERE',
  baseUrl: 'https://api.x.ai/v1',
  model: 'grok-beta',
  maxTokens: 1000,
  temperature: 0.7,
};

// API Request Configuration
export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
};

// Feature Flags
export const FEATURES = {
  useRealAI: true, // Toggle between real API and mock responses
  enableCaching: true,
  enableAnalytics: false,
};

