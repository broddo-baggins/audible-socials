import React from 'react';
import { Card, Button } from '../components/ui';
import { Users, Heart, Zap, Target, MapPin, Clock } from 'lucide-react';

const Careers = () => {
  const benefits = [
    {
      title: 'Work-Life Balance',
      description: 'Flexible schedules and remote work options to help you thrive both personally and professionally.',
      icon: Clock,
    },
    {
      title: 'Health & Wellness',
      description: 'Comprehensive health benefits, mental health support, and wellness programs.',
      icon: Heart,
    },
    {
      title: 'Growth & Learning',
      description: 'Continuous learning opportunities, mentorship programs, and career development support.',
      icon: Zap,
    },
    {
      title: 'Inclusive Culture',
      description: 'A diverse and inclusive workplace where everyone can bring their authentic selves to work.',
      icon: Users,
    },
  ];

  const departments = [
    { name: 'Engineering', openings: 12, description: 'Build the future of audio entertainment' },
    { name: 'Product', openings: 8, description: 'Shape user experiences and product strategy' },
    { name: 'Design', openings: 6, description: 'Create beautiful and intuitive interfaces' },
    { name: 'Marketing', openings: 10, description: 'Tell our story and grow our community' },
    { name: 'Content', openings: 15, description: 'Curate and produce amazing audio content' },
    { name: 'Operations', openings: 7, description: 'Keep everything running smoothly' },
  ];

  const locations = [
    'New York, NY', 'San Francisco, CA', 'Austin, TX', 'Seattle, WA',
    'London, UK', 'Berlin, Germany', 'Toronto, Canada', 'Sydney, Australia'
  ];

  return (
    <div className="min-h-screen bg-audible-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-audible-text-primary mb-6">
            Join Our Team
          </h1>
          <p className="text-xl text-audible-text-secondary max-w-3xl mx-auto leading-relaxed">
            Help us revolutionize the way people experience stories. We're looking for passionate,
            creative, and driven individuals who want to make a real impact in the audio entertainment industry.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card padding="lg" className="text-center">
            <div className="text-4xl font-bold text-audible-orange mb-2">500+</div>
            <div className="text-lg font-semibold text-audible-text-primary mb-1">Team Members</div>
            <div className="text-sm text-audible-text-secondary">Across the globe</div>
          </Card>
          <Card padding="lg" className="text-center">
            <div className="text-4xl font-bold text-audible-orange mb-2">50+</div>
            <div className="text-lg font-semibold text-audible-text-primary mb-1">Open Positions</div>
            <div className="text-sm text-audible-text-secondary">Waiting for you</div>
          </Card>
          <Card padding="lg" className="text-center">
            <div className="text-4xl font-bold text-audible-orange mb-2">95%</div>
            <div className="text-lg font-semibold text-audible-text-primary mb-1">Employee Satisfaction</div>
            <div className="text-sm text-audible-text-secondary">Love working here</div>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-audible-text-primary mb-4">
              Why Work at Audible?
            </h2>
            <p className="text-lg text-audible-text-secondary max-w-3xl mx-auto">
              We're committed to creating an environment where you can do your best work and live your best life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title} padding="lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-audible-orange/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-audible-orange" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-audible-text-primary mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-audible-text-secondary leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Departments Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-audible-text-primary mb-4">
              Open Positions by Department
            </h2>
            <p className="text-lg text-audible-text-secondary max-w-3xl mx-auto">
              Find your perfect role in our diverse and growing team.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <Card key={dept.name} padding="lg" className="hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-audible-text-primary">
                    {dept.name}
                  </h3>
                  <span className="px-3 py-1 bg-audible-orange text-white text-sm font-medium rounded-full">
                    {dept.openings} openings
                  </span>
                </div>
                <p className="text-audible-text-secondary mb-4">
                  {dept.description}
                </p>
                <Button variant="outline" size="sm">
                  View Positions
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Locations Section */}
        <div className="mb-16">
          <Card padding="xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-audible-text-primary mb-4">
                Global Offices
              </h2>
              <p className="text-lg text-audible-text-secondary max-w-3xl mx-auto">
                Work from anywhere or join us at one of our offices around the world.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {locations.map((location) => (
                <div key={location} className="flex items-center gap-2 p-4 bg-audible-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-audible-orange flex-shrink-0" />
                  <span className="text-audible-text-primary font-medium">
                    {location}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card padding="xl" className="bg-gradient-to-r from-audible-orange to-audible-orange/80 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Make an Impact?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join us in our mission to transform how the world experiences stories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg">
                View All Openings
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-audible-orange">
                Learn More About Us
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Careers;
