import React from 'react';
import { Card, Button } from '../components/ui';
import { Smartphone, Download, Star, Shield, Zap, Headphones, Cloud, Settings, CheckCircle } from 'lucide-react';

const AndroidApp = () => {
  const features = [
    {
      title: 'Universal Android Support',
      description: 'Works on phones, tablets, and Android TV devices',
      icon: Smartphone,
      details: [
        'Compatible with Android 7.0 and above',
        'Optimized for phones and tablets',
        'Android TV app for big screens',
        'Chrome OS support for Chromebooks'
      ]
    },
    {
      title: 'Smart Downloads',
      description: 'Intelligent download management for offline listening',
      icon: Cloud,
      details: [
        'Wi-Fi-only download options',
        'Automatic quality optimization',
        'Storage management tools',
        'Background download support'
      ]
    },
    {
      title: 'Google Assistant Integration',
      description: 'Control playback with voice commands',
      icon: Headphones,
      details: [
        'Play, pause, and skip with voice',
        'Ask for recommendations',
        'Control playback speed',
        'Search your library hands-free'
      ]
    },
    {
      title: 'Material Design Experience',
      description: 'Beautiful, intuitive interface following Android design principles',
      icon: Settings,
      details: [
        'Adaptive theming (light/dark mode)',
        'Gesture controls and navigation',
        'Customizable home screen widgets',
        'Consistent with Android ecosystem'
      ]
    }
  ];

  const systemRequirements = [
    { requirement: 'Android Version', value: '7.0 or later' },
    { requirement: 'Device', value: 'Phone, tablet, or Android TV' },
    { requirement: 'Storage', value: '200 MB free space' },
    { requirement: 'RAM', value: '2 GB minimum' },
    { requirement: 'Google Play Services', value: 'Required' }
  ];

  const playStoreInfo = {
    rating: 4.7,
    reviews: '1.8M+',
    size: '142 MB',
    installs: '100M+',
    age: 'Mature',
    languages: '40+',
    developer: 'Audible, Inc.',
    lastUpdate: 'January 15, 2025'
  };

  const androidFeatures = [
    'Google Play Protect certified',
    'End-to-end encrypted data transmission',
    'Secure payment processing',
    'Privacy controls for all Android versions',
    'Battery optimization for extended listening',
    'Works with Android Auto for car playback'
  ];

  return (
    <div className="min-h-screen bg-audible-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-green-600 mb-6 mx-auto">
                  <Smartphone className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-audible-text-primary mb-4">
            Audible for Android
          </h1>
          <p className="text-xl text-audible-text-secondary max-w-3xl mx-auto leading-relaxed mb-8">
            Experience the full power of Audible on your Android device. Download from Google Play
            and enjoy seamless integration with the Android ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" leftIcon={<Download className="w-5 h-5" />}>
              Get it on Google Play
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>

        {/* Play Store Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <Card padding="lg" className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="text-2xl font-bold text-audible-text-primary ml-1">
                {playStoreInfo.rating}
              </span>
            </div>
            <div className="text-sm text-audible-text-secondary">Play Store Rating</div>
          </Card>
          <Card padding="lg" className="text-center">
            <div className="text-2xl font-bold text-audible-text-primary mb-2">
              {playStoreInfo.reviews}
            </div>
            <div className="text-sm text-audible-text-secondary">Reviews</div>
          </Card>
          <Card padding="lg" className="text-center">
            <div className="text-2xl font-bold text-audible-orange mb-2">
              {playStoreInfo.installs}
            </div>
            <div className="text-sm text-audible-text-secondary">Installs</div>
          </Card>
          <Card padding="lg" className="text-center">
            <div className="text-2xl font-bold text-audible-text-primary mb-2">
              {playStoreInfo.age}
            </div>
            <div className="text-sm text-audible-text-secondary">Content Rating</div>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-audible-text-primary mb-4">
              Built for Android
            </h2>
            <p className="text-lg text-audible-text-secondary">
              Native Android features and seamless ecosystem integration
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
              <Card padding="lg" className="bg-gradient-to-br from-green-600 to-green-700 text-white">
                <div className="text-center">
                  <Smartphone className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">
                    Android Optimized
                  </h3>
                  <p className="opacity-90">
                    Fully optimized for Android with battery-saving features,
                    background processing, and seamless integration with Google services.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Android-Specific Features */}
        <div className="mb-16">
          <Card padding="xl" className="bg-audible-gray-50">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4 mx-auto">
                  <Smartphone className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-audible-text-primary mb-4">
                Android Ecosystem Integration
              </h2>
              <p className="text-lg text-audible-text-secondary max-w-3xl mx-auto">
                Take full advantage of Android's powerful features and ecosystem integration.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {androidFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-audible-text-secondary">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Play Store Information */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-audible-text-primary mb-8 text-center">
            Google Play Details
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
                    <span className="font-medium text-audible-text-primary">{playStoreInfo.developer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-audible-text-secondary">Size</span>
                    <span className="font-medium text-audible-text-primary">{playStoreInfo.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-audible-text-secondary">Installs</span>
                    <span className="font-medium text-audible-orange">{playStoreInfo.installs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-audible-text-secondary">Content Rating</span>
                    <span className="font-medium text-audible-text-primary">{playStoreInfo.age}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-audible-text-secondary">Languages</span>
                    <span className="font-medium text-audible-text-primary">{playStoreInfo.languages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-audible-text-secondary">Last Update</span>
                    <span className="font-medium text-audible-text-primary">{playStoreInfo.lastUpdate}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-audible-text-primary mb-4">
                  Recent Updates
                </h3>
                <div className="space-y-3 text-sm text-audible-text-secondary">
                  <div>
                    <div className="font-medium text-audible-text-primary mb-1">Version 3.2.0</div>
                    <ul className="space-y-1">
                      <li>• Enhanced Android TV support</li>
                      <li>• Improved Google Assistant integration</li>
                      <li>• New Material You theming</li>
                      <li>• Performance optimizations</li>
                      <li>• Android 14 compatibility</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Download CTA */}
        <div className="text-center">
          <Card padding="xl" className="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <Smartphone className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Ready for Android?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Download Audible for Android and enjoy your first audiobook free with a 30-day trial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white" leftIcon={<Download className="w-5 h-5" />}>
                Get it on Google Play
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600">
                System Requirements
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AndroidApp;
