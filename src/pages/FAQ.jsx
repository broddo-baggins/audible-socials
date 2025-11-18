import React, { useState } from 'react';
import { Card, Button } from '../components/ui';
import { ChevronDown, ChevronUp, Search, CreditCard, Play, BookOpen, Users, Settings, Smartphone } from 'lucide-react';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const faqCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: BookOpen,
      faqs: [
        {
          id: 'what-is-audible',
          question: 'What is Audible?',
          answer: 'Audible is the world\'s largest audio entertainment service, offering audiobooks, podcasts, and original audio content. With over 425,000 titles available, you can listen to books on your phone, tablet, computer, or smart speaker.'
        },
        {
          id: 'how-to-sign-up',
          question: 'How do I sign up for Audible?',
          answer: 'Visit audible.com and click "Start your free trial". Choose your plan, enter your payment information, and start listening immediately. You get one free audiobook with your trial.'
        },
        {
          id: 'trial-info',
          question: 'What\'s included in the free trial?',
          answer: 'Your free trial includes one audiobook credit, access to all Audible channels, and the ability to listen to any title in our catalog. You can cancel anytime during your trial period.'
        }
      ]
    },
    {
      id: 'account-billing',
      title: 'Account & Billing',
      icon: CreditCard,
      faqs: [
        {
          id: 'payment-methods',
          question: 'What payment methods do you accept?',
          answer: 'We accept major credit cards (Visa, MasterCard, American Express), debit cards, PayPal, and digital payment methods like Apple Pay and Google Pay.'
        },
        {
          id: 'cancel-subscription',
          question: 'How do I cancel my subscription?',
          answer: 'You can cancel your subscription anytime from your Account settings. Go to "Manage Subscription" and select "Cancel Membership". You\'ll continue to have access until the end of your billing period.'
        },
        {
          id: 'refund-policy',
          question: 'What is your refund policy?',
          answer: 'If you\'re not satisfied with your purchase, you can return any audiobook within 365 days for a full refund, provided you have less than 50% of the title remaining.'
        }
      ]
    },
    {
      id: 'listening-playback',
      title: 'Listening & Playback',
      icon: Play,
      faqs: [
        {
          id: 'download-books',
          question: 'How do I download audiobooks?',
          answer: 'On mobile apps, tap the download icon next to any title in your Library. Downloads are available for offline listening. Note that some titles may have DRM restrictions.'
        },
        {
          id: 'playback-speed',
          question: 'Can I change the playback speed?',
          answer: 'Yes! You can adjust playback speed from 0.5x to 3.0x in the player settings. This helps you listen at your preferred pace.'
        },
        {
          id: 'multiple-devices',
          question: 'Can I listen on multiple devices?',
          answer: 'Yes, you can listen on up to 16 different devices with one account. Your listening progress syncs automatically across all devices.'
        }
      ]
    },
    {
      id: 'social-features',
      title: 'Social Features',
      icon: Users,
      faqs: [
        {
          id: 'book-clubs',
          question: 'How do book clubs work?',
          answer: 'Book clubs allow you to discuss audiobooks with other listeners. Join existing clubs or create your own. Share thoughts, ask questions, and connect with fellow readers.'
        },
        {
          id: 'friend-activity',
          question: 'Can I see what my friends are listening to?',
          answer: 'Yes! Connect with friends and see their listening activity in your social feed. You can also share your own listening progress and recommendations.'
        },
        {
          id: 'privacy-settings',
          question: 'How do I control my privacy settings?',
          answer: 'Go to Account Settings > Privacy to control who can see your listening activity, friend requests, and profile information. You have full control over your privacy.'
        }
      ]
    },
    {
      id: 'apps-devices',
      title: 'Apps & Devices',
      icon: Smartphone,
      faqs: [
        {
          id: 'supported-devices',
          question: 'Which devices support Audible?',
          answer: 'Audible works on iOS and Android devices, web browsers, Amazon Echo devices, Sonos speakers, and select smart TVs. Check our device compatibility page for the full list.'
        },
        {
          id: 'app-features',
          question: 'What features are available in the mobile app?',
          answer: 'Mobile apps include offline downloads, background playback, sleep timers, bookmarks, and social features. All premium features are available across platforms.'
        },
        {
          id: 'sync-progress',
          question: 'Does my progress sync between devices?',
          answer: 'Yes! Your bookmarks, playback position, and listening history automatically sync across all your devices when you\'re connected to the internet.'
        }
      ]
    },
    {
      id: 'technical-support',
      title: 'Technical Support',
      icon: Settings,
      faqs: [
        {
          id: 'audio-quality',
          question: 'What audio quality options are available?',
          answer: 'We offer multiple quality settings: Standard (64 kbps), High (128 kbps), and Enhanced (256 kbps). Higher quality uses more data and storage space.'
        },
        {
          id: 'troubleshooting',
          question: 'My app isn\'t working. What should I do?',
          answer: 'Try restarting the app, checking your internet connection, or updating to the latest version. If issues persist, contact our support team with details about your device and the problem.'
        },
        {
          id: 'account-security',
          question: 'How do I keep my account secure?',
          answer: 'Use a strong password, enable two-factor authentication, and never share your login credentials. Regularly review your account activity in the security settings.'
        }
      ]
    }
  ];

  const allFaqs = faqCategories.flatMap(category =>
    category.faqs.map(faq => ({ ...faq, category: category.title }))
  );

  const filteredFaqs = searchQuery
    ? allFaqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allFaqs;

  return (
    <div className="min-h-screen bg-audible-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-audible-text-primary mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-audible-text-secondary max-w-3xl mx-auto leading-relaxed">
            Find quick answers to common questions about Audible. Can't find what you're looking for?
            Visit our Support Center or contact our team.
          </p>
        </div>

        {/* Search */}
        <div className="mb-12">
          <Card padding="lg">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-audible-gray-400" />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-audible-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-audible-orange focus:border-audible-orange"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-audible-text-primary">
                Search Results ({filteredFaqs.length})
              </h2>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setExpandedItems(new Set());
                }}
              >
                Clear Search
              </Button>
            </div>

            <div className="space-y-4">
              {filteredFaqs.map((faq) => (
                <Card key={faq.id} padding="lg">
                  <button
                    onClick={() => toggleExpanded(faq.id)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="inline-block px-2 py-1 bg-audible-orange/10 text-audible-orange text-xs font-medium rounded mb-2">
                          {faq.category}
                        </span>
                        <h3 className="text-lg font-bold text-audible-text-primary">
                          {faq.question}
                        </h3>
                      </div>
                      {expandedItems.has(faq.id) ? (
                        <ChevronUp className="w-5 h-5 text-audible-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-audible-gray-400" />
                      )}
                    </div>
                  </button>
                  {expandedItems.has(faq.id) && (
                    <div className="mt-4 pt-4 border-t border-audible-gray-200">
                      <p className="text-audible-text-secondary leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Categories */}
        {!searchQuery && (
          <div className="space-y-12">
            {faqCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.id}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-audible-orange/10 rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-audible-orange" />
                    </div>
                    <h2 className="text-2xl font-bold text-audible-text-primary">
                      {category.title}
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {category.faqs.map((faq) => (
                      <Card key={faq.id} padding="lg">
                        <button
                          onClick={() => toggleExpanded(faq.id)}
                          className="w-full text-left"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-audible-text-primary">
                              {faq.question}
                            </h3>
                            {expandedItems.has(faq.id) ? (
                              <ChevronUp className="w-5 h-5 text-audible-gray-400 flex-shrink-0 ml-2" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-audible-gray-400 flex-shrink-0 ml-2" />
                            )}
                          </div>
                        </button>
                        {expandedItems.has(faq.id) && (
                          <div className="mt-4 pt-4 border-t border-audible-gray-200">
                            <p className="text-audible-text-secondary leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Contact Support CTA */}
        <div className="mt-16">
          <Card padding="xl" className="bg-gradient-to-r from-audible-orange to-audible-orange/80 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              Still Have Questions?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Our support team is here to help. Get in touch for personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg">
                Contact Support
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-audible-orange">
                Visit Support Center
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
