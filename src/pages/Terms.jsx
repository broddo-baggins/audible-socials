import React from 'react';
import { Card } from '../components/ui';
import { FileText, Calendar, AlertTriangle } from 'lucide-react';

const Terms = () => {
  const lastUpdated = 'January 15, 2025';

  const sections = [
    {
      title: 'Acceptance of Terms',
      content: [
        'EDUCATIONAL DISCLAIMER: This is a mock educational project ("Listenable") created for academic purposes. This is not a real service and no actual terms apply.',
        'This demonstration showcases social networking features for audiobook platforms. Not affiliated with Audible or Amazon.',
        'By using this demo, you acknowledge this is for educational purposes only.'
      ]
    },
    {
      title: 'Description of Service',
      content: [
        'Listenable demonstrates access to a mock digital library of audiobooks and audio content.',
        'Services include streaming, downloading, and offline access to content, subject to subscription terms.',
        'Content is available through web browsers, mobile applications, and supported devices.',
        'Service availability may vary by region and device compatibility.'
      ]
    },
    {
      title: 'User Accounts',
      content: [
        'You must create an account to access premium features and content.',
        'You are responsible for maintaining the confidentiality of your account credentials.',
        'You agree to provide accurate and complete information during registration.',
        'You must be at least 13 years old to create an account.',
        'One person may not maintain more than one account without permission.'
      ]
    },
    {
      title: 'Subscription and Billing',
      content: [
        'Listenable demonstrates various subscription plan concepts (educational mock only).',
        'Subscriptions automatically renew unless cancelled before the renewal date.',
        'You may cancel your subscription at any time through your account settings.',
        'Refunds are available for eligible purchases within specified timeframes.',
        'Pricing and plans may change with advance notice to subscribers.'
      ]
    },
    {
      title: 'Content Usage Rights',
      content: [
        'Licensed content is for personal, non-commercial use only.',
        'You may not copy, distribute, or create derivative works from licensed content.',
        'Content may include digital rights management (DRM) protections.',
        'License terms vary by content and are specified in individual agreements.',
        'Violations of usage rights may result in account suspension or termination.'
      ]
    },
    {
      title: 'Device and Platform Restrictions',
      content: [
        'Content may be accessed on up to 16 compatible devices per account.',
        'Some content may have additional device or platform restrictions.',
        'This is a demonstration project showing device compatibility concepts.',
        'Unsupported devices may lose access to certain features or content.'
      ]
    },
    {
      title: 'Privacy and Data Collection',
      content: [
        'Your privacy is important to us. Please review our Privacy Policy for details.',
        'We collect information necessary to provide and improve our services.',
        'Personal information is handled in accordance with applicable privacy laws.',
        'You have rights regarding your personal data as outlined in our Privacy Policy.'
      ]
    },
    {
      title: 'Prohibited Activities',
      content: [
        'You may not use the service for any illegal or unauthorized purpose.',
        'Sharing account credentials or circumventing access controls is prohibited.',
        'Reverse engineering, decompiling, or hacking the service is not allowed.',
        'Creating multiple accounts for the same individual is prohibited.',
        'Any attempt to disrupt service operations is strictly forbidden.'
      ]
    },
    {
      title: 'Service Availability and Changes',
      content: [
        'This educational demonstration is provided as-is for academic purposes.',
        'We reserve the right to modify, suspend, or discontinue services with notice.',
        'Content availability may change based on licensing agreements.',
        'Technical support is available for service-related issues.',
        'Emergency maintenance may occur without prior notice.'
      ]
    },
    {
      title: 'Limitation of Liability',
      content: [
        'This is an educational mock project with no actual liability (not a real service).',
        'We are not liable for indirect, incidental, or consequential damages.',
        'Service is provided "as is" without warranties of any kind.',
        'Your sole remedy for dissatisfaction is to discontinue use of the service.',
        'These limitations apply even if Audible has been advised of potential damages.'
      ]
    },
    {
      title: 'Governing Law and Dispute Resolution',
      content: [
        'These terms are governed by the laws of the jurisdiction specified.',
        'Disputes will be resolved through binding arbitration in applicable cases.',
        'You agree to submit to the exclusive jurisdiction of specified courts.',
        'International users may be subject to additional terms and conditions.'
      ]
    },
    {
      title: 'Changes to Terms',
      content: [
        'Audible reserves the right to modify these terms at any time.',
        'Changes will be communicated through the service or via email.',
        'Continued use after changes constitutes acceptance of new terms.',
        'Material changes may require explicit consent from users.',
        'Previous versions of terms remain accessible in our archives.'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-audible-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-audible-orange/10 mb-6 mx-auto">
            <FileText className="w-8 h-8 text-audible-orange" />
          </div>
          <h1 className="text-4xl font-bold text-audible-text-primary mb-4">
            Terms of Service
          </h1>
          <div className="flex items-center justify-center gap-2 text-audible-text-secondary">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Important Notice */}
        <Card padding="lg" className="mb-8 border-audible-orange/20 bg-audible-orange/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-audible-orange flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-bold text-audible-text-primary mb-2">
                Important Notice
              </h2>
              <p className="text-audible-text-secondary text-sm leading-relaxed">
                Please read these Terms of Service carefully before using Audible's services.
                By using our service, you agree to be bound by these terms. If you do not agree
                to these terms, please do not use our service.
              </p>
            </div>
          </div>
        </Card>

        {/* Terms Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <Card key={index} padding="lg">
              <h2 className="text-xl font-bold text-audible-text-primary mb-4">
                {index + 1}. {section.title}
              </h2>
              <div className="space-y-3">
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-audible-text-secondary leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Contact Information */}
        <Card padding="lg" className="mt-12 bg-audible-gray-50">
          <div className="text-center">
            <h2 className="text-xl font-bold text-audible-text-primary mb-4">
              Questions About These Terms?
            </h2>
            <p className="text-audible-text-secondary mb-6">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-sm text-audible-text-secondary">
              <p>📧 legal@audible.com</p>
              <p>📞 1-888-AUDIBLE (1-888-283-4253)</p>
              <p>📍 Legal Department, Audible Inc.</p>
            </div>
          </div>
        </Card>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-audible-text-secondary">
          <p>
            These terms were last updated on {lastUpdated}.
            For previous versions, please contact our legal department.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
