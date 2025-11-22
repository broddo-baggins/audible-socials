import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, Check, X, Video, Plus, Edit } from 'lucide-react';
import { Card } from '../ui';
import { getClubEvents, createClubEvent, rsvpClubEvent, getUserData } from '../../utils/localStorage';

export default function PrivateClubMeetups({ club, currentUser, onRSVP }) {
  const [events, setEvents] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMeetup, setNewMeetup] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    isOnline: true,
    meetingLink: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEvents();
  }, [club.id]);

  const loadEvents = () => {
    // First try to load from localStorage
    const storedEvents = getClubEvents(club.id);
    if (storedEvents.length > 0) {
      setEvents(storedEvents);
    } else {
      // Fallback to club data
      setEvents(club.events || []);
    }
  };

  const handleCreateMeetup = async () => {
    if (!newMeetup.title.trim() || !newMeetup.date || !newMeetup.time) return;

    setLoading(true);
    const userData = getUserData();

    const result = createClubEvent(club.id, {
      title: newMeetup.title,
      date: `${newMeetup.date}T${newMeetup.time}:00`,
      type: 'meetup',
      description: newMeetup.description,
      isOnline: newMeetup.isOnline,
      meetingLink: newMeetup.isOnline ? newMeetup.meetingLink : null,
      host: userData.id,
      rsvpCount: 1,
      maxCapacity: club.members.length,
      attendees: [userData.id]
    });

    if (result.success) {
      setEvents(prev => [...prev, result.event]);
      setNewMeetup({
        title: '',
        date: '',
        time: '',
        description: '',
        isOnline: true,
        meetingLink: ''
      });
      setShowCreateModal(false);
    }
    setLoading(false);
  };

  const handleRSVP = async (eventId, attending) => {
    setLoading(true);
    const userData = getUserData();

    const result = rsvpClubEvent(club.id, eventId, userData.id, attending);
    if (result.success) {
      setEvents(prev => prev.map(event =>
        event.id === eventId ? result.event : event
      ));
      if (onRSVP) {
        onRSVP(eventId, attending);
      }
    }
    setLoading(false);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const isUpcoming = (dateString) => {
    return new Date(dateString) > new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Club Meetups</h3>
          <p className="text-sm text-gray-600 mt-1">
            Schedule online discussions and plan in-person meetups
          </p>
        </div>
        {currentUser.id === club.host && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Meetup</span>
          </button>
        )}
      </div>

      {/* Create Meetup Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Schedule Meetup</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newMeetup.title}
                  onChange={(e) => setNewMeetup(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Monthly Book Discussion"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newMeetup.date}
                    onChange={(e) => setNewMeetup(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newMeetup.time}
                    onChange={(e) => setNewMeetup(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newMeetup.description}
                  onChange={(e) => setNewMeetup(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What will you discuss?"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="online"
                    name="meetingType"
                    checked={newMeetup.isOnline}
                    onChange={() => setNewMeetup(prev => ({ ...prev, isOnline: true }))}
                    className="text-purple-600 focus:ring-purple-600"
                  />
                  <label htmlFor="online" className="text-sm font-medium text-gray-700">
                    Online (Zoom, Google Meet, etc.)
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="inperson"
                    name="meetingType"
                    checked={!newMeetup.isOnline}
                    onChange={() => setNewMeetup(prev => ({ ...prev, isOnline: false }))}
                    className="text-purple-600 focus:ring-purple-600"
                  />
                  <label htmlFor="inperson" className="text-sm font-medium text-gray-700">
                    In-person meetup
                  </label>
                </div>

                {newMeetup.isOnline && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meeting Link
                    </label>
                    <input
                      type="url"
                      value={newMeetup.meetingLink}
                      onChange={(e) => setNewMeetup(prev => ({ ...prev, meetingLink: e.target.value }))}
                      placeholder="https://zoom.us/..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateMeetup}
                  disabled={!newMeetup.title.trim() || !newMeetup.date || !newMeetup.time || loading}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Scheduling...' : 'Schedule Meetup'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <Card className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No meetups scheduled</h3>
            <p className="text-gray-600 mb-4">
              {currentUser.id === club.host
                ? "Schedule your first meetup to bring your club together!"
                : "Check back later for upcoming meetups."
              }
            </p>
            {currentUser.id === club.host && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Schedule First Meetup
              </button>
            )}
          </Card>
        ) : (
          events.map(event => {
            const { date, time } = formatDateTime(event.date);
            const isAttending = event.attendees?.includes(currentUser.id);
            const upcoming = isUpcoming(event.date);

            return (
              <Card key={event.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {event.title}
                      </h4>
                      {event.isOnline && (
                        <div className="flex items-center space-x-1 text-blue-600">
                          <Video className="w-4 h-4" />
                          <span className="text-xs font-medium">Online</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{event.rsvpCount || 0} attending</span>
                      </div>
                    </div>

                    {event.description && (
                      <p className="text-gray-700 mb-3">{event.description}</p>
                    )}

                    {event.isOnline && event.meetingLink && upcoming && (
                      <div className="mb-3">
                        <a
                          href={event.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          <Video className="w-4 h-4" />
                          <span>Join Meeting</span>
                        </a>
                      </div>
                    )}

                    {upcoming && (
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleRSVP(event.id, !isAttending)}
                          disabled={loading}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                            isAttending
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-purple-600 hover:bg-purple-700 text-white'
                          }`}
                        >
                          {isAttending ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Attending</span>
                            </>
                          ) : (
                            <>
                              <Calendar className="w-4 h-4" />
                              <span>RSVP</span>
                            </>
                          )}
                        </button>

                        {isAttending && (
                          <span className="text-sm text-green-600 font-medium">
                            ✓ You're attending
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {!upcoming && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>This meetup has already passed</span>
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Meetup Tips */}
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h4 className="font-medium text-green-900 mb-1">Meetup Tips</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Schedule 1-2 weeks after finishing a book</li>
              <li>• Keep discussions to 60-90 minutes</li>
              <li>• Prepare discussion questions in advance</li>
              <li>• Use spoiler warnings for plot discussions</li>
              <li>• Record sessions for absent members</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
