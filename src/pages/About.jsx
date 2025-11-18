import React from 'react';
import { Card } from '../components/ui';
import { Headphones, Users, BookOpen, Globe } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Headphones, label: 'Hours Listened', value: '2.1B+', description: 'Total listening hours' },
    { icon: Users, label: 'Active Members', value: '50M+', description: 'Worldwide subscribers' },
    { icon: BookOpen, label: 'Titles Available', value: '425K+', description: 'Audiobooks and podcasts' },
    { icon: Globe, label: 'Countries', value: '180+', description: 'Available worldwide' },
  ];

  const values = [
    {
      title: 'Accessibility',
      description: 'Making storytelling accessible to everyone, everywhere, through innovative audio technology.',
      icon: Headphones,
    },
    {
      title: 'Community',
      description: 'Building connections through shared listening experiences and social features.',
      icon: Users,
    },
    {
      title: 'Innovation',
      description: 'Pushing the boundaries of audio entertainment with cutting-edge technology.',
      icon: BookOpen,
    },
    {
      title: 'Global Reach',
      description: 'Bringing diverse stories and voices from around the world to listeners everywhere.',
      icon: Globe,
    },
  ];

  return (
    <div className="min-h-screen bg-audible-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-audible-text-primary mb-6">
            About Audible
          </h1>
          <p className="text-xl text-audible-text-secondary max-w-3xl mx-auto leading-relaxed">
            We're revolutionizing the way people experience stories. Through our innovative audio platform,
            we're making literature, education, and entertainment accessible to millions worldwide.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} padding="lg" className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-audible-orange/10 mb-4 mx-auto">
                  <Icon className="w-8 h-8 text-audible-orange" />
                </div>
                <div className="text-3xl font-bold text-audible-text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-audible-text-primary mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-audible-text-secondary">
                  {stat.description}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <Card padding="xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-audible-text-primary mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-audible-text-secondary max-w-4xl mx-auto leading-relaxed">
                To connect people with the stories that matter most to them. Whether it's escaping into a gripping novel,
                learning something new, or discovering the next great podcast, we believe everyone deserves access to
                extraordinary audio experiences that enrich their lives and expand their perspectives.
              </p>
            </div>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-audible-text-primary mb-4">
              Our Values
            </h2>
            <p className="text-lg text-audible-text-secondary max-w-3xl mx-auto">
              The principles that guide everything we do at Audible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} padding="lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-audible-orange/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-audible-orange" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-audible-text-primary mb-2">
                        {value.title}
                      </h3>
                      <p className="text-audible-text-secondary leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <Card padding="xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-audible-text-primary mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-audible-text-secondary leading-relaxed">
                  <p>
                    Founded with a simple belief: that stories have the power to change lives.
                    What started as a small team passionate about audiobooks has grown into
                    a global platform connecting millions with their next great listen.
                  </p>
                  <p>
                    Today, we continue to innovate and expand our offerings, from bestselling
                    audiobooks to exclusive originals and engaging podcasts. We're not just
                    delivering content – we're creating experiences that inspire, educate,
                    and entertain.
                  </p>
                  <p>
                    Join us in our mission to make every moment an opportunity for discovery
                    and connection through the power of audio.
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="w-64 h-64 mx-auto bg-audible-orange/10 rounded-full flex items-center justify-center">
                  <Headphones className="w-32 h-32 text-audible-orange" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
