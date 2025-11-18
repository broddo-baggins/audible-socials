import React from 'react';
import { Card, Button } from '../components/ui';
import { Newspaper, Camera, Download, ExternalLink, Calendar, Users } from 'lucide-react';

const Press = () => {
  const pressReleases = [
    {
      title: 'Audible Launches Revolutionary Social Listening Features',
      date: '2025-01-15',
      excerpt: 'New social features allow listeners to connect, share, and discuss their favorite audiobooks with friends and communities.',
      category: 'Product Launch',
    },
    {
      title: 'Audible Reaches 50 Million Subscribers Worldwide',
      date: '2024-12-08',
      excerpt: 'Milestone achievement marks significant growth in audio entertainment industry leadership.',
      category: 'Company News',
    },
    {
      title: 'Partnership with Leading Authors for Exclusive Audio Originals',
      date: '2024-11-22',
      excerpt: 'New partnership brings exclusive audio content from bestselling authors to Audible subscribers.',
      category: 'Partnership',
    },
    {
      title: 'Audible Expands Global Reach to 180+ Countries',
      date: '2024-10-10',
      excerpt: 'International expansion brings diverse audio content to listeners worldwide.',
      category: 'Expansion',
    },
  ];

  const mediaKit = [
    { name: 'Company Logo (High Resolution)', type: 'PNG, SVG', size: '2.5 MB' },
    { name: 'Brand Guidelines', type: 'PDF', size: '15 MB' },
    { name: 'Product Screenshots', type: 'ZIP', size: '45 MB' },
    { name: 'Executive Photos', type: 'ZIP', size: '120 MB' },
    { name: 'Press Release Template', type: 'DOCX', size: '500 KB' },
  ];

  const stats = [
    { label: 'Years in Business', value: '20+' },
    { label: 'Global Subscribers', value: '50M+' },
    { label: 'Available Titles', value: '425K+' },
    { label: 'Countries Served', value: '180+' },
  ];

  return (
    <div className="min-h-screen bg-audible-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-audible-text-primary mb-6">
            Press Center
          </h1>
          <p className="text-xl text-audible-text-secondary max-w-3xl mx-auto leading-relaxed">
            Get the latest news, press releases, and resources about Audible's mission to
            revolutionize audio entertainment and storytelling.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat) => (
            <Card key={stat.label} padding="lg" className="text-center">
              <div className="text-4xl font-bold text-audible-orange mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-audible-text-primary">
                {stat.label}
              </div>
            </Card>
          ))}
        </div>

        {/* Press Releases Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Newspaper className="w-8 h-8 text-audible-orange" />
            <h2 className="text-3xl font-bold text-audible-text-primary">
              Latest Press Releases
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {pressReleases.map((release, index) => (
              <Card key={index} padding="lg" className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <span className="px-3 py-1 bg-audible-orange/10 text-audible-orange text-sm font-medium rounded-full">
                    {release.category}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-audible-text-secondary">
                    <Calendar className="w-4 h-4" />
                    {new Date(release.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-audible-text-primary mb-3">
                  {release.title}
                </h3>
                <p className="text-audible-text-secondary mb-4 leading-relaxed">
                  {release.excerpt}
                </p>
                <Button variant="outline" size="sm" rightIcon={<ExternalLink className="w-4 h-4" />}>
                  Read Full Release
                </Button>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="primary">
              View All Press Releases
            </Button>
          </div>
        </div>

        {/* Media Kit Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Camera className="w-8 h-8 text-audible-orange" />
            <h2 className="text-3xl font-bold text-audible-text-primary">
              Media Kit & Resources
            </h2>
          </div>

          <Card padding="lg">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaKit.map((item, index) => (
                <div key={index} className="border border-audible-gray-200 rounded-lg p-6 hover:border-audible-orange transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-audible-text-primary">
                      {item.name}
                    </h3>
                    <Download className="w-5 h-5 text-audible-orange flex-shrink-0" />
                  </div>
                  <div className="text-sm text-audible-text-secondary mb-4">
                    Type: {item.type} • Size: {item.size}
                  </div>
                  <Button variant="outline" size="sm" fullWidth>
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Contact Section */}
        <div className="mb-16">
          <Card padding="xl" className="bg-audible-gray-50">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-audible-orange/10 mb-4">
                <Users className="w-8 h-8 text-audible-orange" />
              </div>
              <h2 className="text-3xl font-bold text-audible-text-primary mb-4">
                Media Inquiries
              </h2>
              <p className="text-lg text-audible-text-secondary max-w-2xl mx-auto">
                For press inquiries, interview requests, or media partnerships, please contact our press team.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <h3 className="text-xl font-bold text-audible-text-primary mb-2">
                  Press Office
                </h3>
                <p className="text-audible-text-secondary mb-4">
                  For general inquiries and press releases
                </p>
                <div className="space-y-2 text-sm text-audible-text-secondary">
                  <p>📧 press@audible.com</p>
                  <p>📞 +1 (555) 123-4567</p>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold text-audible-text-primary mb-2">
                  Media Partnerships
                </h3>
                <p className="text-audible-text-secondary mb-4">
                  For partnership opportunities and collaborations
                </p>
                <div className="space-y-2 text-sm text-audible-text-secondary">
                  <p>📧 partnerships@audible.com</p>
                  <p>📞 +1 (555) 987-6543</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Newsletter Signup */}
        <div className="text-center">
          <Card padding="xl" className="bg-gradient-to-r from-audible-orange to-audible-orange/80 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Stay Updated
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Get the latest Audible news and announcements delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-md text-audible-text-primary"
              />
              <Button variant="secondary">
                Subscribe
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Press;
