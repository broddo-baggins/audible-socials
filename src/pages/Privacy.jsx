import React from 'react';
import { Card } from '../components/ui';
import { Shield, Eye, Lock, Database, Calendar } from 'lucide-react';

const Privacy = () => {
  const lastUpdated = 'January 15, 2025';

  const sections = [
    {
      title: 'Information We Collect',
      icon: Database,
      content: [
        {
          subtitle: 'Information You Provide',
          items: [
            'Account registration details (name, email, password)',
            'Payment information for subscription services',
            'Profile information and preferences',
            'Communications with our support team',
            'Survey responses and feedback'
          ]
        },
        {
          subtitle: 'Information We Collect Automatically',
          items: [
            'Device information and identifiers',
            'Usage data and listening habits',
            'IP addresses and location data',
            'Browser and app analytics',
            'Performance and diagnostic data'
          ]
        },
        {
          subtitle: 'Information from Third Parties',
          items: [
            'Social media platforms (when connecting accounts)',
            'Payment processors for billing information',
            'Analytics providers for usage insights',
            'Marketing partners for advertising effectiveness'
          ]
        }
      ]
    },
    {
      title: 'How We Use Your Information',
      icon: Eye,
      content: [
        {
          subtitle: 'Service Provision',
          items: [
            'Provide access to our audio entertainment services',
            'Process payments and manage subscriptions',
            'Deliver personalized content recommendations',
            'Maintain and improve service functionality',
            'Provide customer support and technical assistance'
          ]
        },
        {
          subtitle: 'Personalization and Analytics',
          items: [
            'Analyze usage patterns to improve user experience',
            'Recommend content based on listening history',
            'Conduct research and develop new features',
            'Measure service performance and user engagement',
            'Generate aggregated, anonymized analytics'
          ]
        },
        {
          subtitle: 'Communication and Marketing',
          items: [
            'Send service-related notifications and updates',
            'Provide information about new features and content',
            'Deliver promotional offers (with your consent)',
            'Respond to inquiries and support requests',
            'Send important account and security information'
          ]
        }
      ]
    },
    {
      title: 'Information Sharing and Disclosure',
      icon: Lock,
      content: [
        {
          subtitle: 'With Your Consent',
          items: [
            'Sharing information with connected social media accounts',
            'Providing data to third-party services you authorize',
            'Participating in research studies you opt into',
            'Sharing anonymized data for permitted purposes'
          ]
        },
        {
          subtitle: 'Service Providers and Partners',
          items: [
            'Payment processing and financial transaction services',
            'Content delivery networks and cloud storage providers',
            'Analytics and customer support platform providers',
            'Marketing and advertising technology partners'
          ]
        },
        {
          subtitle: 'Legal Requirements',
          items: [
            'Complying with applicable laws and regulations',
            'Responding to legal requests and court orders',
            'Protecting rights and safety of users and third parties',
            'Enforcing our Terms of Service and other agreements'
          ]
        }
      ]
    },
    {
      title: 'Data Security and Retention',
      icon: Shield,
      content: [
        {
          subtitle: 'Security Measures',
          items: [
            'Industry-standard encryption for data transmission',
            'Secure storage systems with access controls',
            'Regular security audits and vulnerability assessments',
            'Employee training on data protection practices',
            'Incident response procedures for data breaches'
          ]
        },
        {
          subtitle: 'Data Retention',
          items: [
            'Account data retained while account is active',
            'Usage data retained for service improvement purposes',
            'Legal retention requirements may extend storage periods',
            'Data deletion upon account closure (subject to legal requirements)',
            'Anonymized data may be retained indefinitely for analytics'
          ]
        }
      ]
    },
    {
      title: 'Your Rights and Choices',
      icon: Eye,
      content: [
        {
          subtitle: 'Access and Control',
          items: [
            'Access your personal information through account settings',
            'Update or correct your account information',
            'Download your data in a portable format',
            'Delete your account and associated data',
            'Opt out of marketing communications'
          ]
        },
        {
          subtitle: 'Privacy Settings',
          items: [
            'Control social sharing and activity visibility',
            'Manage cookie preferences and tracking',
            'Adjust notification and communication settings',
            'Limit data collection for personalization',
            'Control location and device data sharing'
          ]
        },
        {
          subtitle: 'Data Portability',
          items: [
            'Export your listening history and preferences',
            'Transfer data to compatible services',
            'Receive data in machine-readable formats',
            'Request data migration assistance',
            'Access third-party data sharing records'
          ]
        }
      ]
    },
    {
      title: 'Cookies and Tracking Technologies',
      icon: Database,
      content: [
        {
          subtitle: 'Types of Cookies We Use',
          items: [
            'Essential cookies for basic service functionality',
            'Performance cookies for analytics and optimization',
            'Functional cookies for personalized features',
            'Marketing cookies for advertising and promotions',
            'Third-party cookies from service providers'
          ]
        },
        {
          subtitle: 'Managing Cookies',
          items: [
            'Browser settings to control cookie acceptance',
            'Cookie preference center in our applications',
            'Opt-out links for marketing and advertising cookies',
            'Automatic expiration of temporary cookies',
            'Clear instructions for cookie management'
          ]
        }
      ]
    },
    {
      title: 'International Data Transfers',
      icon: Shield,
      content: [
        {
          subtitle: 'Cross-Border Transfers',
          items: [
            'Data may be transferred to countries with different privacy laws',
            'Standard contractual clauses for international transfers',
            'Adequacy decisions for certain jurisdictions',
            'Additional safeguards for sensitive data transfers',
            'Transparency about international data processing'
          ]
        },
        {
          subtitle: 'Regional Compliance',
          items: [
            'GDPR compliance for European Union users',
            'CCPA compliance for California residents',
            'Additional regional privacy law compliance',
            'Local data protection authority cooperation',
            'Regional privacy representative availability'
          ]
        }
      ]
    },
    {
      title: "Children's Privacy",
      icon: Shield,
      content: [
        {
          subtitle: 'Age Restrictions',
          items: [
            'Service not intended for children under 13',
            'Parental consent required for users under 18',
            'Special protections for younger users',
            'Limited data collection for minors',
            'Enhanced privacy controls for youth accounts'
          ]
        },
        {
          subtitle: 'Family Features',
          items: [
            'Family sharing with parental controls',
            'Content filtering and age-appropriate recommendations',
            'Usage monitoring and reporting for parents',
            'Privacy settings for family accounts',
            'Educational content and safe listening features'
          ]
        }
      ]
    },
    {
      title: 'Changes to This Policy',
      icon: Calendar,
      content: [
        {
          subtitle: 'Policy Updates',
          items: [
            'Regular review and updates to privacy practices',
            'Material changes communicated to users',
            'Advance notice of significant policy changes',
            'User consent for major privacy practice changes',
            'Previous policy versions available in archives'
          ]
        },
        {
          subtitle: 'Notification Methods',
          items: [
            'Email notifications for policy changes',
            'In-app notifications and banners',
            'Website announcements and updates',
            'Direct communication for material changes',
            'User dashboard privacy policy updates'
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-audible-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-audible-orange/10 mb-6 mx-auto">
            <Shield className="w-8 h-8 text-audible-orange" />
          </div>
          <h1 className="text-4xl font-bold text-audible-text-primary mb-4">
            Privacy Policy
          </h1>
          <div className="flex items-center justify-center gap-2 text-audible-text-secondary">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Introduction */}
        <Card padding="lg" className="mb-8">
          <p className="text-audible-text-secondary leading-relaxed mb-4">
            At Audible, we are committed to protecting your privacy and being transparent about how we collect,
            use, and share your information. This Privacy Policy explains our practices regarding your personal
            information and your rights to control it.
          </p>
          <p className="text-audible-text-secondary leading-relaxed">
            This policy applies to all Audible services, including our websites, mobile applications, and
            related services. By using our services, you agree to the collection and use of information
            in accordance with this policy.
          </p>
        </Card>

        {/* Policy Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card key={index} padding="lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-audible-orange/10 rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-audible-orange" />
                  </div>
                  <h2 className="text-xl font-bold text-audible-text-primary">
                    {index + 1}. {section.title}
                  </h2>
                </div>
                <div className="space-y-6">
                  {section.content.map((subsection, subIndex) => (
                    <div key={subIndex}>
                      <h3 className="font-semibold text-audible-text-primary mb-3">
                        {subsection.subtitle}
                      </h3>
                      <ul className="space-y-2">
                        {subsection.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-audible-orange rounded-full flex-shrink-0 mt-2"></span>
                            <span className="text-audible-text-secondary leading-relaxed">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Contact Information */}
        <Card padding="lg" className="mt-12 bg-audible-gray-50">
          <div className="text-center">
            <h2 className="text-xl font-bold text-audible-text-primary mb-4">
              Questions About Your Privacy?
            </h2>
            <p className="text-audible-text-secondary mb-6">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2 text-sm text-audible-text-secondary">
              <p>📧 privacy@audible.com</p>
              <p>📞 1-888-AUDIBLE (1-888-283-4253)</p>
              <p>📍 Privacy Team, Audible Inc.</p>
            </div>
            <p className="text-sm text-audible-text-secondary mt-4">
              You can also update your privacy preferences in your account settings.
            </p>
          </div>
        </Card>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-audible-text-secondary">
          <p>
            This privacy policy was last updated on {lastUpdated}.
            We will notify you of any material changes to this policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
