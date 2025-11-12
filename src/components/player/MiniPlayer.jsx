import { Play, Pause, X } from 'lucide-react';
import { usePlayer } from '../../contexts/PlayerContext';
import { ProgressBar } from '../ui';

const MiniPlayer = () => {
  const {
    currentBook,
    isPlaying,
    currentTime,
    duration,
    isMinimized,
    togglePlay,
    maximize,
    closePlayer,
  } = usePlayer();
  
  if (!currentBook || !isMinimized) {
    return null;
  }
  
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  return (
    <>
      {/* Desktop Mini Player */}
      <div className="hidden md:block fixed bottom-0 left-0 right-0 z-40 bg-echo-charcoal border-t border-echo-player-border shadow-2xl">
        <div className="max-w-9xl mx-auto px-6">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-echo-player-border">
            <div 
              className="h-full bg-echo-orange transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          {/* Player Content */}
          <div 
            className="flex items-center justify-between py-3 cursor-pointer"
            onClick={maximize}
          >
            {/* Book Info */}
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <img 
                src={currentBook.cover} 
                alt={currentBook.title}
                className="w-12 h-12 rounded object-cover flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-white font-medium text-sm truncate">
                  {currentBook.title}
                </h4>
                <p className="text-echo-player-subtitle text-xs truncate">
                  {currentBook.author}
                </p>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="w-10 h-10 rounded-full bg-white text-echo-charcoal flex items-center justify-center hover:scale-105 transition-transform"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closePlayer();
                }}
                className="w-8 h-8 rounded-full hover:bg-echo-player-hover flex items-center justify-center transition-colors text-echo-player-subtitle hover:text-white"
                aria-label="Close player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Mini Player */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 bg-echo-charcoal border-t border-echo-player-border shadow-2xl safe-bottom">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-echo-player-border">
          <div 
            className="h-full bg-echo-orange transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {/* Player Content */}
        <div 
          className="flex items-center justify-between p-3"
          onClick={maximize}
        >
          {/* Book Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <img 
              src={currentBook.cover} 
              alt={currentBook.title}
              className="w-12 h-12 rounded object-cover flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-white font-medium text-sm truncate">
                {currentBook.title}
              </h4>
              <p className="text-echo-player-subtitle text-xs truncate">
                {currentBook.author}
              </p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="w-10 h-10 rounded-full bg-white text-echo-charcoal flex items-center justify-center active:scale-95 transition-transform"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MiniPlayer;
