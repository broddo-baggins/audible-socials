import { useState } from 'react';
import { Clock, Check } from 'lucide-react';
import { PageHeader, Button, Avatar, Waveform, Input, EmptyState } from '../components/ui';

/**
 * Blog: a magazine front. The featured story is set large with its own
 * waveform, categories filter the list below, and recent posts are a ruled
 * list with author and reading time.
 */
const featuredPost = {
  title: 'The future of audio storytelling: trends shaping 2025',
  excerpt: 'The emerging trends in audio entertainment that are changing how we take in stories and connect with them.',
  author: 'Sarah Chen',
  date: '2025-01-20',
  readTime: '8 min read',
  category: 'Industry Trends',
  image: '/images/blog/audio-future.jpg',
};

const recentPosts = [
  { title: 'Building communities through shared listening', excerpt: 'How social features are turning solitary listening into shared experiences.', author: 'Mike Rodriguez', date: '2025-01-18', readTime: '6 min read', category: 'Community' },
  { title: 'The science of perfect audio production', excerpt: 'Behind the scenes of how we make immersive listening experiences.', author: 'Emma Thompson', date: '2025-01-15', readTime: '10 min read', category: 'Production' },
  { title: 'Diversity in storytelling: voices that matter', excerpt: 'Celebrating diverse voices and stories that enrich our audio library.', author: 'David Kim', date: '2025-01-12', readTime: '7 min read', category: 'Content' },
  { title: 'Accessibility innovation in audio technology', excerpt: 'How we are making audio entertainment accessible to everyone.', author: 'Lisa Park', date: '2025-01-10', readTime: '5 min read', category: 'Technology' },
];

const categories = [
  { name: 'Industry Trends', count: 24 },
  { name: 'Community', count: 18 },
  { name: 'Content', count: 32 },
  { name: 'Technology', count: 15 },
  { name: 'Production', count: 12 },
];

const formatDate = (iso, month = 'long') =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month, day: 'numeric' });

const Blog = () => {
  const [category, setCategory] = useState('all');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const posts = category === 'all' ? recentPosts : recentPosts.filter((p) => p.category === category);

  return (
    <div className="page pb-20">
      <PageHeader
        title="Listenable blog"
        description="Insights, stories and perspectives from the world of audio. What is new in storytelling, technology and community."
      />

      {/* Featured story */}
      <article className="grid overflow-hidden rounded-2xl border border-line bg-surface lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="p-6 md:p-10">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="font-semibold text-ink">{featuredPost.category}</span>
            <span className="text-ink-3" aria-hidden="true">·</span>
            <span className="text-ink-3">{featuredPost.readTime}</span>
          </p>
          <h2 className="mt-4 font-serif text-[1.875rem] font-medium leading-[1.12] text-ink md:text-[2.5rem]">{featuredPost.title}</h2>
          <p className="mt-4 text-[1.0625rem] leading-[1.7] text-ink-2 max-w-[56ch]">{featuredPost.excerpt}</p>
          <div className="mt-6 flex items-center gap-3">
            <Avatar name={featuredPost.author} size="md" />
            <div>
              <p className="font-medium text-ink">{featuredPost.author}</p>
              <time dateTime={featuredPost.date} className="t-meta">{formatDate(featuredPost.date)}</time>
            </div>
          </div>
          <Button variant="primary" className="mt-8">Read full article</Button>
        </div>
        <div className="flex items-center border-t border-line bg-surface-sunk p-6 md:p-10 lg:border-l lg:border-t-0">
          <Waveform seed={featuredPost.title} bars={40} height={96} className="h-28 w-full text-ink" />
        </div>
      </article>

      {/* Categories filter the list */}
      <section aria-labelledby="recent" className="mt-16 md:mt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="recent" className="t-h2 text-ink">Recent posts</h2>
          <Button variant="outline">View all posts</Button>
        </div>

        <div role="group" aria-label="Filter by category" className="mt-5 flex flex-wrap gap-2">
          {[{ name: 'all', label: 'All posts' }, ...categories.map((c) => ({ ...c, label: c.name }))].map((c) => {
            const selected = category === c.name;
            return (
              <button
                key={c.name}
                type="button"
                aria-pressed={selected}
                onClick={() => setCategory(c.name)}
                className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-[0.9375rem] font-medium transition-colors ${selected ? 'bg-hl text-ink' : 'border border-line-strong text-ink hover:bg-surface'}`}
              >
                {c.label}
                {c.count != null && <span className="text-[0.8125rem] text-ink-2 tabular">{c.count}</span>}
              </button>
            );
          })}
        </div>

        {posts.length === 0 ? (
          <EmptyState
            className="mt-6"
            title="No recent posts in this category"
            description="Older posts in this category are in the archive."
            action="Show all posts"
            onAction={() => setCategory('all')}
          />
        ) : (
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {posts.map((post) => (
              <li key={post.title} className="grid gap-3 py-6 md:grid-cols-[minmax(0,1fr)_14rem] md:gap-10">
                <div>
                  <p className="text-sm font-semibold text-ink-2">{post.category}</p>
                  <h3 className="mt-1 font-serif text-xl font-medium leading-snug text-ink md:text-2xl">{post.title}</h3>
                  <p className="mt-2 text-ink-2 max-w-[60ch]">{post.excerpt}</p>
                  <Button variant="link" className="mt-3" aria-label={`Read more: ${post.title}`}>Read more</Button>
                </div>
                <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-2 md:pt-6">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={post.author} size="sm" />
                    <span className="text-sm font-medium text-ink">{post.author}</span>
                  </div>
                  <p className="t-meta flex items-center gap-1.5">
                    <time dateTime={post.date}>{formatDate(post.date, 'short')}</time>
                    <span aria-hidden="true">·</span>
                    <Clock className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                    {post.readTime}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Newsletter */}
      <section aria-labelledby="newsletter" className="mt-16 border-t border-ink pt-8 md:mt-20">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-12">
          <div>
            <h2 id="newsletter" className="t-h2 text-ink">Never miss a story</h2>
            <p className="mt-2 text-ink-2">Our latest articles, insights and audio news in your inbox.</p>
          </div>
          <div>
            {subscribed ? (
              <p role="status" className="flex items-center gap-2 font-medium text-success">
                <Check className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" /> Subscribed. The next post will reach your inbox.
              </p>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true); }}
                className="flex flex-col gap-3 sm:flex-row sm:items-start"
              >
                <Input
                  type="email"
                  label="Email address"
                  placeholder="you@example.com"
                  hint="Join 50,000+ readers. Unsubscribe at any time."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  fullWidth
                  containerClassName="flex-1"
                />
                <Button type="submit" variant="primary" className="sm:mt-[1.6875rem]">Subscribe</Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
