/**
 * PlayerContext Provider - Audio Player State Management
 *
 * Provides comprehensive state management for the audio player functionality.
 * Handles playback controls, progress tracking, bookmarks, sleep timers, and
 * persistent state storage in localStorage.
 *
 * Key Features:
 * - Audio playback state (playing, paused, time, duration)
 * - Chapter navigation and tracking
 * - Playback speed and volume controls
 * - Sleep timer functionality
 * - Bookmark system for audio positions
 * - Persistent state across browser sessions
 * - Minimized/maximized player states
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { PlayerContext } from './PlayerContextObject';

export const PlayerProvider = ({ children }) => {
  // Core playback state
  const [currentBook, setCurrentBook] = useState(null);    // Currently loaded book
  const [isPlaying, setIsPlaying] = useState(false);       // Playback status
  const [currentTime, setCurrentTime] = useState(0);       // Current playback position (seconds)
  const [duration, setDuration] = useState(0);             // Total book duration (seconds)
  const [currentChapter, setCurrentChapter] = useState(0); // Current chapter index

  // Playback controls
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0); // Playback speed multiplier
  const [volume, setVolume] = useState(1.0);               // Volume level (0-1)

  // Additional features
  const [sleepTimer, setSleepTimer] = useState(null);      // Sleep timer end time
  const [bookmarks, setBookmarks] = useState([]);          // User bookmarks
  const [isMinimized, setIsMinimized] = useState(true);    // Player UI state

  // Audio playback state
  const [isLoading, setIsLoading] = useState(false);       // Loading audio state
  const [audioError, setAudioError] = useState(null);      // Audio loading errors
  const [audioSrc, setAudioSrc] = useState(null);          // Current audio source
  const [youtubeResults, setYoutubeResults] = useState([]); // YouTube search results
  const [usingYoutube, setUsingYoutube] = useState(false); // Whether using YouTube embed

  // Refs for managing audio and timers
  const audioRef = useRef(null);                           // HTML5 audio element
  const sleepTimerRef = useRef(null);                      // Timeout for sleep timer
  
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
  
  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = playbackSpeed;

      // Handle audio events
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current.duration);
        setIsLoading(false);
        setAudioError(null);
      });

      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current.currentTime);
      });

      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
      });

      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        setAudioError('Failed to load audio');
        setIsLoading(false);
        setIsPlaying(false);
      });

      audioRef.current.addEventListener('loadstart', () => {
        setIsLoading(true);
        setAudioError(null);
      });

      audioRef.current.addEventListener('canplay', () => {
        setIsLoading(false);
      });
    }
  }, []);

  // Handle playback state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error('Playback failed:', e);
          setAudioError('Playback failed');
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle playback speed changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);
  
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
    setCurrentChapter(0);
    setIsMinimized(false);

    // Try to load sample audio
    const sampleUrl = book.sampleAudioUrl;
    if (sampleUrl && audioRef.current) {
      setAudioSrc(sampleUrl);
      audioRef.current.src = sampleUrl;
      audioRef.current.currentTime = book.progress || 0;
      setIsLoading(true);
    } else {
      // Fallback to simulation for books without audio
      setDuration(book.durationMinutes * 60 || 3600); // Convert to seconds, default 1 hour
      setCurrentTime(book.progress || 0);
      setAudioSrc(null);
      setAudioError('No audio sample available');
    }
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
    const safeTime = Math.max(0, Math.min(time, duration));
    setCurrentTime(safeTime);
    if (audioRef.current && !usingYoutube) {
      audioRef.current.currentTime = safeTime;
    }
  }, [duration, usingYoutube]);

  const skipForward = useCallback((seconds = 30) => {
    const newTime = Math.min(currentTime + seconds, duration);
    setCurrentTime(newTime);
    if (audioRef.current && !usingYoutube) {
      audioRef.current.currentTime = newTime;
    }
  }, [currentTime, duration, usingYoutube]);

  const skipBackward = useCallback((seconds = 30) => {
    const newTime = Math.max(currentTime - seconds, 0);
    setCurrentTime(newTime);
    if (audioRef.current && !usingYoutube) {
      audioRef.current.currentTime = newTime;
    }
  }, [currentTime, usingYoutube]);
  
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
    setAudioSrc(null);
    setUsingYoutube(false);
    setYoutubeResults([]);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  }, []);

  // Search for YouTube audiobook previews
  const searchYouTube = useCallback(async (book) => {
    if (!book) return;

    const query = `${book.title} ${book.author} audiobook preview sample`;
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

    // Open YouTube search in new tab
    window.open(searchUrl, '_blank');

    // Also set some mock results for UI demonstration
    setYoutubeResults([
      {
        id: 'sample1',
        title: `${book.title} - Audiobook Preview`,
        thumbnail: 'https://img.youtube.com/vi/sample1/0.jpg',
        url: searchUrl
      }
    ]);
  }, []);

  // Load YouTube embed (if we get an embed URL)
  const loadYouTubeEmbed = useCallback((embedUrl) => {
    setUsingYoutube(true);
    setAudioSrc(embedUrl);
    // In a real implementation, you'd set up YouTube Player API here
    // For now, we'll just simulate
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
    isLoading,
    audioError,
    audioSrc,
    youtubeResults,
    usingYoutube,
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
    searchYouTube,
    loadYouTubeEmbed,
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

