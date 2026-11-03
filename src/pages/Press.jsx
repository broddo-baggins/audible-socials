import { useState } from 'react';
import { Download, ExternalLink, Mail, Phone } from 'lucide-react';
import { useEmailSignup } from '../hooks/useEmailSignup';
import { PageHeader, Button, Badge, Input } from '../components/ui';

/**
 * Press: a newsroom. The latest release leads large, earlier ones follow as a
 * dated list, the media kit is a file list, contacts are two plain columns and
 * the newsletter is one inline form.
 */
const pressReleases = [
  {
    title: 'Listenable launches social listening features',
    date: '2025-01-15',
    excerpt: 'New social features let listeners connect, share and discuss their favourite audiobooks with friends and communities.',
    category: 'Product launch',
  },
  {
    title: 'Listenable reaches 50 million subscribers worldwide',
    date: '2024-12-08',
    excerpt: 'The milestone marks significant growth and leadership in audio entertainment.',
    category: 'Company news',
  },
  {
    title: 'Partnership with leading authors for exclusive audio originals',
    date: '2024-11-22',
    excerpt: 'A new partnership brings exclusive audio from bestselling authors to subscribers.',
    category: 'Partnership',
  },
  {
    title: 'Listenable expands to 180+ countries',
    date: '2024-10-10',
    excerpt: 'International expansion brings diverse audio content to listeners worldwide.',
    category: 'Expansion',
  },
];

const mediaKit = [
  { name: 'Company logo (high resolution)', type: 'PNG, SVG', size: '2.5 MB' },
  { name: 'Brand guidelines', type: 'PDF', size: '15 MB' },
  { name: 'Product screenshots', type: 'ZIP', size: '45 MB' },
  { name: 'Executive photos', type: 'ZIP', size: '120 MB' },
  { name: 'Press release template', type: 'DOCX', size: '500 KB' },
];

const stats = [
  { label: 'Years in business', value: '20+' },
  { label: 'Global subscribers', value: '50M+' },
  { label: 'Available titles', value: '425K+' },
  { label: 'Countries served', value: '180+' },
];

const contacts = [
  { title: 'Press office', note: 'For general inquiries and press releases', email: 'press@audible.com', phone: '+1 (555) 123-4567' },
  { title: 'Media partnerships', note: 'For partnership opportunities and collaborations', email: 'partnerships@audible.com', phone: '+1 (555) 987-6543' },
];

const formatDate = (iso, month = 'long') =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month, day: 'numeric' });

const RELEASE_NOTE = 'The full release is not published in this educational demo. Media contacts are listed below.';

