import React, { useState } from 'react';
import { Card, Button } from '../components/ui';
import { Mail, Phone, MessageCircle, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: '',
      });
      setIsSubmitted(false);
    }, 3000);
  };

  const contactMethods = [
    {
      title: 'Email Support',
      description: 'Send us a detailed message',
      icon: Mail,
      contact: 'support@audible.com',
      response: 'Response within 24 hours',
      action: 'Send Email',
    },
    {
      title: 'Phone Support',
      description: 'Speak with a specialist',
      icon: Phone,
      contact: '1-888-AUDIBLE (1-888-283-4253)',
      response: 'Mon-Fri 9AM-6PM EST',
      action: 'Call Now',
    },
    {
      title: 'Live Chat',
      description: 'Get instant help online',
      icon: MessageCircle,
      contact: 'Available 24/7',
      response: 'Instant response',
      action: 'Start Chat',
    },
  ];

  const offices = [
    {
      city: 'New York',
      address: '123 Audio Street, New York, NY 10001',
      phone: '+1 (555) 123-4567',
      email: 'nyc@audible.com',
    },
    {
      city: 'San Francisco',
      address: '456 Sound Avenue, San Francisco, CA 94102',
      phone: '+1 (555) 987-6543',
      email: 'sf@audible.com',
    },
    {
      city: 'London',
      address: '789 Listening Lane, London EC1A 1BB',
      phone: '+44 20 1234 5678',
      email: 'london@audible.com',
    },
  ];

  const categories = [
    'Account & Billing',
    'Technical Support',
    'Content Questions',
    'Partnerships',
    'Press Inquiries',
    'General Feedback',
    'Other',
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-audible-white flex items-center justify-center">
        <Card padding="xl" className="max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6 mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-audible-text-primary mb-4">
            Message Sent!
          </h2>
          <p className="text-audible-text-secondary mb-6">
            Thank you for contacting us. We've received your message and will get back to you within 24 hours.
          </p>
          <Button onClick={() => setIsSubmitted(false)} variant="primary">
            Send Another Message
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-audible-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-audible-text-primary mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-audible-text-secondary max-w-3xl mx-auto leading-relaxed">
            Have a question, need support, or want to share feedback? We're here to help.
            Choose the best way to get in touch with our team.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div>
            <Card padding="lg">
              <h2 className="text-2xl font-bold text-audible-text-primary mb-6">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-audible-text-primary mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-audible-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-audible-orange focus:border-audible-orange"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-audible-text-primary mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-audible-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-audible-orange focus:border-audible-orange"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-audible-text-primary mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-audible-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-audible-orange focus:border-audible-orange"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-audible-text-primary mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-audible-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-audible-orange focus:border-audible-orange"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-audible-text-primary mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-3 py-2 border border-audible-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-audible-orange focus:border-audible-orange resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <Button type="submit" variant="primary" fullWidth rightIcon={<Send className="w-4 h-4" />}>
                  Send Message
                </Button>
              </form>
            </Card>
          </div>

          {/* Contact Methods */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-audible-text-primary mb-6">
              Other Ways to Reach Us
            </h2>

            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <Card key={index} padding="lg" className="hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-audible-orange/10 rounded-full flex items-center justify-center">
                        <Icon className="w-6 h-6 text-audible-orange" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-audible-text-primary mb-1">
                        {method.title}
                      </h3>
                      <p className="text-audible-text-secondary mb-2">
                        {method.description}
                      </p>
                      <p className="text-sm font-medium text-audible-text-primary mb-1">
                        {method.contact}
                      </p>
                      <p className="text-sm text-audible-text-secondary mb-4">
                        {method.response}
                      </p>
                      <Button variant="outline" size="sm">
                        {method.action}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Office Locations */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-audible-text-primary mb-4">
              Our Offices
            </h2>
            <p className="text-lg text-audible-text-secondary">
              Visit us at one of our global locations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <Card key={index} padding="lg" className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-audible-orange/10 mb-4 mx-auto">
                  <MapPin className="w-6 h-6 text-audible-orange" />
                </div>
                <h3 className="text-xl font-bold text-audible-text-primary mb-2">
                  {office.city}
                </h3>
                <p className="text-audible-text-secondary mb-3">
                  {office.address}
                </p>
                <div className="space-y-1 text-sm text-audible-text-secondary">
                  <p>📞 {office.phone}</p>
                  <p>📧 {office.email}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Business Hours */}
        <div className="text-center">
          <Card padding="lg" className="bg-audible-gray-50 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-audible-orange/10 mb-4 mx-auto">
              <Clock className="w-8 h-8 text-audible-orange" />
            </div>
            <h2 className="text-2xl font-bold text-audible-text-primary mb-4">
              Business Hours
            </h2>
            <div className="space-y-2 text-audible-text-secondary">
              <p className="font-medium">
                Customer Support: Monday - Friday, 9:00 AM - 6:00 PM EST
              </p>
              <p>
                Live Chat: 24 hours a day, 7 days a week
              </p>
              <p>
                Email: Response within 24 hours during business days
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
