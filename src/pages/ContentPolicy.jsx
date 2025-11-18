import React from 'react';
import { Card } from '../components/ui';
import { BookOpen, Shield, Users, AlertTriangle, Calendar, CheckCircle, XCircle } from 'lucide-react';

const ContentPolicy = () => {
  const lastUpdated = 'January 15, 2025';

  const contentGuidelines = [
    {
      title: 'Original Content Creation',
      icon: BookOpen,
      description: 'Guidelines for creating and publishing original audio content on our platform',
      rules: [
        'All content must be original or properly licensed',
        'Creators must have rights to publish submitted material',
        'Content should respect intellectual property rights',
        'Proper attribution required for adapted works',
        'No plagiarism or unauthorized copying of existing works'
      ]
    },
    {
      title: 'Community Standards',
      icon: Users,
      description: 'Standards for user-generated content and community interactions',
      rules: [
        'Respectful and inclusive language in all communications',
        'No harassment, discrimination, or hate speech',
        'Appropriate content for diverse audiences',
        'Accurate and truthful information sharing',
        'Constructive feedback and reviews encouraged'
      ]
    },
    {
      title: 'Content Moderation',
      icon: Shield,
      description: 'How we moderate content to maintain a safe and enjoyable platform',
      rules: [
        'Automated systems and human review for content screening',
        'Community reporting system for inappropriate content',
        'Fair and transparent moderation processes',
        'Appeals process for content removal decisions',
        'Regular updates to moderation guidelines'
      ]
    },
    {
      title: 'Prohibited Content',
      icon: AlertTriangle,
      description: 'Types of content that are not allowed on our platform',
      rules: [
        'Illegal activities, instructions, or encouragement',
        'Hate speech, discrimination, or harassment',
        'Misinformation and conspiracy theories',
        'Spam, scams, or deceptive content',
        'Copyright infringement or unauthorized material'
      ]
    }
  ];

  const contentCategories = [
    {
      category: 'Audiobooks',
      guidelines: [
        'Must be properly licensed or in public domain',
        'Narration quality standards must be met',
        'Accurate representation of original work',
        'Appropriate content ratings and warnings',
        'Regular quality checks and updates'
      ]
    },
    {
      category: 'Podcasts',
      guidelines: [
        'Clear disclosure of sponsorships and advertising',
        'Fact-checking for informational content',
        'Proper music licensing for included tracks',
        'Content warnings for sensitive topics',
        'Regular publishing schedule expectations'
      ]
    },
    {
      category: 'User Reviews',
      guidelines: [
        'Honest and genuine opinions only',
        'No fake or incentivized reviews',
        'Constructive criticism encouraged',
        'No personal attacks or inappropriate language',
        'One review per user per title'
      ]
    },
    {
      category: 'Social Features',
      guidelines: [
        'Respectful discussions and debates',
        'No spamming or repetitive content',
        'Privacy considerations for shared information',
        'Appropriate use of tags and categories',
        'Community guidelines must be followed'
      ]
    }
  ];

  const enforcementActions = [
    {
      action: 'Content Warning',
      description: 'First offense - content flagged with warning',
      icon: AlertTriangle,
      severity: 'Low'
    },
    {
      action: 'Content Removal',
      description: 'Content violating policy removed from platform',
      icon: XCircle,
      severity: 'Medium'
    },
    {
      action: 'Account Suspension',
      description: 'Temporary suspension for repeated violations',
      icon: AlertTriangle,
      severity: 'High'
    },
    {
      action: 'Account Termination',
      description: 'Permanent ban for severe or repeated violations',
      icon: XCircle,
      severity: 'Critical'
    }
  ];

  const appealProcess = [
    'Submit appeal within 30 days of decision',
    'Provide detailed explanation and evidence',
    'Review by content moderation team',
    'Decision communicated within 7 business days',
    'Right to further appeal if unsatisfied'
  ];

  return (
    <div className="min-h-screen bg-audible-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-audible-orange/10 mb-6 mx-auto">
            <BookOpen className="w-8 h-8 text-audible-orange" />
          </div>
          <h1 className="text-4xl font-bold text-audible-text-primary mb-4">
            Content Policy
          </h1>
          <div className="flex items-center justify-center gap-2 text-audible-text-secondary">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Introduction */}
        <Card padding="lg" className="mb-8">
          <p className="text-audible-text-secondary leading-relaxed mb-4">
            At Audible, we are committed to providing a safe, respectful, and enjoyable platform for
            audio entertainment. Our Content Policy outlines the standards and guidelines that govern
            all content on our platform, including user-generated content, reviews, and community interactions.
          </p>
          <p className="text-audible-text-secondary leading-relaxed">
            This policy applies to all users, creators, and content on the Audible platform. By using
            our services, you agree to comply with these guidelines. We reserve the right to remove
            content and take enforcement actions as described below.
          </p>
        </Card>

        {/* Content Guidelines */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-audible-text-primary mb-6">
            Content Guidelines
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {contentGuidelines.map((guideline, index) => {
              const Icon = guideline.icon;
              return (
                <Card key={index} padding="lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-audible-orange/10 rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-audible-orange" />
                    </div>
                    <h3 className="font-bold text-audible-text-primary">
                      {guideline.title}
                    </h3>
                  </div>
                  <p className="text-audible-text-secondary text-sm mb-4">
                    {guideline.description}
                  </p>
                  <ul className="space-y-2">
                    {guideline.rules.map((rule, ruleIndex) => (
                      <li key={ruleIndex} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-audible-text-secondary">
                          {rule}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Content Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-audible-text-primary mb-6">
            Category-Specific Guidelines
          </h2>
          <div className="space-y-6">
            {contentCategories.map((category, index) => (
              <Card key={index} padding="lg">
                <h3 className="text-lg font-bold text-audible-text-primary mb-4">
                  {category.category}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {category.guidelines.map((guideline, gIndex) => (
                    <div key={gIndex} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-audible-text-secondary">
                        {guideline}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Enforcement Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-audible-text-primary mb-6">
            Enforcement Actions
          </h2>
          <Card padding="lg">
            <p className="text-audible-text-secondary mb-6">
              We take violations of our Content Policy seriously. Depending on the severity and frequency
              of violations, we may take the following enforcement actions:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {enforcementActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <div key={index} className="flex items-start gap-3 p-4 border border-audible-gray-200 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      action.severity === 'Low' ? 'bg-yellow-100' :
                      action.severity === 'Medium' ? 'bg-orange-100' :
                      action.severity === 'High' ? 'bg-red-100' : 'bg-red-200'
                    }`}>
                      <Icon className={`w-4 h-4 ${
                        action.severity === 'Low' ? 'text-yellow-600' :
                        action.severity === 'Medium' ? 'text-orange-600' :
                        action.severity === 'High' ? 'text-red-600' : 'text-red-700'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-audible-text-primary mb-1">
                        {action.action}
                      </h4>
                      <p className="text-sm text-audible-text-secondary mb-2">
                        {action.description}
                      </p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        action.severity === 'Low' ? 'bg-yellow-100 text-yellow-700' :
                        action.severity === 'Medium' ? 'bg-orange-100 text-orange-700' :
                        action.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-red-200 text-red-800'
                      }`}>
                        {action.severity} Severity
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Appeals Process */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-audible-text-primary mb-6">
            Appeals Process
          </h2>
          <Card padding="lg">
            <p className="text-audible-text-secondary mb-6">
              If you believe content was removed in error or an enforcement action was taken unfairly,
              you have the right to appeal the decision:
            </p>
            <div className="space-y-4">
              {appealProcess.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-audible-orange text-white text-sm rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-audible-text-secondary">
                    {step}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-audible-orange/10 rounded-lg">
              <p className="text-sm text-audible-text-secondary">
                <strong>Contact:</strong> For appeals and content policy questions, email
                content-policy@audible.com or visit our Support Center.
              </p>
            </div>
          </Card>
        </div>

        {/* Reporting Content */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-audible-text-primary mb-6">
            Reporting Violations
          </h2>
          <Card padding="lg" className="bg-gradient-to-r from-audible-orange to-audible-orange/80 text-white">
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-4">
                Help Keep Our Community Safe
              </h3>
              <p className="mb-6 opacity-90">
                If you encounter content that violates our policies, please report it immediately.
                All reports are reviewed by our moderation team within 24 hours.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold mb-2">Report Content</div>
                  <p>Use the "Report" button on any piece of content</p>
                </div>
                <div className="text-center">
                  <div className="font-semibold mb-2">Contact Support</div>
                  <p>Email content-policy@audible.com</p>
                </div>
                <div className="text-center">
                  <div className="font-semibold mb-2">Emergency</div>
                  <p>For immediate threats: emergency@audible.com</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Policy Updates */}
        <Card padding="lg" className="bg-audible-gray-50">
          <h2 className="text-xl font-bold text-audible-text-primary mb-4">
            Policy Updates
          </h2>
          <p className="text-audible-text-secondary mb-4">
            We regularly review and update our Content Policy to ensure it reflects our community standards
            and legal requirements. Major changes will be communicated to users in advance.
          </p>
          <div className="flex items-center gap-2 text-sm text-audible-text-secondary">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ContentPolicy;