const Press = () => {
  const signup = useEmailSignup();
  const [openRelease, setOpenRelease] = useState(null);
  const [releasesNotice, setReleasesNotice] = useState('');
  const [kitNotice, setKitNotice] = useState('');
  const [lead, ...earlier] = pressReleases;

  // Props for a release's toggle; index is its place in pressReleases. The
  // name starts with the visible label so speech users can say what they see.
  const releaseToggle = (release, index, label) => ({
    onClick: () => setOpenRelease(openRelease === index ? null : index),
    'aria-expanded': openRelease === index,
    'aria-controls': `release-body-${index}`,
    'aria-label': `${label}: ${release.title}`,
  });

  return (
    <div className="page pb-20">
      <PageHeader
        title="Press center"
        description="The latest news, press releases and resources about Listenable and its work in audio and storytelling."
        actions={<a href="#media-inquiries" className="inline-flex h-11 items-center rounded-full border border-line-strong px-5 text-[0.9375rem] font-medium text-ink hover:bg-surface">Media contacts</a>}
      />

      {/* Facts at a glance */}
      <dl className="grid grid-cols-2 gap-y-6 border-y border-line py-6 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col">
            <dt className="order-2 t-meta mt-1">{s.label}</dt>
            <dd className="order-1 t-h1 tabular text-ink">{s.value}</dd>
          </div>
        ))}
      </dl>

      {/* Releases: one lead, the rest as a dated list */}
      <section aria-labelledby="releases" className="mt-16 md:mt-20">
        <h2 id="releases" className="t-h2 text-ink">Latest press releases</h2>
        <article className="mt-6 grid gap-6 rounded-2xl border border-line bg-surface p-6 md:p-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-12">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="highlight">{lead.category}</Badge>
              <time dateTime={lead.date} className="t-meta">{formatDate(lead.date)}</time>
            </div>
            <h3 className="mt-4 font-serif text-[1.75rem] font-medium leading-tight text-ink md:text-[2.25rem]">{lead.title}</h3>
          </div>
          <div className="flex flex-col items-start gap-5 lg:pt-10">
            <p className="text-[1.0625rem] leading-[1.7] text-ink-2">{lead.excerpt}</p>
            {openRelease === 0 && (
              <p id="release-body-0" className="text-[1.0625rem] leading-[1.7] text-ink-2">{RELEASE_NOTE}</p>
            )}
            <Button variant="primary" rightIcon={<ExternalLink className="h-4 w-4" strokeWidth={1.75} />} {...releaseToggle(lead, 0, 'Read full release')}>Read full release</Button>
          </div>
        </article>

        <ul className="mt-8 divide-y divide-line border-y border-line">
          {earlier.map((release, i) => {
            const index = i + 1;
            return (
              <li key={release.title} className="grid gap-2 py-6 md:grid-cols-[10rem_minmax(0,1fr)_auto] md:items-start md:gap-8">
                <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-2">
                  <time dateTime={release.date} className="text-sm font-medium text-ink tabular">{formatDate(release.date, 'short')}</time>
                  <span className="t-meta">{release.category}</span>
                </div>
                <div>
                  <h3 className="t-h3 text-ink">{release.title}</h3>
                  <p className="mt-1 text-ink-2 max-w-[60ch]">{release.excerpt}</p>
                  {openRelease === index && (
                    <p id={`release-body-${index}`} className="mt-2 text-ink-2 max-w-[60ch]">{RELEASE_NOTE}</p>
                  )}
                </div>
                <Button variant="link" className="justify-start self-start md:mt-0.5" rightIcon={<ExternalLink className="h-4 w-4" strokeWidth={1.75} />} {...releaseToggle(release, index, 'Read release')}>
                  Read release
                </Button>
              </li>
            );
          })}
        </ul>
        <div className="mt-6">
          <Button variant="outline" onClick={() => setReleasesNotice(`All ${pressReleases.length} press releases are shown above.`)}>View all press releases</Button>
          <p role="status" className={releasesNotice ? 'mt-3 text-[0.9375rem] text-ink-2' : ''}>{releasesNotice}</p>
        </div>
      </section>

      {/* Media kit as a file list */}
      <section aria-labelledby="media-kit" className="mt-16 grid gap-8 md:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12">
        <div>
          <h2 id="media-kit" className="t-h2 text-ink">Media kit and resources</h2>
          <p className="mt-2 text-[0.9375rem] text-ink-2 max-w-[40ch]">Logos, guidelines, screenshots and photos for editorial use.</p>
        </div>
        <div>
          <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
            {mediaKit.map((item) => (
              <li key={item.name} className="flex items-center gap-4 px-4 py-4 md:px-5">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-ink">{item.name}</p>
                  <p className="t-meta mt-0.5">{item.type} · {item.size}</p>
                </div>
                <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" strokeWidth={1.75} />} aria-label={`Download ${item.name}`} onClick={() => setKitNotice(`${item.name} is not available for download in this demo.`)}>
                  Download
                </Button>
              </li>
            ))}
          </ul>
          <p role="status" className={kitNotice ? 'mt-3 text-[0.9375rem] text-ink-2' : ''}>{kitNotice}</p>
        </div>
      </section>

      {/* Contacts */}
      <section id="media-inquiries" aria-labelledby="inquiries" className="mt-16 scroll-mt-24 md:mt-20">
        <h2 id="inquiries" className="t-h2 text-ink">Media inquiries</h2>
        <p className="mt-2 text-[0.9375rem] text-ink-2 max-w-[60ch]">For press inquiries, interview requests or media partnerships, contact our press team.</p>
        <div className="mt-6 grid gap-x-12 md:grid-cols-2">
          {contacts.map((c) => (
            <div key={c.title} className="border-t border-ink py-5">
              <h3 className="t-h3 text-ink">{c.title}</h3>
              <p className="mt-1 text-ink-2">{c.note}</p>
              <ul className="mt-4 space-y-2 text-[0.9375rem]">
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-ink-3" strokeWidth={1.75} aria-hidden="true" />
                  <a href={`mailto:${c.email}`} className="link">{c.email}</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-ink-3" strokeWidth={1.75} aria-hidden="true" />
                  <a href={`tel:${c.phone.replace(/[^+\d]/g, '')}`} className="link tabular">{c.phone}</a>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section aria-labelledby="stay-updated" className="mt-16 rounded-2xl bg-surface-sunk p-6 md:mt-20 md:p-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-end lg:gap-12">
          <div>
            <h2 id="stay-updated" className="t-h2 text-ink">Stay updated</h2>
            <p className="mt-2 text-ink-2">Get the latest Listenable news and announcements in your inbox.</p>
          </div>
          <div>
            <form onSubmit={signup.submit} noValidate className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <Input
                type="email"
                label="Email address"
                placeholder="you@example.com"
                value={signup.email}
                onChange={(e) => signup.setEmail(e.target.value)}
                autoComplete="email"
                fullWidth
                containerClassName="flex-1"
              />
              <Button type="submit" variant="primary">Subscribe</Button>
            </form>
            <p role="status" className={signup.message ? 'mt-3 font-medium text-ink' : ''}>{signup.message}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Press;
