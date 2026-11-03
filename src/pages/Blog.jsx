import { useState } from 'react';
import { Clock } from 'lucide-react';
import { useEmailSignup } from '../hooks/useEmailSignup';
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
  body: 'From interactive narratives to social listening rooms, audio is becoming more personal and more shared at the same time.',
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

const DEMO_NOTE = 'The full article is not published in this educational demo.';

const Blog = () => {
  const [category, setCategory] = useState('all');
  const signup = useEmailSignup();
  const [featuredOpen, setFeaturedOpen] = useState(false);
  const [openPost, setOpenPost] = useState(null);
  const [notice, setNotice] = useState('');

  const posts = category === 'all' ? recentPosts : recentPosts.filter((p) => p.category === category);

  const viewAllPosts = () => {
    setCategory('all');
    setNotice(`All ${recentPosts.length} recent posts are shown below.`);
  };

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
          {featuredOpen && (
            <p id="featured-article-body" className="mt-4 text-[1.0625rem] leading-[1.7] text-ink-2 max-w-[56ch]">
              {featuredPost.body} {DEMO_NOTE}
            </p>
          )}
          <div className="mt-6 flex items-center gap-3">
            <Avatar name={featuredPost.author} size="md" />
            <div>
              <p className="font-medium text-ink">{featuredPost.author}</p>
              <time dateTime={featuredPost.date} className="t-meta">{formatDate(featuredPost.date)}</time>
            </div>
          </div>
          <Button
            variant="primary"
            className="mt-8"
            onClick={() => setFeaturedOpen(!featuredOpen)}
            aria-expanded={featuredOpen}
            aria-controls="featured-article-body"
          >
            {featuredOpen ? 'Show less' : 'Read full article'}
          </Button>
        </div>
        <div className="flex items-center border-t border-line bg-surface-sunk p-6 md:p-10 lg:border-l lg:border-t-0">
          <Waveform seed={featuredPost.title} bars={40} height={96} className="h-28 w-full text-ink" />
        </div>
      </article>

      {/* Categories filter the list */}
      <section aria-labelledby="recent" className="mt-16 md:mt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="recent" className="t-h2 text-ink">Recent posts</h2>
          <Button variant="outline" onClick={viewAllPosts}>View all posts</Button>
        </div>
        <p role="status" className={notice ? 'mt-3 text-[0.9375rem] text-ink-2' : ''}>{notice}</p>

        <div role="group" aria-label="Filter by category" className="mt-5 flex flex-wrap gap-2">
          {[{ name: 'all', label: 'All posts' }, ...categories.map((c) => ({ ...c, label: c.name }))].map((c) => {
            const selected = category === c.name;
            return (
              <button
                key={c.name}
                type="button"
                aria-pressed={selected}
                onClick={() => { setCategory(c.name); setNotice(''); }}
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
            {posts.map((post) => {
              const index = recentPosts.indexOf(post);
              const open = openPost === index;
              return (
                <li key={post.title} className="grid gap-3 py-6 md:grid-cols-[minmax(0,1fr)_14rem] md:gap-10">
                  <div>
                    <p className="text-sm font-semibold text-ink-2">{post.category}</p>
                    <h3 className="mt-1 font-serif text-xl font-medium leading-snug text-ink md:text-2xl">{post.title}</h3>
                    <p className="mt-2 text-ink-2 max-w-[60ch]">{post.excerpt}</p>
                    {open && (
                      <p id={`post-body-${index}`} className="mt-2 text-ink-2 max-w-[60ch]">
                        {`By ${post.author}. ${DEMO_NOTE}`}
                      </p>
                    )}
                    <Button
                      variant="link"
                      className="mt-3"
                      onClick={() => setOpenPost(open ? null : index)}
                      aria-expanded={open}
                      aria-controls={`post-body-${index}`}
                      aria-label={`${open ? 'Show less' : 'Read more'}: ${post.title}`}
                    >
                      {open ? 'Show less' : 'Read more'}
                    </Button>
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
              );
            })}
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
            <form
              onSubmit={signup.submit}
              noValidate
              className="flex flex-col gap-3 sm:flex-row sm:items-start"
            >
              <Input
                type="email"
                label="Email address"
                placeholder="you@example.com"
                hint="Join 50,000+ readers. Unsubscribe at any time."
                value={signup.email}
                onChange={(e) => signup.setEmail(e.target.value)}
                autoComplete="email"
                fullWidth
                containerClassName="flex-1"
              />
              <Button type="submit" variant="primary" className="sm:mt-[1.6875rem]">Subscribe</Button>
            </form>
            <p role="status" className={signup.message ? 'mt-3 font-medium text-ink' : ''}>{signup.message}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
