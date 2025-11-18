import { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { PlayerContext } from './PlayerContextObject';

export const PlayerProvider = ({ children }) => {
  const [currentBook, setCurrentBook] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [sleepTimer, setSleepTimer] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [isMinimized, setIsMinimized] = useState(true);
  
  const playbackIntervalRef = useRef(null);
  const sleepTimerRef = useRef(null);
  
  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('echoread_player_state');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        if (state.currentBook) {
          setCurrentBook(state.currentBook);
          setCurrentTime(state.currentTime || 0);
          setCurrentChapter(state.currentChapter || 0);
          setPlaybackSpeed(state.playbackSpeed || 1.0);
        }
      } catch (e) {
        console.error('Failed to load player state:', e);
      }
    }
  }, []);
  
  // Save state to localStorage
  useEffect(() => {
    if (currentBook) {
      const state = {
        currentBook,
        currentTime,
        currentChapter,
        playbackSpeed,
      };
      localStorage.setItem('echoread_player_state', JSON.stringify(state));
    }
  }, [currentBook, currentTime, currentChapter, playbackSpeed]);
  
  // Simulate playback
  useEffect(() => {
    if (isPlaying && currentBook) {
      playbackIntervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + playbackSpeed;
          if (newTime >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    }
    
    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, [isPlaying, currentBook, duration, playbackSpeed]);
  
  // Handle sleep timer
  useEffect(() => {
    if (sleepTimer) {
      sleepTimerRef.current = setTimeout(() => {
        setIsPlaying(false);
        setSleepTimer(null);
      }, sleepTimer * 60 * 1000);
    }
    
    return () => {
      if (sleepTimerRef.current) {
        clearTimeout(sleepTimerRef.current);
      }
    };
  }, [sleepTimer]);
  
  const loadBook = useCallback((book) => {
    setCurrentBook(book);
    setDuration(book.durationMinutes || 0);
    setCurrentTime(book.progress || 0);
    setCurrentChapter(0);
    setIsMinimized(false);
  }, []);
  
  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);
  
  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);
  
  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);
  
  const seek = useCallback((time) => {
    setCurrentTime(Math.max(0, Math.min(time, duration)));
  }, [duration]);
  
  const skipForward = useCallback((seconds = 30) => {
    setCurrentTime(prev => Math.min(prev + seconds, duration));
  }, [duration]);
  
  const skipBackward = useCallback((seconds = 30) => {
    setCurrentTime(prev => Math.max(prev - seconds, 0));
  }, []);
  
  const changeSpeed = useCallback((speed) => {
    setPlaybackSpeed(speed);
  }, []);
  
  const changeVolume = useCallback((newVolume) => {
    setVolume(Math.max(0, Math.min(newVolume, 1)));
  }, []);
  
  const setSleepTimerMinutes = useCallback((minutes) => {
    setSleepTimer(minutes);
  }, []);
  
  const addBookmark = useCallback(() => {
    if (currentBook) {
      const bookmark = {
        id: Date.now(),
        bookId: currentBook.id,
        time: currentTime,
        chapter: currentChapter,
        note: '',
        createdAt: new Date().toISOString(),
      };
      setBookmarks(prev => [...prev, bookmark]);
    }
  }, [currentBook, currentTime, currentChapter]);
  
  const removeBookmark = useCallback((bookmarkId) => {
    setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
  }, []);
  
  const goToChapter = useCallback((chapterIndex) => {
    if (currentBook && currentBook.chapters && currentBook.chapters[chapterIndex]) {
      setCurrentChapter(chapterIndex);
      // Calculate time based on previous chapters
      let chapterStartTime = 0;
      for (let i = 0; i < chapterIndex; i++) {
        const [hours, minutes] = currentBook.chapters[i].duration.split(':');
        chapterStartTime += parseInt(hours) * 60 + parseInt(minutes);
      }
      setCurrentTime(chapterStartTime);
    }
  }, [currentBook]);
  
  const minimize = useCallback(() => {
    setIsMinimized(true);
  }, []);
  
  const maximize = useCallback(() => {
    setIsMinimized(false);
  }, []);
  
  const closePlayer = useCallback(() => {
    setCurrentBook(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setIsMinimized(true);
  }, []);
  
  const formatTime = useCallback((minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes % 1) * 60);
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);
  
  const value = {
    currentBook,
    isPlaying,
    currentTime,
    duration,
    currentChapter,
    playbackSpeed,
    volume,
    sleepTimer,
    bookmarks,
    isMinimized,
    loadBook,
    play,
    pause,
    togglePlay,
    seek,
    skipForward,
    skipBackward,
    changeSpeed,
    changeVolume,
    setSleepTimerMinutes,
    addBookmark,
    removeBookmark,
    goToChapter,
    minimize,
    maximize,
    closePlayer,
    formatTime,
  };
  
  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

PlayerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
