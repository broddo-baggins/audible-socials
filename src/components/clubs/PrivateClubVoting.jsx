import { useState, useEffect } from 'react';
import { Vote, Users, Check, Trophy, BookOpen } from 'lucide-react';
import { Card } from '../ui';
import booksData from '../../data/books.json';
import { getClubVotes, castClubVote, getUserData } from '../../utils/localStorage';

export default function PrivateClubVoting({ club, currentUser, onVoteCast }) {
  const [bookVotes, setBookVotes] = useState({});
  const [votingBooks, setVotingBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadVotes();
  }, [club.id]);

  useEffect(() => {
    // Get books that are being voted on
    const books = Object.keys(bookVotes).map(bookId => {
      const book = booksData.find(b => b.id === bookId);
      return book ? {
        ...book,
        votes: bookVotes[bookId].length,
        hasMyVote: bookVotes[bookId].includes(currentUser.id)
      } : null;
    }).filter(Boolean);

    setVotingBooks(books);
  }, [bookVotes, currentUser.id]);

  const loadVotes = () => {
    // First try to load from localStorage
    const storedVotes = getClubVotes(club.id);
    if (Object.keys(storedVotes).length > 0) {
      setBookVotes(storedVotes);
    } else {
      // Fallback to club data
      setBookVotes(club.bookVotes || {});
    }
  };

  const handleVote = async (bookId) => {
    setLoading(true);
    const userData = getUserData();

    const result = castClubVote(club.id, bookId, userData.id);
    if (result.success) {
      setBookVotes(result.votes);
      if (onVoteCast) {
        onVoteCast(result.votes);
      }
    }
    setLoading(false);
  };

  const getWinner = () => {
    if (votingBooks.length === 0) return null;

    const winner = votingBooks.reduce((prev, current) =>
      prev.votes > current.votes ? prev : current
    );

    // Check if winner has majority (more than half the club members)
    const majorityThreshold = Math.ceil(club.members.length / 2);
    return winner.votes >= majorityThreshold ? winner : null;
  };

  const winner = getWinner();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Book Voting</h3>
          <p className="text-sm text-gray-600 mt-1">
            Vote on the next book your club will read together
          </p>
        </div>
        {winner && (
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
            <Trophy className="w-4 h-4" />
            <span>Winner Selected!</span>
          </div>
        )}
      </div>

      {/* Current Book */}
      {club.currentBook && (
        <Card className="p-4 bg-purple-50 border-purple-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-16 bg-purple-200 rounded flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-purple-900">Currently Reading</h4>
              <p className="text-sm text-purple-700">
                {booksData.find(b => b.id === club.currentBook)?.title || 'Unknown Book'}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Voting Books */}
      {votingBooks.length > 0 ? (
        <div className="space-y-4">
          {votingBooks.map(book => (
            <Card key={book.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-12 h-16 object-cover rounded shadow-sm"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{book.title}</h4>
                    <p className="text-sm text-gray-600">by {book.author}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Vote className="w-4 h-4" />
                        <span>{book.votes} votes</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{club.members.length} members</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleVote(book.id)}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                    book.hasMyVote
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {book.hasMyVote ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Voted</span>
                    </>
                  ) : (
                    <>
                      <Vote className="w-4 h-4" />
                      <span>Vote</span>
                    </>
                  )}
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <Vote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No books up for voting</h3>
          <p className="text-gray-600">
            Start a discussion to suggest books for your club to vote on!
          </p>
        </Card>
      )}

      {/* Winner Announcement */}
      {winner && (
        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-900 mb-2">Winner Selected!</h3>
            <p className="text-green-800 mb-4">
              Your club will read "{winner.title}" by {winner.author} next!
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-green-700">
              <div className="flex items-center space-x-1">
                <Vote className="w-4 h-4" />
                <span>{winner.votes} votes</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>of {club.members.length} members</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Voting Rules */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Vote className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Voting Rules</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• You can vote for multiple books</li>
              <li>• Change your vote anytime before the deadline</li>
              <li>• Book wins with majority vote (50% + 1)</li>
              <li>• Host can start voting period anytime</li>
              <li>• Voting continues until a book wins or deadline</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
