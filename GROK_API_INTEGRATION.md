# 🤖 Grok API Integration - Complete Guide

## Overview

Your Listenable platform now features **real AI intelligence** powered by Grok API! The AI assistant provides genuine, context-aware responses for book recommendations and discussions.

---

## 🎯 What's New

### Before (Mock AI)
- ❌ Simulated responses
- ❌ Pre-programmed patterns
- ❌ Limited context awareness
- ❌ No real intelligence

### After (Real Grok AI)
- ✅ **Real LLM responses** from Grok
- ✅ **Context-aware conversations**
- ✅ **Intelligent recommendations**
- ✅ **Natural language understanding**
- ✅ **Adaptive responses**
- ✅ **Toggle between live/offline mode**

---

## 🔧 Technical Implementation

### Files Created/Modified

#### New Files:
1. **`src/config/api.js`** - API configuration and feature flags
2. **`src/utils/grokAPI.js`** - Grok API integration utilities

#### Modified Files:
1. **`src/components/ai/AIBookChat.jsx`** - Real API integration
2. **`src/components/ai/AIRecommendations.jsx`** - Live recommendations

---

## 📝 API Configuration

### Configuration File: `src/config/api.js`

```javascript
// Grok API Settings
export const GROK_API_CONFIG = {
  apiKey: process.env.GROK_API_KEY || 'YOUR_GROK_API_KEY_HERE',
  baseUrl: 'https://api.x.ai/v1',
  model: 'grok-beta',
  maxTokens: 1000,
  temperature: 0.7,
};

// Request Settings
export const API_CONFIG = {
  timeout: 30000,        // 30 seconds
  retryAttempts: 3,      // Retry failed requests 3 times
  retryDelay: 1000,      // 1 second between retries
};

// Feature Flags
export const FEATURES = {
  useRealAI: true,       // Toggle real AI vs mock
  enableCaching: true,   // Cache responses (future)
  enableAnalytics: false, // Track usage (future)
};
```

---

## 🚀 Core Functions

### 1. **callGrokAPI** - Base API Communication

```javascript
callGrokAPI(messages, options)
```

**Parameters:**
- `messages`: Array of {role, content} objects
- `options`: {temperature, maxTokens, model}

**Returns:** String response from Grok

**Example:**
```javascript
const response = await callGrokAPI([
  { role: 'system', content: 'You are a book expert' },
  { role: 'user', content: 'Recommend a sci-fi book' }
]);
```

### 2. **callGrokAPIWithRetry** - Robust API Calls

```javascript
callGrokAPIWithRetry(messages, options)
```

**Features:**
- Automatic retry on failure (3 attempts)
- Exponential backoff
- Error handling
- No retry on auth errors (401, 403)

### 3. **getAIBookRecommendations** - Smart Suggestions

```javascript
getAIBookRecommendations(context)
```

**Context Object:**
```javascript
{
  recentBooks: ['Book 1', 'Book 2'],
  favoriteGenres: ['Sci-Fi', 'Fantasy'],
  friendsReading: ['Book 3'],
  bookClubs: ['Club Name']
}
```

**Returns:** Array of 3 recommendations:
```javascript
[{
  title: "Book Title",
  author: "Author Name",
  reason: "Why it's perfect",
  match_score: 94,
  reason_type: "listening_history"
}]
```

### 4. **getAIBookAnswer** - Q&A System

```javascript
getAIBookAnswer(question, context)
```

**Context Object:**
```javascript
{
  allowSpoilers: false,
  currentBook: "Book Title",
  userProgress: 45,
  conversationHistory: [{role: 'user', content: '...'}]
}
```

**Returns:**
```javascript
{
  content: "AI response text",
  hasSpoilerWarning: false,
  suggestedQuestions: ['Question 1', 'Question 2', 'Question 3']
}
```

---

## 🎨 UI Features

### Live AI Toggle

Both AI components now have a **Live AI / Offline** toggle:

**In Chat:**
- 🟣 **Purple button** = Grok AI active
- ⚪ **Gray button** = Offline mode
- Located in top control bar

**In Recommendations:**
- ✨ **Sparkle icon** shows status
- Purple = Live AI
- Gray = Offline
- "Grok AI" badge when active

### Error Handling

**Visual Feedback:**
- 🟡 Yellow warning banner for API errors
- 🔴 Red error messages in chat
- ⚠️ Graceful fallback to offline mode
- Retry button for failed requests

---

## 🔒 Spoiler Protection System

### How It Works

The AI receives explicit instructions based on user settings:

