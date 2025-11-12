import { User, CreditCard, Settings, Bell, Globe, Shield, HelpCircle, BookOpen, TrendingUp, Award } from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import ListeningStats from '../components/stats/ListeningStats';
import BadgeDisplay from '../components/badges/BadgeDisplay';

const Account = () => {
  // Mock user data - replace with actual user context
  const user = {
    name: 'Alex Morgan',
    email: 'alex@example.com',
    avatar: null,
    memberSince: '2023-01-15',
    plan: 'Premium',
    credits: 2,
    creditsUsed: 10,
    renewalDate: '2025-12-12',
    hoursListened: 147,
    booksFinished: 23,
    currentStreak: 12,
    favoriteGenres: [
      { name: 'Science Fiction', count: 8 },
      { name: 'Fantasy', count: 6 },
      { name: 'Mystery', count: 5 },
      { name: 'Self Development', count: 4 },
    ],
    badges: ['completionist', 'speed_reader', 'genre_explorer', 'veteran_listener'],
  };
  
  // Listening stats for the component
  const listeningStats = {
    hoursListened: user.hoursListened,
    booksFinished: user.booksFinished,
    currentStreak: user.currentStreak,
    longestStreak: 45,
    favoriteGenre: 'Science Fiction',
    averageRating: 4.3,
    thisMonthHours: 18,
    thisYearBooks: 23,
  };
  
  const settingsSections = [
    {
      title: 'Playback',
      icon: BookOpen,
      items: [
        { label: 'Default playback speed', value: '1.0x' },
        { label: 'Auto-skip silence', value: 'On' },
        { label: 'Remember position', value: 'On' },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'New releases', value: 'On' },
        { label: 'Club updates', value: 'On' },
        { label: 'Friend activity', value: 'Off' },
      ],
    },
    {
      title: 'Privacy',
      icon: Shield,
      items: [
        { label: 'Show listening activity', value: 'Friends only' },
        { label: 'Allow friend requests', value: 'On' },
        { label: 'Profile visibility', value: 'Public' },
      ],
    },
    {
      title: 'Language & Region',
      icon: Globe,
      items: [
        { label: 'Language', value: 'English' },
        { label: 'Region', value: 'United States' },
      ],
    },
  ];
  
  return (
    <div className="min-h-screen bg-echo-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-echo-text-primary mb-8">
          Account
        </h1>
        
        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card padding="lg">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full bg-echo-orange flex items-center justify-center text-white text-3xl font-bold">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-echo-text-primary mb-1">
                    {user.name}
                  </h2>
                  <p className="text-echo-text-secondary mb-4">{user.email}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="primary">
                      {user.plan} Member
                    </Badge>
                    <Badge variant="outline">
                      Member since {new Date(user.memberSince).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                    </Badge>
                  </div>
                  <Button variant="outline" leftIcon={<Settings className="w-4 h-4" />}>
                    Edit Profile
                  </Button>
                </div>
              </div>
            </Card>
            
            {/* Listening Statistics */}
            <Card padding="lg">
              <h2 className="text-xl font-bold text-echo-text-primary mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Listening Statistics
              </h2>
              <ListeningStats stats={listeningStats} />
            </Card>
            
            {/* Achievements */}
            <Card padding="lg">
              <h2 className="text-xl font-bold text-echo-text-primary mb-6 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Achievements & Badges
              </h2>
              <BadgeDisplay earnedBadges={user.badges} />
            </Card>
            
            {/* Settings Sections */}
            {settingsSections.map((section) => (
              <Card key={section.title} padding="lg">
                <h2 className="text-xl font-bold text-echo-text-primary mb-4 flex items-center gap-2">
                  <section.icon className="w-5 h-5" />
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {section.items.map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2">
                      <span className="text-echo-text-secondary">{item.label}</span>
                      <span className="text-echo-text-primary font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
            
            {/* Help & Support */}
            <Card padding="lg">
              <h2 className="text-xl font-bold text-echo-text-primary mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Help & Support
              </h2>
              <div className="space-y-3">
                <Button variant="ghost" fullWidth className="justify-start">
                  FAQ
                </Button>
                <Button variant="ghost" fullWidth className="justify-start">
                  Contact Support
                </Button>
                <Button variant="ghost" fullWidth className="justify-start">
                  Terms of Service
                </Button>
                <Button variant="ghost" fullWidth className="justify-start">
                  Privacy Policy
                </Button>
              </div>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Membership Card */}
            <Card padding="lg" variant="elevated">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-echo-orange/10 mb-4">
                  <CreditCard className="w-8 h-8 text-echo-orange" />
                </div>
                <h3 className="text-xl font-bold text-echo-text-primary mb-2">
                  {user.plan} Membership
                </h3>
                <p className="text-echo-text-secondary text-sm">
                  Renews on {new Date(user.renewalDate).toLocaleDateString()}
                </p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between py-3 border-b border-echo-divider">
                  <span className="text-echo-text-secondary">Available Credits</span>
                  <span className="text-2xl font-bold text-echo-orange">{user.credits}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-echo-divider">
                  <span className="text-echo-text-secondary">Credits Used</span>
                  <span className="font-semibold text-echo-text-primary">{user.creditsUsed}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button fullWidth variant="primary">
                  Upgrade Plan
                </Button>
                <Button fullWidth variant="outline">
                  Manage Subscription
                </Button>
              </div>
            </Card>
            
            {/* Quick Stats */}
            <Card padding="lg">
              <h3 className="font-bold text-echo-text-primary mb-4">
                This Month
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-echo-text-secondary">Hours Listened</span>
                    <span className="font-bold text-echo-orange">{user.hoursListened}h</span>
                  </div>
                  <div className="h-2 bg-echo-beige rounded-full overflow-hidden">
                    <div className="h-full bg-echo-orange" style={{ width: '75%' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-echo-text-secondary">Books Finished</span>
                    <span className="font-bold text-echo-orange">{user.booksFinished}</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-echo-text-secondary">Current Streak</span>
                    <span className="font-bold text-echo-orange">{user.currentStreak} days</span>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Favorite Genres */}
            <Card padding="lg">
              <h3 className="font-bold text-echo-text-primary mb-4">
                Favorite Genres
              </h3>
              <div className="space-y-3">
                {user.favoriteGenres.map((genre, index) => (
                  <div key={genre.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-echo-text-secondary">{genre.name}</span>
                      <span className="text-sm font-medium text-echo-text-primary">{genre.count} books</span>
                    </div>
                    <div className="h-2 bg-echo-beige rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-echo-orange"
                        style={{ width: `${(genre.count / user.booksFinished) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
