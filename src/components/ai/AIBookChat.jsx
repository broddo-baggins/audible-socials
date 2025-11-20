import { useState, useRef, useEffect } from 'react';
import { Send, BookOpen, AlertTriangle, Sparkles, RotateCcw, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { getAIBookResponse } from '../../utils/aiBookChat';
import { getAIBookAnswer } from '../../utils/grokAPI';
import { FEATURES } from '../../config/api';

/**
 * AI Book Chat Component
 * 
 * Context-aware AI assistant for discussing books:
 * - Answers questions about plot, characters, themes
 * - Spoiler protection: No spoilers by default
 * - Users can explicitly request spoilers
 * - Tracks reading progress to avoid spoilers
 */
const AIBookChat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I can help you explore books in your library. Ask me about characters, themes, or what happens next. I\'ll avoid spoilers unless you specifically ask for them! 📚',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [allowSpoilers, setAllowSpoilers] = useState(false);
  const [error, setError] = useState(null);
  const [useRealAI, setUseRealAI] = useState(FEATURES.useRealAI);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);
    setError(null);

    try {
      let response;

      if (useRealAI) {
        // Use real Grok API
        const conversationHistory = messages
          .slice(-6) // Keep last 6 messages for context
          .map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content,
          }));

        response = await getAIBookAnswer(currentInput, {
          allowSpoilers,
          conversationHistory,
          currentBook: null, // Could be enhanced to track current book
          userProgress: 0,
        });
      } else {
        // Fallback to mock responses
        await new Promise(resolve => setTimeout(resolve, 1000));
        response = getAIBookResponse(currentInput, allowSpoilers);
      }
      
      const assistantMessage = {
        role: 'assistant',
        content: response.content,
        hasSpoilerWarning: response.hasSpoilerWarning,
        suggestedQuestions: response.suggestedQuestions,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('AI Chat Error:', err);
      setError(err.message || 'Failed to get AI response. Please try again.');
      
      // Add error message to chat
      const errorMessage = {
        role: 'assistant',
        content: '⚠️ Sorry, I encountered an error processing your question. This might be a temporary issue. Please try again, or toggle to offline mode.',
        isError: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedQuestion = (question) => {
    setInput(question);
    inputRef.current?.focus();
  };

  const handleReset = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Chat reset! Ask me anything about your books. I\'ll keep it spoiler-free unless you tell me otherwise! 📚',
        timestamp: new Date(),
      },
    ]);
    setAllowSpoilers(false);
  };

  return (
    <div className="flex flex-col h-[500px]">
      {/* Spoiler Toggle & Controls */}
      <div className="p-3 bg-audible-gray-50 border-b border-audible-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAllowSpoilers(!allowSpoilers)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                allowSpoilers
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {allowSpoilers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {allowSpoilers ? 'Spoilers OK' : 'No Spoilers'}
            </button>
            <button
              onClick={() => setUseRealAI(!useRealAI)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                useRealAI
                  ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={useRealAI ? 'Using Grok AI' : 'Using Offline Mode'}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {useRealAI ? 'Live AI' : 'Offline'}
            </button>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 hover:bg-audible-gray-200 rounded-lg transition-colors"
            aria-label="Reset chat"
          >
            <RotateCcw className="w-3.5 h-3.5 text-audible-text-secondary" />
          </button>
        </div>
        {error && (
          <div className="flex items-center gap-2 px-2 py-1.5 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index}>
            <div
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white'
                    : 'bg-audible-gray-100 text-audible-text-primary'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span className="text-xs font-semibold text-purple-600">AI Assistant</span>
                  </div>
                )}
                
                {message.hasSpoilerWarning && (
                  <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-yellow-800">
                      This response may contain spoilers based on your request.
                    </span>
                  </div>
                )}

                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

                {message.suggestedQuestions && (
                  <div className="mt-3 pt-3 border-t border-audible-gray-200 space-y-1.5">
                    <p className="text-xs font-semibold text-audible-text-secondary mb-2">
                      You might also ask:
                    </p>
                    {message.suggestedQuestions.map((question, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestedQuestion(question)}
                        className="block w-full text-left text-xs px-2 py-1.5 bg-white hover:bg-audible-gray-50 border border-audible-gray-200 rounded text-audible-text-secondary hover:text-audible-orange transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                )}

                <div
                  className={`text-xs mt-1.5 ${
                    message.role === 'user' ? 'text-white/70' : 'text-audible-text-tertiary'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-audible-gray-100">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-audible-text-tertiary">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-audible-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about any book..."
            className="flex-1 px-4 py-2.5 text-sm border border-audible-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {[
            'What should I read next?',
            'Tell me about this book',
            'Similar books?',
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestedQuestion(suggestion)}
              className="text-xs px-2.5 py-1 bg-audible-gray-100 hover:bg-audible-gray-200 text-audible-text-secondary rounded-full transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIBookChat;