#### When Spoilers DISABLED (Default):
```
CRITICAL RULES:
1. DO NOT reveal plot twists, endings, or major reveals
2. Discuss themes, writing style, character types (not fates)
3. Explain what makes the book compelling
4. Compare to similar books
5. NO plot specifics beyond the premise
```

#### When Spoilers ENABLED:
```
You may discuss:
- Full plot details
- Character arcs and endings
- Plot twists and surprises
- Story outcomes

WARNING: Add "⚠️ SPOILER WARNING" at start of response
```

### Visual Indicators:
- 🟢 Green badge = No Spoilers (safe)
- 🔴 Red badge = Spoilers OK
- ⚠️ Yellow warning in messages with spoilers

---

## 📊 API Usage & Limits

### Request Format

```javascript
POST https://api.x.ai/v1/chat/completions

Headers:
  Content-Type: application/json
  Authorization: Bearer gsk_gtkPaG...

Body:
{
  "messages": [...],
  "model": "grok-beta",
  "temperature": 0.7,
  "max_tokens": 1000,
  "stream": false
}
```

### Rate Limits
- Check Grok API documentation for current limits
- Retry logic handles temporary failures
- Exponential backoff prevents spam

### Token Management
- **Recommendations**: Max 800 tokens
- **Chat Responses**: Max 500 tokens
- **System Prompts**: ~200 tokens
- **Conversation History**: Last 6 messages

---

## 🧪 Testing the Integration

### 1. Test Chat Feature

```bash
# Start the app
npm run dev

# Navigate to any page
# Click purple AI button (bottom-right)
# Switch to "Ask About Books" tab
# Ensure "Live AI" is enabled (purple)
# Ask: "What should I read next?"
```

**Expected:**
- Real-time response from Grok
- Natural, contextual answer
- Suggested follow-up questions
- No spoilers by default

### 2. Test Recommendations

```bash
# In AI panel
# Click "Next Listen" tab
# Ensure "Grok AI" badge is visible
# Click refresh button
```

**Expected:**
- 3 personalized recommendations
- Real book suggestions from AI
- Contextual reasoning
- Match scores 85-98%

### 3. Test Spoiler Protection

```bash
# In chat
# Toggle spoilers OFF (green)
# Ask: "How does The Three-Body Problem end?"
```

**Expected:**
- AI refuses to reveal ending
- Suggests enabling spoilers
- Keeps response safe

```bash
# Toggle spoilers ON (red)
# Ask same question
```

**Expected:**
- ⚠️ SPOILER WARNING appears
- Detailed plot discussion
- Ending explanation

### 4. Test Error Handling

```bash
# Temporarily set invalid API key in config
# Try to use AI features
```

**Expected:**
- Yellow error banner appears
- Graceful fallback to offline mode
- User can still use app
- Clear error message

---

## 🔧 Customization

### Adjust AI Behavior

**In `src/config/api.js`:**

```javascript
// More creative responses
temperature: 0.9  // 0.0 = deterministic, 1.0 = very creative

// Longer responses
maxTokens: 1500

// Different model (if available)
model: 'grok-2'  // Check Grok docs for models
```

### Modify System Prompts

**In `src/utils/grokAPI.js`:**

Edit the `systemPrompt` in:
- `getAIBookRecommendations` - Change recommendation style
- `getAIBookAnswer` - Modify conversational tone

**Example:**
```javascript
const systemPrompt = `You are an expert audiobook sommelier.
Speak in a refined, sophisticated tone.
Make literary references and comparisons.
Focus on narrative craft and storytelling excellence.`;
```

### Add Caching (Future Enhancement)

```javascript
// In src/utils/grokAPI.js
const responseCache = new Map();

export const callGrokAPIWithCache = async (messages, options) => {
  const cacheKey = JSON.stringify(messages);
  
  if (responseCache.has(cacheKey)) {
    return responseCache.get(cacheKey);
  }
  
  const response = await callGrokAPI(messages, options);
  responseCache.set(cacheKey, response);
  
  return response;
};
```

---

## 🐛 Troubleshooting

### Issue: "API Error 401"
**Cause:** Invalid API key
**Solution:** Verify key in `src/config/api.js`

### Issue: "API Error 429"
**Cause:** Rate limit exceeded
**Solution:** Wait and retry, or implement request throttling

### Issue: "Network Error"
**Cause:** No internet connection
**Solution:** Switch to offline mode (gray button)

### Issue: "Timeout"
**Cause:** Slow response from API
**Solution:** Increase timeout in `API_CONFIG.timeout`

