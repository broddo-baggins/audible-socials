import { Calendar, Clock, Users, TrendingUp } from 'lucide-react';

export default function MeetingsSummary({ club, showDetailed = false }) {
  if (!club) return null;

  const nextEvent = club.events?.[0];
  const upcomingEvents = club.events || [];
  const nextEventDate = nextEvent ? new Date(nextEvent.date) : null;
  const daysUntilNext = nextEventDate ? Math.ceil((nextEventDate - new Date()) / (1000 * 60 * 60 * 24)) : null;

  if (showDetailed) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-blue-900 flex items-center">
            <Calendar className="w-6 h-6 mr-2" />
            Meeting Schedule
          </h3>
          <div className="bg-blue-100 px-3 py-1 rounded-full">
            <span className="text-sm font-bold text-blue-700">
              {club.meetingsPerMonth} meetings/month
            </span>
          </div>
        </div>

        {/* Next Meeting */}
        {nextEvent && (
          <div className="bg-white rounded-lg p-4 mb-4 border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 mb-1">Next Meeting</h4>
                <p className="text-gray-800 font-semibold mb-2">{nextEvent.title}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {nextEventDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </span>
                  {daysUntilNext !== null && (
                    <span className={`font-semibold ${daysUntilNext <= 7 ? 'text-orange-600' : 'text-gray-600'}`}>
                      {daysUntilNext === 0 ? 'Today!' : `${daysUntilNext} days away`}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700">{nextEvent.description}</p>
                {nextEvent.rsvpCount && (
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{nextEvent.rsvpCount.toLocaleString()} attending</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Meeting Frequency & Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-gray-900">Frequency</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{club.meetingsPerMonth}</p>
            <p className="text-xs text-gray-600">meetings per month</p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-gray-900">Upcoming</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{upcomingEvents.length}</p>
            <p className="text-xs text-gray-600">scheduled events</p>
          </div>
        </div>

        {/* Upcoming Events List */}
        {upcomingEvents.length > 1 && (
          <div className="mt-4">
            <h5 className="text-sm font-semibold text-gray-900 mb-3">More Upcoming Events</h5>
            <div className="space-y-2">
              {upcomingEvents.slice(1, 4).map((event, index) => (
                <div key={event.id} className="flex items-center space-x-3 bg-white rounded-lg p-3 border border-gray-200">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-blue-600">{index + 2}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{event.title}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Compact version for cards
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-blue-900 flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          Meetings
        </p>
        <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
          {club.meetingsPerMonth} per month
        </span>
      </div>
      {nextEvent && (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-blue-800">Next: {nextEvent.title}</p>
          <p className="text-xs text-blue-700">
            {nextEventDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}
          </p>
        </div>
      )}
      {upcomingEvents.length > 0 && (
        <p className="text-xs text-blue-800 mt-1">
          {upcomingEvents.length} upcoming event{upcomingEvents.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
