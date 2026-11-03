import { useState, useRef, useEffect } from 'react';
import { Send, BookOpen, AlertTriangle, RotateCcw, Eye, EyeOff, AlertCircle, ChevronDown, X, Wifi, WifiOff } from 'lucide-react';
import Waveform from '../ui/Waveform';
import { getAIBookResponse } from '../../utils/aiBookChat';
import { getAIBookAnswer } from '../../utils/grokAPI';
import { FEATURES } from '../../config/api';
import { getAllBooks, detectBookMentions } from '../../utils/bookContext';
import { getFromLocalStorage } from '../../utils/localStorage';

/**
 * AI Book Chat Component
 * 
 * Context-aware AI assistant for discussing books:
 * - Answers questions about plot, characters, themes
 * - Spoiler protection: No spoilers by default
 * - Users can explicitly request spoilers
 * - Tracks reading progress to avoid spoilers
 */
const AIBookChat = ({ contextBook, playbackState }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: contextBook 
        ? `I can help with "${contextBook.title}". Ask about the plot, the characters, or something you just heard.`
        : 'I can help you explore the books in your library. Ask about characters, themes or what happens next. I avoid spoilers unless you ask for them.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [allowSpoilers, setAllowSpoilers] = useState(false);
  const [error, setError] = useState(null);
  const [useRealAI, setUseRealAI] = useState(FEATURES.useRealAI);
  const [currentBook, setCurrentBook] = useState(contextBook || null);
  const [showBookSelector, setShowBookSelector] = useState(false);
  const [bookSearch, setBookSearch] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const allBooks = getAllBooks();

  // Follow contextBook when the parent switches to another book (adjusting
  // state during render, so there is no extra effect pass)
  const [prevContextBook, setPrevContextBook] = useState(contextBook);
  if (contextBook !== prevContextBook) {
    setPrevContextBook(contextBook);
    if (contextBook) setCurrentBook(contextBook);
  }

  const filteredBooks = allBooks.filter(book => 
    book.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
    book.author.toLowerCase().includes(bookSearch.toLowerCase())
  );

  const handleBookSelect = (book) => {
    setCurrentBook(book);
    setShowBookSelector(false);
    setBookSearch('');
    setMessages([{
      role: 'assistant',
      content: `Let's talk about "${book.title}" by ${book.author}. Ask anything about this ${book.genre} audiobook. I keep it spoiler-free unless you turn spoilers on.`,
      timestamp: new Date(),
    }]);
  };

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

      // Auto-detect book mentions if no book selected
      let book = currentBook;
      if (!book && useRealAI) {
        const mentions = detectBookMentions(currentInput);
        if (mentions.length > 0) {
          book = mentions[0];
          setCurrentBook(book);
        }
      }

      if (useRealAI) {
        // Use real Grok API
        const conversationHistory = messages
          .filter(msg => !msg.isError)
          .slice(-6) // Keep last 6 messages for context
          .map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content,
          }));

        // Get user progress if book is selected
        const userProgress = book ? getFromLocalStorage('userProgress')?.[book.id]?.progress || 0 : 0;
        
        // Calculate real-time progress if playbackState is available and matching current book
        const realTimeProgress = (playbackState?.duration > 0 && book)
          ? Math.round(playbackState.currentTime / playbackState.duration * 100)
          : userProgress;

        response = await getAIBookAnswer(currentInput, {
          allowSpoilers,
          conversationHistory,
          currentBook: book,
          userProgress: realTimeProgress,
          currentChapter: playbackState?.currentChapter,
          currentTime: playbackState?.currentTime,
          bookCatalog: allBooks.slice(0, 50), // Top 50 books for context
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
        content: 'Sorry, something went wrong with that question. It may be temporary. Try again, or switch to offline mode.',
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
        content: currentBook 
          ? `Let's talk about "${currentBook.title}" by ${currentBook.author}. Ask anything about this ${currentBook.genre} audiobook. I keep it spoiler-free unless you turn spoilers on.`
          : 'Chat cleared. Ask anything about books. I keep it spoiler-free unless you tell me otherwise.',
        timestamp: new Date(),
      },
    ]);
    setAllowSpoilers(false);
  };

  const control = (on) => `inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[0.8125rem] font-medium ${on ? 'bg-ink text-paper' : 'border border-line-strong text-ink hover:bg-surface-sunk'}`;

  return (
    <div className="flex h-[500px] flex-col bg-surface">
      {/* Book Selection & Controls */}
      <div className="border-b border-line p-3">
        {/* Book Selector */}
        <div className="relative mb-2">
          {/* A div, not a button: it holds two separate buttons (pick, clear) */}
          <div className="flex items-center gap-1 rounded-lg border border-line-strong bg-surface">
            <button
              type="button"
              onClick={() => !contextBook && setShowBookSelector(!showBookSelector)}
              aria-expanded={contextBook ? undefined : showBookSelector}
              aria-haspopup={contextBook ? undefined : 'listbox'}
              disabled={Boolean(contextBook)}
              className="flex min-h-10 min-w-0 flex-1 items-center gap-2 rounded-lg px-3 text-left text-sm disabled:cursor-default"
            >
              {currentBook ? (
                <>
                  <BookOpen className="h-4 w-4 shrink-0 text-ink-2" strokeWidth={1.75} aria-hidden="true" />
                  <span className="t-title-book truncate text-ink">{currentBook.title}</span>
                </>
              ) : (
                <>
                  <span className="flex-1 text-ink-2">Choose a book to talk about</span>
                  <ChevronDown className="h-4 w-4 text-ink-3" strokeWidth={1.75} aria-hidden="true" />
                </>
              )}
            </button>
            {currentBook && !contextBook && (
              <button
                type="button"
                onClick={() => {
                  setCurrentBook(null);
                  handleReset();
                }}
                className="mr-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-2 hover:bg-surface-sunk hover:text-ink"
                aria-label="Clear the chosen book"
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
            )}
          </div>

          {/* Book Dropdown */}
          {showBookSelector && (
            <div className="absolute left-0 right-0 top-full z-10 mt-1 flex max-h-64 flex-col overflow-hidden rounded-lg border border-line bg-surface shadow-lg">
              <div className="border-b border-line p-2">
                <label htmlFor="ai-chat-book-search" className="sr-only">Search books</label>
                <input
                  id="ai-chat-book-search"
                  type="text"
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                  placeholder="Search books"
                  className="h-9 w-full rounded-md border border-line-strong bg-surface px-2.5 text-sm text-ink"
                />
              </div>
              <div className="overflow-y-auto" role="listbox" aria-label="Books">
                {filteredBooks.map(book => (
                  <button
                    key={book.id}
                    type="button"
                    role="option"
                    aria-selected={currentBook?.id === book.id}
                    onClick={() => handleBookSelect(book)}
                    className="w-full border-b border-line px-3 py-2 text-left last:border-0 hover:bg-surface-sunk"
                  >
                    <span className="t-title-book block truncate text-sm text-ink">{book.title}</span>
                    <span className="block truncate text-xs text-ink-2">{book.author} · {book.genre}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAllowSpoilers(!allowSpoilers)}
              aria-pressed={allowSpoilers}
              className={control(allowSpoilers)}
            >
              {allowSpoilers ? <EyeOff className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" /> : <Eye className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />}
              {allowSpoilers ? 'Spoilers on' : 'No spoilers'}
            </button>
            <button
              type="button"
              onClick={() => setUseRealAI(!useRealAI)}
              aria-pressed={useRealAI}
              className={control(useRealAI)}
              title={useRealAI ? 'Using Grok AI' : 'Using offline mode'}
            >
              {useRealAI ? <Wifi className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" /> : <WifiOff className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />}
              {useRealAI ? 'Live AI' : 'Offline'}
            </button>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-2 hover:bg-surface-sunk hover:text-ink"
            aria-label="Reset chat"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        {error && (
          <p role="alert" className="mt-2 flex items-start gap-2 rounded-md bg-danger-wash px-3 py-2 text-[0.8125rem] text-danger">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                message.role === 'user'
                  ? 'rounded-br-md bg-ink text-paper'
                  : `rounded-bl-md ${message.isError ? 'bg-danger-wash text-ink' : 'bg-surface-sunk text-ink'}`
              }`}
            >
              {message.role === 'assistant' && (
                <p className="mb-1 text-xs font-semibold text-ink-2">Book companion</p>
              )}

              {message.hasSpoilerWarning && (
                <p className="mb-2 flex items-start gap-2 rounded-md bg-hl-soft px-2.5 py-2 text-xs text-ink">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                  <span>This answer may contain spoilers, as you asked.</span>
                </p>
              )}

              <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>

              {message.suggestedQuestions && (
                <div className="mt-3 space-y-1.5 border-t border-line pt-3">
                  <p className="mb-1 text-xs font-semibold text-ink-2">You might also ask</p>
                  {message.suggestedQuestions.map((question, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSuggestedQuestion(question)}
                      className="block w-full rounded-md border border-line bg-surface px-2.5 py-1.5 text-left text-xs text-ink-2 hover:border-line-strong hover:text-ink"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}

              <p className={`mt-1.5 text-xs tabular ${message.role === 'user' ? 'text-ink-on-night-2' : 'text-ink-3'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-3 rounded-2xl rounded-bl-md bg-surface-sunk px-4 py-3" role="status">
              <Waveform seed="thinking" bars={12} height={14} className="h-3.5 w-14 text-ink-3" />
              <span className="text-xs text-ink-2">Thinking</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-line bg-surface p-3">
        <div className="flex gap-2">
          <label htmlFor="ai-chat-input" className="sr-only">Ask about a book</label>
          <input
            id="ai-chat-input"
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about any book"
            className="h-11 flex-1 rounded-full border border-line-strong bg-surface px-4 text-sm text-ink focus:border-ink focus:shadow-[0_0_0_3px_var(--hl)] focus:outline-none"
            disabled={loading}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-paper hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-45"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {(currentBook ? [
            `What's "${currentBook.title}" about?`,
            `Is "${currentBook.title}" worth listening to?`,
            'Similar books?',
          ] : [
            'What should I read next?',
            'Recommend a sci-fi book',
            'Popular books right now?',
          ]).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSuggestedQuestion(suggestion)}
              className="inline-flex min-h-8 items-center rounded-full border border-line px-3 text-xs text-ink-2 hover:border-line-strong hover:text-ink"
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

