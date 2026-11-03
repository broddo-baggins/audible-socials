import { useState } from 'react';
import { Bot, X, BookOpen, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import AIRecommendations from './AIRecommendations';
import AIBookChat from './AIBookChat';
import { usePlayer } from '../../contexts/usePlayer';

/**
 * AI Assistant Component
 * 
 * A floating AI assistant that provides:
 * 1. Smart book recommendations based on listening history
 * 2. Context-aware Q&A about books with spoiler protection
 */
const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('recommendations'); // 'recommendations' or 'chat'
  const [isMinimized, setIsMinimized] = useState(false);
  const { currentBook, isMinimized: playerMinimized } = usePlayer();
  // the full player has its own book companion
  const playerOpen = Boolean(currentBook) && !playerMinimized;

  const tabs = [
    { id: 'recommendations', label: 'Next listen', icon: BookOpen },
    { id: 'chat', label: 'Ask about books', icon: MessageSquare },
  ];

  return (
    <>
      {/* Launcher: a quiet ink pill, not a glowing robot */}
      {!isOpen && !playerOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-4 z-50 inline-flex h-12 items-center gap-2 rounded-full bg-ink pl-4 pr-5 text-[0.9375rem] font-medium text-paper shadow-md hover:bg-gray-800 md:right-6"
          aria-label="Open the reading assistant"
        >
          <MessageSquare className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          <span className="hidden sm:inline">Ask about a book</span>
        </button>
      )}

      {isOpen && !playerOpen && (
        <div
          role="dialog"
          aria-label="Reading assistant"
          className="fixed bottom-24 right-4 z-50 w-[26rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-line bg-surface shadow-md md:right-6"
        >
          <div className="border-b border-line px-4 pt-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-hl text-ink">
                  <Bot className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-[0.9375rem] font-semibold text-ink">Reading assistant</h2>
                  <p className="text-[0.8125rem] text-ink-3">An AI helper. It keeps your place, and your spoilers.</p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-2 hover:bg-surface-sunk hover:text-ink"
                  aria-label={isMinimized ? 'Expand assistant' : 'Collapse assistant'}
                  aria-expanded={!isMinimized}
                >
                  {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-2 hover:bg-surface-sunk hover:text-ink"
                  aria-label="Close assistant"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <div className="mt-3 flex gap-5" role="tablist" aria-label="Assistant">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const selected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative inline-flex h-10 items-center gap-2 text-sm font-medium ${selected ? 'text-ink' : 'text-ink-2 hover:text-ink'}`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                      {tab.label}
                      {selected && <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-hl" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {!isMinimized && (
            <div className="max-h-[min(600px,60vh)] overflow-y-auto" role="tabpanel">
              {activeTab === 'recommendations' && <AIRecommendations />}
              {activeTab === 'chat' && <AIBookChat />}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AIAssistant;
