import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Check, Bell } from 'lucide-react';
import { getUserData, saveUserData } from '../../utils/localStorage';

export default function EventRSVP({ event, clubId }) {
  const [hasRSVP, setHasRSVP] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = getUserData();
    setHasRSVP(user.rsvpEvents?.includes(event.id) || false);
  }, [event.id]);

  const handleRSVP = () => {
    setLoading(true);
    const user = getUserData();
    
    if (!user.rsvpEvents) {
      user.rsvpEvents = [];
    }

    if (hasRSVP) {
      user.rsvpEvents = user.rsvpEvents.filter(id => id !== event.id);
      setHasRSVP(false);
    } else {
      user.rsvpEvents.push(event.id);
      setHasRSVP(true);
    }

    saveUserData(user);
    setTimeout(() => setLoading(false), 300);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getEventTypeLabel = (type) => {
    const labels = {
      'celebrity_chat': 'Celebrity Chat',
      'author_chat': 'Author Interview',
      'discussion': 'Group Discussion',
      'workshop': 'Workshop'
    };
    return labels[type] || type;
  };

  const capacityPercentage = (event.rsvpCount / event.maxCapacity) * 100;
  const spotsLeft = event.maxCapacity - event.rsvpCount;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-purple-300 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-1 rounded">
              {getEventTypeLabel(event.type)}
            </span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">{event.title}</h4>
          <p className="text-sm text-gray-600 mb-3">{event.description}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{event.rsvpCount.toLocaleString()} attending</span>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Event capacity</span>
              <span>{spotsLeft.toLocaleString()} spots left</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  capacityPercentage > 80 ? 'bg-red-500' : 
                  capacityPercentage > 60 ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`}
                style={{ width: `${capacityPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleRSVP}
        disabled={loading}
        className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
          hasRSVP
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-purple-600 text-white hover:bg-purple-700'
        }`}
      >
        {hasRSVP ? (
          <>
            <Check className="w-4 h-4" />
            <span>RSVP'd - Reminder Set</span>
          </>
        ) : (
          <>
            <Bell className="w-4 h-4" />
            <span>RSVP & Set Reminder</span>
          </>
        )}
      </button>

      {hasRSVP && (
        <p className="mt-2 text-xs text-green-600 text-center">
          You'll receive a notification 15 minutes before the event
        </p>
      )}
    </div>
  );
}

