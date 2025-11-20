/**
 * usePlayer Hook - Access Audio Player Context
 *
 * Custom hook that provides access to the PlayerContext. Must be used within
 * a component that is a descendant of PlayerProvider.
 *
 * Returns all player state and control functions:
 * - State: currentBook, isPlaying, currentTime, duration, etc.
 * - Controls: togglePlay, seek, skipForward, changeSpeed, etc.
 * - Utilities: formatTime, addBookmark, goToChapter, etc.
 *
 * @throws {Error} If used outside of PlayerProvider
 * @returns {Object} Player context with state and methods
 */

import { useContext } from 'react';
import { PlayerContext } from './PlayerContextObject';

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
