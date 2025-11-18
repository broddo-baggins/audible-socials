import React from 'react';
import { Card, Button } from '../components/ui';
import { Accessibility, Volume2, Eye, Keyboard, Smartphone, Headphones, Users, CheckCircle } from 'lucide-react';

const AccessibilityPage = () => {
  const accessibilityFeatures = [
    {
      title: 'Screen Reader Support',
      description: 'Full compatibility with popular screen readers including JAWS, NVDA, VoiceOver, and TalkBack.',
      icon: Volume2,
      details: [
        'Proper ARIA labels and landmarks',
        'Semantic HTML structure',
        'Keyboard navigation support',
        'Dynamic content announcements',
      ],
    },
    {
      title: 'Visual Accessibility',
      description: 'Multiple options for users with visual impairments or color vision deficiencies.',
      icon: Eye,
      details: [
        'High contrast mode available',
        'Adjustable text sizes',
        'Color-blind friendly color schemes',
        'Screen magnification support',
      ],
    },
    {
      title: 'Keyboard Navigation',
      description: 'Complete functionality accessible through keyboard alone, following WCAG 2.1 guidelines.',
      icon: Keyboard,
      details: [
        'All interactive elements keyboard accessible',
        'Logical tab order',
        'Keyboard shortcuts for common actions',
        'Focus indicators always visible',
      ],
    },
    {
      title: 'Mobile Accessibility',
      description: 'Optimized experience across all mobile devices with assistive technology support.',
      icon: Smartphone,
      details: [
        'Touch target sizes meet minimum requirements',
        'Gesture alternatives available',
        'Voice control compatibility',
        'Switch control support',
      ],
    },
  ];

  const audioFeatures = [
    {
      title: 'Playback Controls',
      description: 'Comprehensive audio player controls designed with accessibility in mind.',
      features: [
        'Large, clearly labeled buttons',
        'Playback speed adjustment (0.5x to 3.0x)',
        'Sleep timer functionality',
        'Bookmark and skip features',
        'Resume playback from last position',
      ],
    },
    {
      title: 'Audio Quality Options',
      description: 'Multiple audio quality settings to accommodate different needs and preferences.',
      features: [
        'Standard quality (64 kbps)',
        'High quality (128 kbps)',
        'Enhanced quality (256 kbps)',
        'Offline download capability',
        'Background playback support',
      ],
    },
    {
      title: 'Content Navigation',
      description: 'Easy navigation through audio content with accessible controls.',
      features: [
        'Chapter navigation',
        'Time-based seeking',
        'Progress indicators',
        'Content summaries available',
        'Search within titles',
      ],
    },
  ];

  const commitments = [
    {
      title: 'WCAG 2.1 AA Compliance',
      description: 'We strive to meet or exceed WCAG 2.1 AA guidelines across all our digital platforms.',
    },
    {
      title: 'Continuous Improvement',
      description: 'Regular accessibility audits and user testing to identify and address barriers.',
    },
    {
      title: 'Inclusive Design',
      description: 'Accessibility considerations built into all new features and design decisions.',
    },
    {
      title: 'User Feedback',
      description: 'We actively seek and incorporate feedback from users with disabilities.',
    },
  ];

  const resources = [
    {
      title: 'Accessibility Settings',
      description: 'Learn how to customize your Audible experience for accessibility.',
      link: '#settings',
    },
    {
      title: 'Supported Assistive Technologies',
      description: 'List of assistive technologies compatible with Audible.',
      link: '#technologies',
    },
    {
      title: 'Keyboard Shortcuts',
      description: 'Complete guide to keyboard navigation and shortcuts.',
      link: '#shortcuts',
    },
    {
      title: 'Contact Accessibility Team',
      description: 'Get in touch with our dedicated accessibility support team.',
      link: '#contact',
    },
  ];

  return (
    <div className="min-h-screen bg-audible-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-audible-orange/10 mb-6 mx-auto">
            <Accessibility className="w-10 h-10 text-audible-orange" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-audible-text-primary mb-6">
            Accessibility at Audible
          </h1>
          <p className="text-xl text-audible-text-secondary max-w-4xl mx-auto leading-relaxed">
            We're committed to making audio entertainment accessible to everyone. Our platform is designed
            with accessibility in mind, ensuring that people with disabilities can fully enjoy our service.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="mb-16">
          <Card padding="xl" className="bg-gradient-to-r from-audible-orange to-audible-orange/80 text-white">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6">
                Our Accessibility Mission
              </h2>
              <p className="text-lg leading-relaxed max-w-4xl mx-auto">
                At Audible, we believe that stories have the power to connect, inspire, and transform lives.
                That's why we're dedicated to ensuring that everyone, regardless of ability, can access our
                vast library of audiobooks, podcasts, and original content. Accessibility isn't just a feature
                for us—it's a fundamental part of our commitment to serving all listeners.
              </p>
            </div>
          </Card>
        </div>

        {/* Accessibility Features */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-audible-text-primary mb-4">
              Accessibility Features
            </h2>
            <p className="text-lg text-audible-text-secondary">
              Comprehensive accessibility support across all platforms and devices
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {accessibilityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} padding="lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-audible-orange/10 flex items-center justify-center">
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
                          <li key={detailIndex} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
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

        {/* Audio Experience Features */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-audible-text-primary mb-4">
              Audio Experience Features
            </h2>
            <p className="text-lg text-audible-text-secondary">
              Specialized features designed for accessible audio listening
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {audioFeatures.map((section, index) => (
              <Card key={index} padding="lg">
                <h3 className="text-xl font-bold text-audible-text-primary mb-3">
                  {section.title}
                </h3>
                <p className="text-audible-text-secondary mb-4">
                  {section.description}
                </p>
                <ul className="space-y-2">
                  {section.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-audible-text-secondary">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>

        {/* Our Commitments */}
        <div className="mb-16">
          <Card padding="xl" className="bg-audible-gray-50">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-audible-text-primary mb-4">
                Our Commitments
              </h2>
              <p className="text-lg text-audible-text-secondary">
                How we ensure accessibility remains at the core of everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {commitments.map((commitment, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-xl font-bold text-audible-text-primary mb-2">
                    {commitment.title}
                  </h3>
                  <p className="text-audible-text-secondary">
                    {commitment.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Resources & Support */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-audible-text-primary mb-4">
              Resources & Support
            </h2>
            <p className="text-lg text-audible-text-secondary">
              Additional resources to help you get the most out of Audible
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} padding="lg" className="text-center hover:shadow-md transition-shadow">
                <h3 className="font-bold text-audible-text-primary mb-2">
                  {resource.title}
                </h3>
                <p className="text-sm text-audible-text-secondary mb-4">
                  {resource.description}
                </p>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <Card padding="xl" className="bg-gradient-to-r from-audible-orange to-audible-orange/80 text-white">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6 mx-auto">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Need Help with Accessibility?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Our dedicated accessibility team is here to help you have the best possible experience with Audible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg">
                Contact Accessibility Team
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-audible-orange">
                Accessibility Resources
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityPage;
