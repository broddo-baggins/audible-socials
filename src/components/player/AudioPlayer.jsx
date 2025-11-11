import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Award } from 'lucide-react';
import { getUserData, getJoinedClubs } from '../../utils/localStorage';
import clubsData from '../../data/clubs.json';
import booksData from '../../data/books.json';

export default function AudioPlayer({ bookId, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [book, setBook] = useState(null);
  const [clubMilestones, setClubMilestones] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    const foundBook = booksData.find(b => b.id === bookId);
    setBook(foundBook);

    // Check if this book is part of any joined clubs
    const userData = getUserData();
    const joinedClubIds = getJoinedClubs();
    const relatedClubs = clubsData.filter(club => 
      joinedClubIds.includes(club.id) && 
      foundBook?.clubs?.includes(club.id)
    );

    // Set up milestones (at 25%, 50%, 75%, 100%)
    if (relatedClubs.length > 0) {
      setClubMilestones([
        { percent: 25, reached: false, label: '25% Milestone', club: relatedClubs[0] },
        { percent: 50, reached: false, label: 'Halfway There!', club: relatedClubs[0] },
        { percent: 75, reached: false, label: '75% Complete', club: relatedClubs[0] },
        { percent: 100, reached: false, label: 'Finished!', club: relatedClubs[0] }
      ]);
    }

    // Simulate audio duration (in seconds)
    setDuration(600); // 10 minutes demo
  }, [bookId]);

  useEffect(() => {
    // Update milestones based on progress
    setClubMilestones(prev => 
      prev.map(milestone => ({
        ...milestone,
        reached: (progress / duration) * 100 >= milestone.percent
      }))
    );
  }, [progress, duration]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would control actual audio
  };

  const handleSkipBack = () => {
    setProgress(Math.max(0, progress - 15));
  };

  const handleSkipForward = () => {
    setProgress(Math.min(duration, progress + 15));
  };

  const handleProgressChange = (e) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
    if (parseFloat(e.target.value) === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Simulate progress when playing
    let interval;
    if (isPlaying && progress < duration) {
      interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 1, duration));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress, duration]);

  if (!book) return null;

  const progressPercent = (progress / duration) * 100;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-audible-navy to-audible-navy-light text-white shadow-2xl z-50">
      {/* Club Milestones Indicator */}
      {clubMilestones.length > 0 && (
        <div className="bg-purple-600/30 px-4 py-2 border-b border-purple-500/30">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-audible-gold" />
              <span className="text-xs font-semibold">Book Club Progress</span>
            </div>
            <div className="flex items-center space-x-3">
              {clubMilestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-1 ${
                    milestone.reached ? 'text-audible-gold' : 'text-white/50'
                  }`}
                >
                  <Award className={`w-3 h-3 ${milestone.reached ? 'fill-audible-gold' : ''}`} />
                  <span className="text-xs">{milestone.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Main Player */}
        <div className="flex items-center space-x-4">
          {/* Book Info */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-12 h-12 bg-gray-700 rounded flex-shrink-0"></div>
            <div className="min-w-0">
              <h4 className="font-semibold text-sm truncate">{book.title}</h4>
              <p className="text-xs text-white/70 truncate">{book.author}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center space-x-6 mb-2">
              <button
                onClick={handleSkipBack}
                className="hover:text-audible-orange transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              
              <button
                onClick={togglePlayPause}
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-audible-orange" />
                ) : (
                  <Play className="w-6 h-6 text-audible-orange ml-1" />
                )}
              </button>
              
              <button
                onClick={handleSkipForward}
                className="hover:text-audible-orange transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-2xl flex items-center space-x-2">
              <span className="text-xs text-white/70">{formatTime(progress)}</span>
              <div className="flex-1 relative">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={progress}
                  onChange={handleProgressChange}
                  className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                  style={{
                    background: `linear-gradient(to right, #F86800 0%, #F86800 ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%, rgba(255,255,255,0.2) 100%)`
                  }}
                />
                {/* Milestone markers */}
                {clubMilestones.map((milestone, index) => (
                  <div
                    key={index}
                    className="absolute top-0 transform -translate-x-1/2"
                    style={{ left: `${milestone.percent}%` }}
                  >
                    <Award
                      className={`w-3 h-3 ${
                        milestone.reached 
                          ? 'text-audible-gold fill-audible-gold' 
                          : 'text-white/30'
                      }`}
                    />
                  </div>
                ))}
              </div>
              <span className="text-xs text-white/70">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2 flex-1 justify-end">
            <button onClick={toggleMute} className="hover:text-audible-orange transition-colors">
              {isMuted || volume === 0 ? (
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
              onChange={handleVolumeChange}
              className="w-24 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

