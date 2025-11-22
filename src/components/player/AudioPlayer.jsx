import { useState } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  X, Maximize2, Minimize2, Bookmark, List, Clock, Sparkles
} from 'lucide-react';
import { usePlayer } from '../../contexts/usePlayer';
import { ProgressBar, Button, Badge } from '../ui';
import IdleGame from '../idle/IdleGame';
import AIBookChat from '../ai/AIBookChat';

const AudioPlayer = () => {
  const {
    currentBook,
    isPlaying,
    currentTime,
    duration,
    currentChapter,
    playbackSpeed,
    volume,
    sleepTimer,
    isMinimized,
    togglePlay,
    seek,
    skipForward,
    skipBackward,
    changeSpeed,
    changeVolume,
    setSleepTimerMinutes,
    addBookmark,
    goToChapter,
    minimize,
    closePlayer,
    formatTime,
  } = usePlayer();
  
  const [showChapters, setShowChapters] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showSleepTimer, setShowSleepTimer] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const speedOptions = [0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
  const sleepTimerOptions = [5, 15, 30, 45, 60];
  
  if (!currentBook || isMinimized) {
    return null;
  }
  
  const handleVolumeToggle = () => {
    if (isMuted) {
      changeVolume(1.0);
      setIsMuted(false);
    } else {
      changeVolume(0);
      setIsMuted(true);
    }
  };
  
  const handleSpeedChange = (speed) => {
    changeSpeed(speed);
    setShowSpeedMenu(false);
  };
  
  const handleSleepTimer = (minutes) => {
    setSleepTimerMinutes(minutes);
    setShowSleepTimer(false);
  };
  
  const handleBookmark = () => {
    addBookmark();
    // Could show a toast notification
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-echo-player-bg flex items-center justify-center player-dark-bg">
      <div className="w-full h-full max-w-7xl mx-auto flex flex-col md:flex-row gap-8 p-6 md:p-12">
        {/* Left Side - Cover Art */}
        <div className="flex-shrink-0 flex items-center justify-center md:w-2/5">
          <div className="relative w-full max-w-md aspect-book">
            <img
              src={currentBook.cover}
              alt={`${currentBook.title} cover`}
              className="w-full h-full object-cover rounded-2xl shadow-2xl"
            />
            {currentBook.contentType !== 'audiobook' && (
              <div className="absolute top-4 left-4">
                <Badge 
                  variant={currentBook.contentType === 'original' ? 'original' : 'podcast'} 
                  size="md"
                >
                  {currentBook.contentType === 'original' ? 'Original' : 'Podcast'}
                </Badge>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Side - Controls and Info */}
        <div className="flex-1 flex flex-col justify-between min-h-0 relative">
          {/* Header Actions */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-echo-player-text mb-2 line-clamp-2">
                {currentBook.title}
              </h1>
              <p className="text-lg text-echo-player-text-muted mb-1">
                By {currentBook.author}
              </p>
              {currentBook.narrator && (
                <p className="text-base text-echo-player-text-muted">
                  Narrated by {currentBook.narrator}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={minimize}
                className="p-2 text-echo-player-text hover:bg-echo-player-elevated rounded-lg transition-colors"
                aria-label="Minimize player"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
              <button
                onClick={closePlayer}
                className="p-2 text-echo-player-text hover:bg-echo-player-elevated rounded-lg transition-colors"
                aria-label="Close player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Chapter Info */}
          {currentBook.chapters && currentBook.chapters[currentChapter] && (
            <div className="mb-6 px-4 py-3 bg-echo-player-surface rounded-lg">
              <p className="text-sm text-echo-player-text-muted mb-1">Current Chapter</p>
              <p className="text-base text-echo-player-text font-medium">
                {currentBook.chapters[currentChapter].title}
              </p>
            </div>
          )}
          
          {/* Progress Bar */}
          <div className="mb-8">
            <ProgressBar
              value={currentTime}
              max={duration}
              showTime={true}
              currentTime={formatTime(currentTime)}
              totalTime={formatTime(duration)}
              interactive={true}
              onChange={seek}
              variant="player"
              size="lg"
            />
          </div>
          
          {/* Main Controls */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <button
              onClick={() => skipBackward(15)}
              className="p-3 text-echo-player-text hover:bg-echo-player-elevated rounded-full transition-colors"
              aria-label="Skip back 15 seconds"
            >
              <SkipBack className="w-6 h-6" />
            </button>
            
            <button
              onClick={togglePlay}
              className="w-16 h-16 flex items-center justify-center bg-echo-orange hover:bg-echo-orange-dark rounded-full text-white transition-colors shadow-lg"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" fill="currentColor" />
              ) : (
                <Play className="w-8 h-8 ml-1" fill="currentColor" />
              )}
            </button>
            
            <button
              onClick={() => skipForward(30)}
              className="p-3 text-echo-player-text hover:bg-echo-player-elevated rounded-full transition-colors"
              aria-label="Skip forward 30 seconds"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>
          
          {/* Secondary Controls */}
          <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center gap-3">
              {/* Volume */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleVolumeToggle}
                  className="p-2 text-echo-player-text hover:bg-echo-player-elevated rounded-lg transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    changeVolume(parseFloat(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-24 player-scrubber"
                  aria-label="Volume"
                />
              </div>
              
              {/* Playback Speed */}
              <div className="relative">
                <button
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  className="px-3 py-2 text-echo-player-text hover:bg-echo-player-elevated rounded-lg transition-colors text-sm font-medium"
                  aria-label="Playback speed"
                >
                  {playbackSpeed}x
                </button>
                {showSpeedMenu && (
                  <div className="absolute bottom-full left-0 mb-2 bg-echo-player-surface rounded-lg shadow-xl border border-echo-player-border overflow-hidden min-w-[100px]">
                    {speedOptions.map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                          speed === playbackSpeed
                            ? 'bg-echo-orange text-white'
                            : 'text-echo-player-text hover:bg-echo-player-elevated'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {/* Sleep Timer */}
              <div className="relative">
                <button
                  onClick={() => setShowSleepTimer(!showSleepTimer)}
                  className={`p-2 rounded-lg transition-colors ${
                    sleepTimer
                      ? 'bg-echo-orange text-white'
                      : 'text-echo-player-text hover:bg-echo-player-elevated'
                  }`}
                  aria-label="Sleep timer"
                >
                  <Clock className="w-5 h-5" />
                </button>
                {showSleepTimer && (
                  <div className="absolute bottom-full right-0 mb-2 bg-echo-player-surface rounded-lg shadow-xl border border-echo-player-border overflow-hidden min-w-[120px] z-10">
                    <div className="px-4 py-2 text-sm text-echo-player-text-muted border-b border-echo-player-border">
                      Sleep timer
                    </div>
                    {sleepTimerOptions.map((minutes) => (
                      <button
                        key={minutes}
                        onClick={() => handleSleepTimer(minutes)}
                        className="w-full px-4 py-2 text-left text-sm text-echo-player-text hover:bg-echo-player-elevated transition-colors"
                      >
                        {minutes} min
                      </button>
                    ))}
                    {sleepTimer && (
                      <button
                        onClick={() => handleSleepTimer(null)}
                        className="w-full px-4 py-2 text-left text-sm text-echo-error hover:bg-echo-player-elevated transition-colors border-t border-echo-player-border"
                      >
                        Cancel timer
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              {/* AI Chat Toggle */}
              <button
                onClick={() => setShowAIChat(!showAIChat)}
                className={`p-2 rounded-lg transition-colors ${
                  showAIChat 
                    ? 'bg-purple-600 text-white' 
                    : 'text-echo-player-text hover:bg-echo-player-elevated'
                }`}
                aria-label="Ask AI about this book"
              >
                <Sparkles className="w-5 h-5" />
              </button>

              {/* Bookmark */}
              <button
                onClick={handleBookmark}
                className="p-2 text-echo-player-text hover:bg-echo-player-elevated rounded-lg transition-colors"
                aria-label="Add bookmark"
              >
                <Bookmark className="w-5 h-5" />
              </button>
              
              {/* Chapters */}
              {currentBook.chapters && currentBook.chapters.length > 0 && (
                <button
                  onClick={() => setShowChapters(!showChapters)}
                  className="p-2 text-echo-player-text hover:bg-echo-player-elevated rounded-lg transition-colors"
                  aria-label="Chapters"
                >
                  <List className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Idle Game */}
          <div className="mt-6">
            <IdleGame isPlaying={isPlaying} currentBook={currentBook} />
          </div>

          {/* AI Chat Modal */}
          {showAIChat && (
            <div className="absolute bottom-20 right-0 z-50 w-full md:w-96 bg-white rounded-xl shadow-2xl overflow-hidden border border-audible-gray-200 flex flex-col max-h-[60vh] md:max-h-[500px]">
              <div className="flex items-center justify-between px-4 py-3 bg-purple-600 text-white shrink-0">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-medium text-sm">Book Companion</span>
                </div>
                <button 
                  onClick={() => setShowAIChat(false)}
                  className="p-1 hover:bg-purple-500 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden bg-white">
                <AIBookChat 
                  contextBook={currentBook}
                  playbackState={{
                    currentTime,
                    duration,
                    currentChapter,
                    currentBook
                  }}
                  compact={true}
                />
              </div>
            </div>
          )}

          {/* Chapters Panel */}
          {showChapters && currentBook.chapters && (
            <div className="mt-6 bg-echo-player-surface rounded-lg p-4 max-h-64 overflow-y-auto">
              <h3 className="text-lg font-semibold text-echo-player-text mb-3">Chapters</h3>
              <div className="space-y-2">
                {currentBook.chapters.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    onClick={() => goToChapter(index)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      index === currentChapter
                        ? 'bg-echo-orange text-white'
                        : 'text-echo-player-text hover:bg-echo-player-elevated'
                    }`}
                  >
                    <span className="text-left font-medium">{chapter.title}</span>
                    <span className="text-sm opacity-75">{chapter.duration}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
