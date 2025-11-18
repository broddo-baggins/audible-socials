import React from 'react';
import { Card, Button } from '../components/ui';
import { Smartphone, Download, Star, Shield, Zap, Headphones, Cloud, Settings, CheckCircle } from 'lucide-react';

const IOSApp = () => {
  const features = [
    {
      title: 'Seamless Audio Experience',
      description: 'Crystal-clear audio playback with advanced equalization settings',
      icon: Headphones,
      details: [
        'High-quality audio streaming and downloads',
        'Customizable playback speed (0.5x to 3.0x)',
        'Background playback while using other apps',
        'Sleep timer and smart pause features'
      ]
    },
    {
      title: 'Offline Listening',
      description: 'Download your favorite titles for listening anywhere, anytime',
      icon: Cloud,
      details: [
        'Unlimited downloads with your subscription',
        'Smart download management',
        'Automatic sync across devices',
        'Background download support'
      ]
    },
    {
      title: 'Personalized Recommendations',
      description: 'Discover new titles tailored to your listening preferences',
      icon: Star,
      details: [
        'AI-powered content suggestions',
        'Based on your listening history',
        'Curated playlists and collections',
        'Trending titles and new releases'
      ]
    },
    {
      title: 'Advanced Playback Controls',
      description: 'Complete control over your listening experience',
      icon: Settings,
      details: [
        'Chapter navigation and bookmarks',
        'Variable speed playback',
        'Skip silence and boost quiet sections',
        'Customizable skip intervals'
      ]
    }
  ];

  const systemRequirements = [
    { requirement: 'iOS Version', value: '13.0 or later' },
    { requirement: 'Device', value: 'iPhone, iPad, iPod touch' },
    { requirement: 'Storage', value: '200 MB free space' },
    { requirement: 'Internet', value: 'Wi-Fi or cellular data' }
  ];

  const appStoreInfo = {
    rating: 4.8,
    reviews: '2.1M+',
    size: '156 MB',
    age: '4+',
    languages: '40+',
    developer: 'Audible, Inc.',
    lastUpdate: 'January 15, 2025'
  };

  const privacyFeatures = [
    'No tracking of personal listening habits',
    'Secure payment processing',
    'Data encryption in transit and at rest',
    'Privacy controls for social features',
    'Opt-out of personalized recommendations'
  ];

  return (
    <div className="min-h-screen bg-audible-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-black mb-6 mx-auto">
            <Smartphone className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-audible-text-primary mb-4">
            Audible for iOS
          </h1>
          <p className="text-xl text-audible-text-secondary max-w-3xl mx-auto leading-relaxed mb-8">
            Experience the world's largest audio entertainment library on your iPhone and iPad.
            Download for free and start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-black hover:bg-gray-800 text-white" leftIcon={<Download className="w-5 h-5" />}>
              Download on the App Store
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>

        {/* App Store Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <Card padding="lg" className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="text-2xl font-bold text-audible-text-primary ml-1">
                {appStoreInfo.rating}
              </span>
            </div>
            <div className="text-sm text-audible-text-secondary">App Store Rating</div>
          </Card>
          <Card padding="lg" className="text-center">
            <div className="text-2xl font-bold text-audible-text-primary mb-2">
              {appStoreInfo.reviews}
            </div>
            <div className="text-sm text-audible-text-secondary">Reviews</div>
          </Card>
          <Card padding="lg" className="text-center">
            <div className="text-2xl font-bold text-audible-text-primary mb-2">
              {appStoreInfo.size}
            </div>
            <div className="text-sm text-audible-text-secondary">App Size</div>
          </Card>
          <Card padding="lg" className="text-center">
            <div className="text-2xl font-bold text-audible-text-primary mb-2">
              {appStoreInfo.age}
            </div>
            <div className="text-sm text-audible-text-secondary">Age Rating</div>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-audible-text-primary mb-4">
              Powerful Features for iOS
            </h2>
            <p className="text-lg text-audible-text-secondary">
              Designed specifically for iPhone and iPad users
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} padding="lg" className="hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-audible-orange/10 rounded-full flex items-center justify-center">
                        <Icon className="w-6 h-6 text-audible-orange" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-audible-text-primary mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-audible-text-secondary mb-4">
                        {feature.description}
                      </p>
                      <ul className="space-y-2">
                        {feature.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-audible-text-secondary">
                              {detail}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* System Requirements */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-audible-text-primary mb-6">
                System Requirements
              </h2>
              <div className="space-y-4">
                {systemRequirements.map((req, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-audible-gray-200">
                    <span className="font-medium text-audible-text-primary">
                      {req.requirement}
                    </span>
                    <span className="text-audible-text-secondary">
                      {req.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Card padding="lg" className="bg-gradient-to-br from-audible-orange to-audible-orange/80 text-white">
                <div className="text-center">
                  <Zap className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">
                    Optimized Performance
                  </h3>
                  <p className="opacity-90">
                    Our iOS app is optimized for the latest iPhone and iPad models,
                    delivering smooth performance and battery-efficient playback.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="mb-16">
          <Card padding="xl" className="bg-audible-gray-50">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-audible-orange/10 mb-4 mx-auto">
                <Shield className="w-8 h-8 text-audible-orange" />
              </div>
              <h2 className="text-3xl font-bold text-audible-text-primary mb-4">
                Privacy & Security
              </h2>
              <p className="text-lg text-audible-text-secondary max-w-3xl mx-auto">
                Your privacy and security are our top priorities. Learn how we protect your data on iOS.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {privacyFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-audible-text-secondary">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button variant="outline">
                View Full Privacy Policy
              </Button>
            </div>
          </Card>
        </div>

        {/* App Store Information */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-audible-text-primary mb-8 text-center">
            App Store Details
          </h2>
          <Card padding="lg">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-audible-text-primary mb-4">
                  App Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-audible-text-secondary">Developer</span>
                    <span className="font-medium text-audible-text-primary">{appStoreInfo.developer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-audible-text-secondary">Size</span>
                    <span className="font-medium text-audible-text-primary">{appStoreInfo.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-audible-text-secondary">Age Rating</span>
                    <span className="font-medium text-audible-text-primary">{appStoreInfo.age}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-audible-text-secondary">Languages</span>
                    <span className="font-medium text-audible-text-primary">{appStoreInfo.languages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-audible-text-secondary">Last Update</span>
                    <span className="font-medium text-audible-text-primary">{appStoreInfo.lastUpdate}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-audible-text-primary mb-4">
                  What's New
                </h3>
                <div className="space-y-3 text-sm text-audible-text-secondary">
                  <div>
                    <div className="font-medium text-audible-text-primary mb-1">Version 3.2.1</div>
                    <ul className="space-y-1">
                      <li>• Improved offline download speeds</li>
                      <li>• New social sharing features</li>
                      <li>• Enhanced accessibility options</li>
                      <li>• Bug fixes and performance improvements</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Download CTA */}
        <div className="text-center">
          <Card padding="xl" className="bg-gradient-to-r from-audible-orange to-audible-orange/80 text-white">
            <Smartphone className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Listening?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Download Audible for iOS and get your first audiobook free with a 30-day trial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white" leftIcon={<Download className="w-5 h-5" />}>
                Download on the App Store
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-audible-orange">
                View System Requirements
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IOSApp;
