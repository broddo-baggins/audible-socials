import React from 'react';
import { Card, Button } from '../components/ui';
import { Monitor, Download, Star, Shield, Zap, Headphones, Cloud, Settings, CheckCircle, Cpu, HardDrive, Laptop } from 'lucide-react';

const DesktopApp = () => {
  const platforms = [
    {
      name: 'Windows',
      icon: Monitor,
      versions: '10, 11',
      requirements: '64-bit processor, 4GB RAM',
      downloadSize: '85 MB'
    },
    {
      name: 'macOS',
      icon: Laptop,
      versions: '10.14 or later',
      requirements: 'Intel or Apple Silicon',
      downloadSize: '92 MB'
    },
    {
      name: 'Linux',
      icon: Cpu,
      versions: 'Ubuntu 18.04+, Fedora 30+, Debian 10+',
      requirements: '64-bit, glibc 2.27+',
      downloadSize: '78 MB'
    }
  ];

  const features = [
    {
      title: 'High-Performance Playback',
      description: 'Professional-grade audio playback with studio-quality sound',
      icon: Headphones,
      details: [
        'Lossless audio streaming capabilities',
        'Advanced audio processing and equalization',
        'Multi-channel audio support',
        'High-resolution audio output (up to 24-bit/192kHz)',
        'Custom audio device selection'
      ]
    },
    {
      title: 'Advanced Library Management',
      description: 'Powerful tools for organizing and managing your audio collection',
      icon: Settings,
      details: [
        'Bulk download and management tools',
        'Advanced search and filtering options',
        'Custom playlists and collections',
        'Library statistics and insights',
        'Export and backup capabilities'
      ]
    },
    {
      title: 'Multi-Device Sync',
      description: 'Seamless synchronization across all your devices',
      icon: Cloud,
      details: [
        'Real-time progress synchronization',
        'Bookmark and note syncing',
        'Playback preferences across devices',
        'Offline content management',
        'Cross-platform library access'
      ]
    },
    {
      title: 'Keyboard Shortcuts & Hotkeys',
      description: 'Full keyboard control for power users',
      icon: Monitor,
      details: [
        'Customizable keyboard shortcuts',
        'Global hotkeys for playback control',
        'Quick search and navigation',
        'Accessibility keyboard navigation',
        'Macro support for advanced users'
      ]
    }
  ];

  const systemRequirements = [
    { component: 'Operating System', windows: 'Windows 10/11 (64-bit)', mac: 'macOS 10.14+', linux: 'Ubuntu 18.04+/Fedora 30+/Debian 10+' },
    { component: 'Processor', windows: 'Intel Core i3 or equivalent', mac: 'Intel Core i3 or Apple M1', linux: '64-bit x86 or ARM64' },
    { component: 'Memory', windows: '4 GB RAM', mac: '4 GB RAM', linux: '4 GB RAM' },
    { component: 'Storage', windows: '200 MB available space', mac: '200 MB available space', linux: '200 MB available space' },
    { component: 'Internet', windows: 'Broadband connection', mac: 'Broadband connection', linux: 'Broadband connection' }
  ];

  const downloadStats = {
    rating: 4.9,
    downloads: '50M+',
    size: '85-92 MB',
    lastUpdate: 'January 15, 2025'
  };

  const desktopFeatures = [
    'Native performance optimizations',
    'System tray integration',
    'Global media key support',
    'Customizable UI themes',
    'Advanced audio settings',
    'Bulk operations support',
    'Offline mode capabilities',
    'Multi-monitor support'
  ];

  return (
    <div className="min-h-screen bg-audible-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-audible-orange mb-6 mx-auto">
            <Monitor className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-audible-text-primary mb-4">
            Audible for Desktop
          </h1>
          <p className="text-xl text-audible-text-secondary max-w-3xl mx-auto leading-relaxed mb-8">
            Experience Audible's full power on your desktop computer. Download for Windows, macOS, or Linux
            and enjoy professional-grade audio playback and advanced library management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" leftIcon={<Download className="w-5 h-5" />}>
              Download for Your Platform
            </Button>
            <Button variant="outline" size="lg">
              System Requirements
            </Button>
          </div>
        </div>

        {/* Platform Support */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-audible-text-primary mb-4">
              Available for All Major Platforms
            </h2>
            <p className="text-lg text-audible-text-secondary">
              Choose your preferred desktop operating system
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {platforms.map((platform, index) => {
              const Icon = platform.icon;
              return (
                <Card key={index} padding="lg" className="text-center hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-audible-orange/10 mb-4 mx-auto">
                    <Icon className="w-8 h-8 text-audible-orange" />
                  </div>
                  <h3 className="text-xl font-bold text-audible-text-primary mb-2">
                    {platform.name}
                  </h3>
                  <div className="space-y-2 text-sm text-audible-text-secondary mb-4">
                    <p><strong>Versions:</strong> {platform.versions}</p>
                    <p><strong>Requirements:</strong> {platform.requirements}</p>
                    <p><strong>Download Size:</strong> {platform.downloadSize}</p>
                  </div>
                  <Button variant="primary" fullWidth>
                    Download for {platform.name}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Download Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <Card padding="lg" className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="text-2xl font-bold text-audible-text-primary ml-1">
                {downloadStats.rating}
              </span>
            </div>
            <div className="text-sm text-audible-text-secondary">User Rating</div>
          </Card>
          <Card padding="lg" className="text-center">
            <div className="text-2xl font-bold text-audible-orange mb-2">
              {downloadStats.downloads}
            </div>
            <div className="text-sm text-audible-text-secondary">Downloads</div>
          </Card>
          <Card padding="lg" className="text-center">
            <div className="text-2xl font-bold text-audible-text-primary mb-2">
              {downloadStats.size}
            </div>
            <div className="text-sm text-audible-text-secondary">App Size</div>
          </Card>
          <Card padding="lg" className="text-center">
            <div className="text-2xl font-bold text-audible-text-primary mb-2">
              3
            </div>
            <div className="text-sm text-audible-text-secondary">Platforms</div>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-audible-text-primary mb-4">
              Desktop-Exclusive Features
            </h2>
            <p className="text-lg text-audible-text-secondary">
              Take advantage of powerful features only available on desktop
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

        {/* System Requirements Table */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-audible-text-primary mb-8 text-center">
            System Requirements
          </h2>
          <Card padding="lg">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-audible-gray-200">
                    <th className="text-left py-3 font-semibold text-audible-text-primary">Component</th>
                    <th className="text-left py-3 font-semibold text-audible-text-primary">Windows</th>
                    <th className="text-left py-3 font-semibold text-audible-text-primary">macOS</th>
                    <th className="text-left py-3 font-semibold text-audible-text-primary">Linux</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-audible-gray-100">
                  {systemRequirements.map((req, index) => (
                    <tr key={index}>
                      <td className="py-3 font-medium text-audible-text-primary">{req.component}</td>
                      <td className="py-3 text-audible-text-secondary">{req.windows}</td>
                      <td className="py-3 text-audible-text-secondary">{req.mac}</td>
                      <td className="py-3 text-audible-text-secondary">{req.linux}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Desktop-Specific Features */}
        <div className="mb-16">
          <Card padding="xl" className="bg-audible-gray-50">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-audible-orange/10 mb-4 mx-auto">
                <Monitor className="w-8 h-8 text-audible-orange" />
              </div>
              <h2 className="text-3xl font-bold text-audible-text-primary mb-4">
                Why Choose Desktop?
              </h2>
              <p className="text-lg text-audible-text-secondary max-w-3xl mx-auto">
                Our desktop application offers the most comprehensive Audible experience with
                professional-grade features and performance optimizations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {desktopFeatures.map((feature, index) => (
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

        {/* Security & Privacy */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-audible-text-primary mb-6">
                Security & Privacy
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-audible-text-primary">Secure Downloads</h3>
                    <p className="text-sm text-audible-text-secondary">All downloads are encrypted and verified for integrity.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-audible-text-primary">Local Storage</h3>
                    <p className="text-sm text-audible-text-secondary">Your data stays on your device with optional cloud backup.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-audible-text-primary">No Tracking</h3>
                    <p className="text-sm text-audible-text-secondary">We don't track your listening habits or share personal data.</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Card padding="lg" className="bg-gradient-to-br from-audible-orange to-audible-orange/80 text-white">
                <div className="text-center">
                  <Zap className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">
                    Performance Optimized
                  </h3>
                  <p className="opacity-90">
                    Native desktop performance with hardware acceleration,
                    background processing, and minimal system resource usage.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Download CTA */}
        <div className="text-center">
          <Card padding="xl" className="bg-gradient-to-r from-audible-orange to-audible-orange/80 text-white">
            <Monitor className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Ready for the Desktop Experience?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Download Audible for desktop and unlock the full potential of audio entertainment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-audible-orange hover:bg-gray-100" leftIcon={<Download className="w-5 h-5" />}>
                Download Now
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-audible-orange">
                View All Platforms
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DesktopApp;
