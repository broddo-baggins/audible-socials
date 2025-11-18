import React, { useState } from 'react';
import { Card, Button } from '../components/ui';
import { Search, MessageCircle, Phone, Mail, BookOpen, Play, CreditCard, Users, Settings, HelpCircle } from 'lucide-react';

const Support = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: HelpCircle },
    { id: 'account', name: 'Account & Billing', icon: CreditCard },
    { id: 'playback', name: 'Playback & Audio', icon: Play },
    { id: 'content', name: 'Content & Library', icon: BookOpen },
    { id: 'social', name: 'Social Features', icon: Users },
    { id: 'apps', name: 'Apps & Devices', icon: Settings },
  ];

  const faqs = [
    {
      category: 'account',
      question: 'How do I update my payment method?',
      answer: 'Go to your Account settings and select "Billing & Payments". You can add, remove, or update your payment methods there.',
    },
    {
      category: 'playback',
      question: 'Why is my audiobook not playing?',
      answer: 'Check your internet connection and ensure you have an active subscription. Try restarting the app or switching devices.',
    },
    {
      category: 'content',
      question: 'How do I download audiobooks for offline listening?',
      answer: 'Tap the download button next to any title in your Library. Downloads are available on mobile apps and some desktop platforms.',
    },
    {
      category: 'social',
      question: 'How do I join a book club?',
      answer: 'Browse available clubs in the Socials section or create your own. Click "Join" to become a member.',
    },
    {
      category: 'apps',
      question: 'Which devices support Audible?',
      answer: 'Audible works on iOS, Android, web browsers, Amazon devices, and select smart speakers.',
    },
    {
      category: 'account',
      question: 'How do I cancel my subscription?',
      answer: 'Visit your Account settings and select "Manage Subscription". You can cancel at any time with no penalties.',
    },
  ];

  const filteredFaqs = selectedCategory === 'all'
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory);

  const contactMethods = [
    {
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      icon: MessageCircle,
      available: '24/7',
      action: 'Start Chat',
    },
    {
      title: 'Phone Support',
      description: 'Speak directly with a support specialist',
      icon: Phone,
      available: 'Mon-Fri 9AM-6PM EST',
      action: 'Call Now',
    },
    {
      title: 'Email Support',
      description: 'Send us a detailed message about your issue',
      icon: Mail,
      available: 'Response within 24 hours',
      action: 'Send Email',
    },
  ];

  return (
    <div className="min-h-screen bg-audible-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-audible-text-primary mb-6">
            Support Center
          </h1>
          <p className="text-xl text-audible-text-secondary max-w-3xl mx-auto leading-relaxed">
            Find answers to your questions, get help with your account, or contact our support team.
            We're here to help you make the most of your Audible experience.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-12">
          <Card padding="lg">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-audible-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-audible-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-audible-orange focus:border-audible-orange"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {['download issues', 'payment problems', 'account help', 'audio quality'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setSearchQuery(suggestion)}
                    className="px-4 py-2 bg-audible-gray-100 text-audible-text-secondary rounded-full text-sm hover:bg-audible-orange hover:text-white transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-audible-orange text-white'
                      : 'bg-audible-gray-100 text-audible-text-primary hover:bg-audible-orange/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-audible-text-primary mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-audible-text-secondary">
              Quick answers to common questions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredFaqs.map((faq, index) => (
              <Card key={index} padding="lg" className="hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-audible-text-primary mb-3">
                  {faq.question}
                </h3>
                <p className="text-audible-text-secondary leading-relaxed">
                  {faq.answer}
                </p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline">
              View All FAQs
            </Button>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-audible-text-primary mb-4">
              Still Need Help?
            </h2>
            <p className="text-lg text-audible-text-secondary">
              Choose the best way to get in touch with our support team
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <Card key={index} padding="lg" className="text-center hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-audible-orange/10 mb-4 mx-auto">
                    <Icon className="w-8 h-8 text-audible-orange" />
                  </div>
                  <h3 className="text-xl font-bold text-audible-text-primary mb-2">
                    {method.title}
                  </h3>
                  <p className="text-audible-text-secondary mb-4">
                    {method.description}
                  </p>
                  <p className="text-sm text-audible-text-secondary mb-4">
                    {method.available}
                  </p>
                  <Button variant="primary" fullWidth>
                    {method.action}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Help Resources */}
        <div className="mb-16">
          <Card padding="xl" className="bg-audible-gray-50">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-audible-text-primary mb-4">
                Additional Resources
              </h2>
              <p className="text-lg text-audible-text-secondary">
                Explore our comprehensive help resources
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-audible-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-audible-orange" />
                </div>
                <h3 className="font-bold text-audible-text-primary mb-2">
                  User Guide
                </h3>
                <p className="text-sm text-audible-text-secondary mb-4">
                  Step-by-step guides for all features
                </p>
                <Button variant="outline" size="sm">
                  Browse Guide
                </Button>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-audible-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-audible-orange" />
                </div>
                <h3 className="font-bold text-audible-text-primary mb-2">
                  Video Tutorials
                </h3>
                <p className="text-sm text-audible-text-secondary mb-4">
                  Visual guides and walkthroughs
                </p>
                <Button variant="outline" size="sm">
                  Watch Videos
                </Button>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-audible-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-audible-orange" />
                </div>
                <h3 className="font-bold text-audible-text-primary mb-2">
                  Community Forum
                </h3>
                <p className="text-sm text-audible-text-secondary mb-4">
                  Connect with other listeners
                </p>
                <Button variant="outline" size="sm">
                  Join Discussion
                </Button>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-audible-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-audible-orange" />
                </div>
                <h3 className="font-bold text-audible-text-primary mb-2">
                  System Status
                </h3>
                <p className="text-sm text-audible-text-secondary mb-4">
                  Check service availability
                </p>
                <Button variant="outline" size="sm">
                  View Status
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;
