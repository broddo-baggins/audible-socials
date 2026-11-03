#!/usr/bin/env node

/**
 * API Key Testing Script
 *
 * Tests your Grok API key to ensure it works before using it in the application
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { DEFAULT_MODEL, extractText } from '../api/grok.js';

// Load environment variables from .env.local (or .env)
function loadEnv() {
  const envPath = ['.env.local', '.env']
    .map((name) => path.join(process.cwd(), name))
    .find((candidate) => fs.existsSync(candidate));
  if (envPath) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};

    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    });

    return envVars;
  }
  return {};
}

async function testApiKey(apiKey) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      input: [
        { role: 'user', content: 'Hello! Are you Grok from xAI? Please respond with a short greeting.' }
      ],
      model: process.env.GROK_MODEL || DEFAULT_MODEL,
      store: false,
      temperature: 0.7,
      max_output_tokens: 50
    });

    const options = {
      hostname: 'api.x.ai',
      path: '/v1/responses',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': 'Listenable-App-Test/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);

          const text = extractText(response);
          if (text) {
            resolve({
              success: true,
              message: text,
              usage: response.usage
            });
          } else if (response.error) {
            resolve({
              success: false,
              error: response.error,
              statusCode: res.statusCode
            });
          } else {
            resolve({
              success: false,
              error: 'Unexpected response format',
              rawResponse: body
            });
          }
        } catch {
          resolve({
            success: false,
            error: 'Invalid JSON response',
            rawResponse: body
          });
        }
      });
    });

    req.on('error', (e) => {
      resolve({
        success: false,
        error: `Network error: ${e.message}`
      });
    });

    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('🧪 Testing Grok API Key');
  console.log('======================\n');

  // Load API key from environment
  const envVars = loadEnv();
  const apiKey = process.env.GROK_API_KEY || envVars.GROK_API_KEY;

  if (!apiKey) {
    console.log('❌ No API key found in .env.local');
    console.log('Please create a .env.local file with:');
    console.log('GROK_API_KEY=your_api_key_here\n');
    console.log('Do not use a VITE_ prefix: Vite would bundle the key into the public JS.\n');
    process.exit(1);
  }

  if (apiKey === 'YOUR_GROK_API_KEY_HERE') {
    console.log('❌ API key is still set to placeholder value');
    console.log('Please replace with your actual API key from https://console.x.ai\n');
    process.exit(1);
  }

  console.log('🔑 Testing API key format...');
  if (!apiKey.startsWith('xai-')) {
    console.log('❌ API key does not have correct format (xAI keys start with xai-)');
    process.exit(1);
  }

  console.log('✅ API key format looks correct');
  console.log('🚀 Testing connection to Grok API...\n');

  const result = await testApiKey(apiKey);

  if (result.success) {
    console.log('🎉 SUCCESS! Your API key is working!');
    console.log('🤖 Grok Response:', result.message);
    if (result.usage) {
      console.log('📊 Tokens used:', result.usage.total_tokens);
    }
    console.log('\n🟢 Your application will now use REAL Grok AI!');
    console.log('Run "npm run dev" to start with live AI features.');
  } else {
    console.log('❌ FAILED! API key validation failed.');
    console.log('Error:', result.error);

    if (result.rawResponse) {
      console.log('Raw response:', result.rawResponse);
    }

    console.log('\n🔧 Troubleshooting:');
    console.log('1. Go to https://console.x.ai');
    console.log('2. Generate a new API key');
    console.log('3. Update your .env.local file');
    console.log('4. Run this test again');

    console.log('\n📚 Note: Your app will still work with intelligent mock responses');
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
