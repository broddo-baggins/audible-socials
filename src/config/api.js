/**
 * API Configuration
 * 
 * Centralized configuration for external API integrations
 */

// Grok API Configuration
// The browser calls our own serverless proxy (api/grok.js). The xAI key lives
// only on the server as GROK_API_KEY and is never bundled into the client.
export const GROK_API_CONFIG = {
  endpoint: '/api/grok',
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

