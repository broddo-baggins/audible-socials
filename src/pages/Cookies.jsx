import React from 'react';
import { Card } from '../components/ui';
import { Cookie, Settings, Eye, BarChart, Calendar } from 'lucide-react';

const Cookies = () => {
  const lastUpdated = 'January 15, 2025';

  const cookieTypes = [
    {
      title: 'Essential Cookies',
      icon: Settings,
      description: 'Required for basic website functionality and security',
      purpose: 'These cookies are necessary for the website to function properly and cannot be disabled.',
      examples: [
        'Authentication and session management',
        'Security features and fraud prevention',
        'Load balancing and server optimization',
        'Remembering your cookie preferences'
      ],
      duration: 'Session or up to 1 year',
      required: true
    },
    {
      title: 'Performance Cookies',
      icon: BarChart,
      description: 'Help us understand how visitors interact with our website',
      purpose: 'These cookies collect information about how you use our website to help us improve performance.',
      examples: [
        'Page load times and error tracking',
        'Most visited pages and features',
        'Device and browser information',
        'Anonymous usage statistics'
      ],
      duration: 'Up to 2 years',
      required: false
    },
    {
      title: 'Functional Cookies',
      icon: Eye,
      description: 'Enable enhanced features and personalization',
      purpose: 'These cookies allow us to remember your preferences and provide enhanced features.',
      examples: [
        'Language and region preferences',
        'Customized content and recommendations',
        'Playback settings and audio preferences',
        'Saved searches and filters'
      ],
      duration: 'Up to 2 years',
      required: false
    },
    {
      title: 'Marketing Cookies',
      icon: Cookie,
      description: 'Used to deliver relevant advertisements and measure campaign effectiveness',
      purpose: 'These cookies help us show you relevant ads and measure the effectiveness of our marketing campaigns.',
      examples: [
        'Displaying personalized advertisements',
        'Tracking ad campaign performance',
        'Retargeting based on website visits',
        'Social media advertising integration'
      ],
      duration: 'Up to 1 year',
      required: false
    }
  ];

  const thirdPartyCookies = [
    {
      provider: 'Google Analytics',
      purpose: 'Website analytics and performance monitoring',
      type: 'Performance',
      duration: 'Up to 2 years'
    },
    {
      provider: 'Stripe',
      purpose: 'Payment processing and fraud prevention',
      type: 'Essential',
      duration: 'Session'
    },
    {
      provider: 'Facebook Pixel',
      purpose: 'Advertising and audience insights',
      type: 'Marketing',
      duration: 'Up to 1 year'
    },
    {
      provider: 'Amazon Web Services',
      purpose: 'Content delivery and cloud services',
      type: 'Essential',
      duration: 'Session'
    }
  ];

  const manageInstructions = [
    {
      browser: 'Chrome',
      steps: [
        'Click the three dots in the top right corner',
        'Go to Settings > Privacy and security > Cookies and other site data',
        'Choose your preferred cookie settings'
      ]
    },
    {
      browser: 'Firefox',
      steps: [
        'Click the menu button and select Settings',
        'Go to Privacy & Security > Cookies and Site Data',
        'Adjust your cookie preferences'
      ]
    },
    {
      browser: 'Safari',
      steps: [
        'Go to Safari > Preferences > Privacy',
        'Choose your cookie blocking preferences',
        'Manage website data if needed'
      ]
    },
    {
      browser: 'Edge',
      steps: [
        'Click the three dots > Settings > Cookies and site permissions',
        'Manage cookie settings for individual sites',
        'Control tracking prevention'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-audible-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-audible-orange/10 mb-6 mx-auto">
            <Cookie className="w-8 h-8 text-audible-orange" />
          </div>
          <h1 className="text-4xl font-bold text-audible-text-primary mb-4">
            Cookie Policy
          </h1>
          <div className="flex items-center justify-center gap-2 text-audible-text-secondary">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Introduction */}
        <Card padding="lg" className="mb-8">
          <h2 className="text-xl font-bold text-audible-text-primary mb-4">
            What Are Cookies?
          </h2>
          <p className="text-audible-text-secondary leading-relaxed mb-4">
            Cookies are small text files that are stored on your device when you visit our website.
            They help us provide you with a better browsing experience by remembering your preferences
            and understanding how you use our services.
          </p>
          <p className="text-audible-text-secondary leading-relaxed">
            This Cookie Policy explains what cookies we use, why we use them, and how you can control
            your cookie preferences. For more information about how we handle your personal information,
            please see our Privacy Policy.
          </p>
        </Card>

        {/* Cookie Types */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-audible-text-primary mb-6">
            Types of Cookies We Use
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {cookieTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <Card key={index} padding="lg">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-audible-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-audible-orange" />
                    </div>
                    <div>
                      <h3 className="font-bold text-audible-text-primary mb-1">
                        {type.title}
                      </h3>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        type.required
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {type.required ? 'Required' : 'Optional'}
                      </span>
                    </div>
                  </div>
                  <p className="text-audible-text-secondary text-sm mb-3">
                    {type.description}
                  </p>
                  <p className="text-audible-text-secondary text-sm mb-4">
                    <strong>Purpose:</strong> {type.purpose}
                  </p>
                  <div className="mb-3">
                    <p className="text-sm font-medium text-audible-text-primary mb-2">Examples:</p>
                    <ul className="space-y-1">
                      {type.examples.map((example, exIndex) => (
                        <li key={exIndex} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-audible-orange rounded-full flex-shrink-0 mt-2"></span>
                          <span className="text-sm text-audible-text-secondary">{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-sm text-audible-text-secondary">
                    <strong>Duration:</strong> {type.duration}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Third-Party Cookies */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-audible-text-primary mb-6">
            Third-Party Cookies
          </h2>
          <Card padding="lg">
            <p className="text-audible-text-secondary mb-6">
              We also use cookies from third-party service providers to help us deliver our services.
              These providers are carefully selected and we only share necessary information with them.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-audible-gray-200">
                    <th className="text-left py-2 font-semibold text-audible-text-primary">Provider</th>
                    <th className="text-left py-2 font-semibold text-audible-text-primary">Purpose</th>
                    <th className="text-left py-2 font-semibold text-audible-text-primary">Type</th>
                    <th className="text-left py-2 font-semibold text-audible-text-primary">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-audible-gray-100">
                  {thirdPartyCookies.map((cookie, index) => (
                    <tr key={index}>
                      <td className="py-3 font-medium text-audible-text-primary">{cookie.provider}</td>
                      <td className="py-3 text-audible-text-secondary">{cookie.purpose}</td>
                      <td className="py-3">
                        <span className="px-2 py-1 bg-audible-orange/10 text-audible-orange text-xs rounded-full">
                          {cookie.type}
                        </span>
                      </td>
                      <td className="py-3 text-audible-text-secondary">{cookie.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Managing Cookies */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-audible-text-primary mb-6">
            Managing Your Cookie Preferences
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Cookie Settings */}
            <Card padding="lg">
              <h3 className="text-lg font-bold text-audible-text-primary mb-4">
                Cookie Settings
              </h3>
              <p className="text-audible-text-secondary mb-4">
                You can control your cookie preferences through our cookie consent banner or settings panel.
                Changes will take effect on your next visit.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-audible-orange" />
                  <span className="text-sm text-audible-text-secondary">Essential cookies (required)</span>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-audible-orange" />
                  <span className="text-sm text-audible-text-secondary">Performance cookies</span>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-audible-orange" />
                  <span className="text-sm text-audible-text-secondary">Functional cookies</span>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 text-audible-orange" />
                  <span className="text-sm text-audible-text-secondary">Marketing cookies</span>
                </div>
              </div>
            </Card>

            {/* Browser Settings */}
            <Card padding="lg">
              <h3 className="text-lg font-bold text-audible-text-primary mb-4">
                Browser Settings
              </h3>
              <p className="text-audible-text-secondary mb-4">
                You can also manage cookies through your browser settings.
                Here's how for popular browsers:
              </p>
              <div className="space-y-4">
                {manageInstructions.map((browser, index) => (
                  <div key={index}>
                    <h4 className="font-medium text-audible-text-primary mb-2">
                      {browser.browser}
                    </h4>
                    <ol className="text-sm text-audible-text-secondary space-y-1">
                      {browser.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-2">
                          <span className="w-4 h-4 bg-audible-orange text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            {stepIndex + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Additional Information */}
        <Card padding="lg" className="mb-8 bg-audible-gray-50">
          <h2 className="text-xl font-bold text-audible-text-primary mb-4">
            Additional Information
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-audible-text-primary mb-2">
                Cookie Updates
              </h3>
              <p className="text-audible-text-secondary text-sm">
                We may update this Cookie Policy from time to time. We will notify you of any material
                changes and obtain your consent where required by law.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-audible-text-primary mb-2">
                Contact Us
              </h3>
              <p className="text-audible-text-secondary text-sm">
                If you have questions about our use of cookies, please contact us at privacy@audible.com.
              </p>
            </div>
          </div>
        </Card>

        {/* Footer Note */}
        <div className="text-center text-sm text-audible-text-secondary">
          <p>
            This cookie policy was last updated on {lastUpdated}.
            For more information about our privacy practices, please see our Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