### Issue: Responses Too Generic
**Cause:** Low temperature or insufficient context
**Solution:** 
- Increase `temperature` (0.7 → 0.9)
- Provide more context in prompts
- Increase `maxTokens`

### Issue: AI Not Respecting Spoiler Settings
**Cause:** System prompt may need adjustment
**Solution:** Strengthen spoiler rules in `getAIBookAnswer`

---

## 📈 Monitoring & Analytics

### Console Logs

The integration includes console logging:
- ✅ Successful API calls
- ❌ Error details
- 🔄 Retry attempts
- ⏱️ Response times

**View in Browser:**
```
F12 → Console → Filter: "Grok" or "API"
```

### Future Analytics

Add tracking for:
```javascript
{
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  averageResponseTime: 0,
  tokensUsed: 0,
  mostAskedQuestions: [],
  topRecommendations: []
}
```

---

## 🚀 Deployment Considerations

### Environment Variables (Production)

For production, move API key to environment variable:

**Create `example.env`:**
```bash
# Grok API Configuration
VITE_GROK_API_KEY=your_api_key_here
VITE_GROK_BASE_URL=https://api.x.ai/v1
VITE_GROK_MODEL=grok-beta
```

**Update `src/config/api.js`:**
```javascript
export const GROK_API_CONFIG = {
  apiKey: import.meta.env.VITE_GROK_API_KEY || 'fallback_key',
  baseUrl: import.meta.env.VITE_GROK_BASE_URL || 'https://api.x.ai/v1',
  model: import.meta.env.VITE_GROK_MODEL || 'grok-beta',
  // ...
};
```

### Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** in production
3. **Implement rate limiting** on frontend
4. **Add request signing** for additional security
5. **Monitor API usage** for abuse

### Performance Optimization

```javascript
// Implement request debouncing
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Debounce AI requests (wait 500ms after typing stops)
const debouncedAIRequest = debounce(handleSend, 500);
```

---

## 📚 API Reference Summary

### Core Functions

| Function | Purpose | Returns |
|----------|---------|---------|
| `callGrokAPI` | Base API communication | String |
| `callGrokAPIWithRetry` | API call with retry logic | String |
| `getAIBookRecommendations` | Get 3 book suggestions | Array |
| `getAIBookAnswer` | Get Q&A response | Object |
| `checkGrokAPIHealth` | Test API connectivity | Boolean |

### Configuration Objects

| Object | Purpose | Location |
|--------|---------|----------|
| `GROK_API_CONFIG` | API settings | `src/config/api.js` |
| `API_CONFIG` | Request settings | `src/config/api.js` |
| `FEATURES` | Feature flags | `src/config/api.js` |

---

## 🎓 Educational Value

### Demonstrates:
1. **Real API Integration** - Production-ready patterns
2. **Error Handling** - Graceful degradation
3. **User Experience** - Loading states, feedback
4. **Security** - API key management
5. **Retry Logic** - Robust network handling
6. **Fallback Systems** - Offline mode
7. **Context Management** - Conversation history

### Learning Outcomes:
- How to integrate LLM APIs
- Managing API keys securely
- Handling async operations
- Error boundaries and recovery
- User feedback patterns
- Progressive enhancement

---

## 🎯 Next Steps

### Immediate:
1. ✅ Test all AI features
2. ✅ Verify spoiler protection
3. ✅ Check error handling
4. ✅ Monitor API usage

### Short-term:
1. Add response caching
2. Implement rate limiting
3. Add usage analytics
4. Optimize token usage

### Long-term:
1. Streaming responses (real-time)
2. Multi-modal features (images)
3. Voice input/output
4. Personalization learning
5. A/B testing different prompts

---

## ✅ Checklist

- [x] Grok API integration complete
- [x] Chat uses real AI
- [x] Recommendations use real AI
- [x] Spoiler protection working
- [x] Error handling implemented
- [x] Retry logic active
- [x] Live/Offline toggle added
- [x] Build successful
- [x] No linting errors
- [x] Documentation complete

---

## 🎉 Success!

Your AI assistant is now **powered by real Grok intelligence**! Users get genuine, contextual responses that adapt to their reading preferences and respect their spoiler settings.

**Test it now:**
```bash
npm run dev
# Click the purple AI button and start chatting!
```

---

**Last Updated:** November 20, 2025  
**Version:** 2.1.0 (with Grok API)  
**Status:** 🟢 Production Ready with Live AI  
**API:** Grok Beta by xAI

