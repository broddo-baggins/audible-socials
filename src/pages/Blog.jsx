import React from 'react';
import { Card, Button } from '../components/ui';
import { BookOpen, Users, TrendingUp, Clock, User, Tag } from 'lucide-react';

const Blog = () => {
  const featuredPost = {
    title: 'The Future of Audio Storytelling: Trends Shaping 2025',
    excerpt: 'Explore the emerging trends in audio entertainment that are revolutionizing how we consume stories and connect with content.',
    author: 'Sarah Chen',
    date: '2025-01-20',
    readTime: '8 min read',
    category: 'Industry Trends',
    image: '/images/blog/audio-future.jpg',
  };

  const recentPosts = [
    {
      title: 'Building Communities Through Shared Listening',
      excerpt: 'How social features are transforming solitary listening into shared experiences.',
      author: 'Mike Rodriguez',
      date: '2025-01-18',
      readTime: '6 min read',
      category: 'Community',
    },
    {
      title: 'The Science of Perfect Audio Production',
      excerpt: 'Behind-the-scenes look at how we create immersive listening experiences.',
      author: 'Emma Thompson',
      date: '2025-01-15',
      readTime: '10 min read',
      category: 'Production',
    },
    {
      title: 'Diversity in Storytelling: Voices That Matter',
      excerpt: 'Celebrating diverse voices and stories that enrich our audio library.',
      author: 'David Kim',
      date: '2025-01-12',
      readTime: '7 min read',
      category: 'Content',
    },
    {
      title: 'Accessibility Innovation in Audio Technology',
      excerpt: 'How we\'re making audio entertainment accessible to everyone.',
      author: 'Lisa Park',
      date: '2025-01-10',
      readTime: '5 min read',
      category: 'Technology',
    },
  ];

  const categories = [
    { name: 'Industry Trends', count: 24, icon: TrendingUp },
    { name: 'Community', count: 18, icon: Users },
    { name: 'Content', count: 32, icon: BookOpen },
    { name: 'Technology', count: 15, icon: TrendingUp },
    { name: 'Production', count: 12, icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-audible-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-audible-text-primary mb-6">
            Audible Blog
          </h1>
          <p className="text-xl text-audible-text-secondary max-w-3xl mx-auto leading-relaxed">
            Insights, stories, and perspectives from the world of audio entertainment.
            Discover what's new in storytelling, technology, and community.
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <Card padding="none" className="overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="h-64 md:h-full bg-gradient-to-br from-audible-orange to-audible-orange/80 flex items-center justify-center">
                  <BookOpen className="w-24 h-24 text-white" />
                </div>
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-audible-orange/10 text-audible-orange text-sm font-medium rounded-full">
                    {featuredPost.category}
                  </span>
                  <span className="text-sm text-audible-text-secondary">
                    {featuredPost.readTime}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-audible-text-primary mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-audible-text-secondary mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-audible-orange rounded-full flex items-center justify-center text-white font-medium">
                    {featuredPost.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-audible-text-primary">
                      {featuredPost.author}
                    </div>
                    <div className="text-sm text-audible-text-secondary">
                      {new Date(featuredPost.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                <Button variant="primary">
                  Read Full Article
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-audible-text-primary mb-6">
            Explore by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.name} padding="lg" className="text-center hover:shadow-md transition-shadow cursor-pointer">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-audible-orange/10 mb-3 mx-auto">
                    <Icon className="w-6 h-6 text-audible-orange" />
                  </div>
                  <h3 className="font-semibold text-audible-text-primary mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-audible-text-secondary">
                    {category.count} posts
                  </p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-audible-text-primary">
              Recent Posts
            </h2>
            <Button variant="outline">
              View All Posts
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {recentPosts.map((post, index) => (
              <Card key={index} padding="lg" className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-audible-orange/10 text-audible-orange text-sm font-medium rounded-full">
                    {post.category}
                  </span>
                  <span className="text-sm text-audible-text-secondary flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-audible-text-primary mb-3">
                  {post.title}
                </h3>
                <p className="text-audible-text-secondary mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-audible-orange rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-audible-text-primary text-sm">
                        {post.author}
                      </div>
                      <div className="text-xs text-audible-text-secondary">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Read More
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="text-center">
          <Card padding="xl" className="bg-gradient-to-r from-audible-orange to-audible-orange/80 text-white">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6 mx-auto">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Never Miss a Story
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Get our latest articles, insights, and audio entertainment news delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-md text-audible-text-primary"
              />
              <Button variant="secondary">
                Subscribe
              </Button>
            </div>
            <p className="text-sm opacity-75 mt-4">
              Join 50,000+ readers. Unsubscribe at any time.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Blog;
