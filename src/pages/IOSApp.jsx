import { Link } from 'react-router-dom';
import { Download, Check, Star } from 'lucide-react';
import { PageHeader, Button } from '../components/ui';

/**
 * iOS app: the real app in a phone frame beside the pitch, store facts as
 * numbers, features as a ruled two-by-two, then requirements, privacy and
 * the store details. Screens are captured from the running app.
 */
const features = [
  { title: 'A clear audio experience', description: 'Crystal-clear playback with advanced equalisation settings', details: ['High-quality audio streaming and downloads', 'Customizable playback speed (0.5x to 3.0x)', 'Background playback while using other apps', 'Sleep timer and smart pause features'] },
  { title: 'Offline listening', description: 'Download your favourite titles and listen anywhere', details: ['Unlimited downloads with your subscription', 'Smart download management', 'Automatic sync across devices', 'Background download support'] },
  { title: 'Personalized recommendations', description: 'Discover new titles that fit how you listen', details: ['AI-powered content suggestions', 'Based on your listening history', 'Curated playlists and collections', 'Trending titles and new releases'] },
  { title: 'Advanced playback controls', description: 'Complete control over your listening', details: ['Chapter navigation and bookmarks', 'Variable speed playback', 'Skip silence and boost quiet sections', 'Customizable skip intervals'] },
];

const systemRequirements = [
  { requirement: 'iOS version', value: '13.0 or later' },
  { requirement: 'Device', value: 'iPhone, iPad, iPod touch' },
  { requirement: 'Storage', value: '200 MB free space' },
  { requirement: 'Internet', value: 'Wi-Fi or cellular data' },
];

const appStoreInfo = {
  rating: 4.8,
  reviews: '2.1M+',
  size: '156 MB',
  age: '4+',
  languages: '40+',
  developer: 'Audible, Inc.',
  lastUpdate: 'January 15, 2025',
};

const privacyFeatures = [
  'No tracking of personal listening habits',
  'Secure payment processing',
  'Data encryption in transit and at rest',
  'Privacy controls for social features',
  'Opt-out of personalized recommendations',
];

const whatsNew = ['Improved offline download speeds', 'New social sharing features', 'Enhanced accessibility options', 'Bug fixes and performance improvements'];

const Phone = ({ src, alt, className = '' }) => (
  <div className={`overflow-hidden rounded-[2rem] border-8 border-ink bg-ink shadow-[var(--shadow-cover)] ${className}`}>
    <img src={src} alt={alt} width={390} height={844} loading="lazy" className="block h-auto w-full rounded-[1.5rem]" />
  </div>
);

const StoreButtons = () => (
  <div className="flex flex-wrap gap-3">
    <Button size="lg" variant="primary" leftIcon={<Download className="h-5 w-5" strokeWidth={1.75} />}>Download on the App Store</Button>
    <a href="#requirements" className="inline-flex h-12 items-center rounded-full border border-line-strong px-6 font-medium text-ink hover:bg-surface">System requirements</a>
  </div>
);

const IOSApp = () => (
  <div className="page pb-20">
    {/* Pitch beside the real app */}
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
      <PageHeader
        kicker="iPhone and iPad"
        title="Listenable for iOS"
        description="The whole library on your iPhone and iPad, with your friends and clubs a tap away. Download for free and start your free trial."
      >
        <StoreButtons />
        <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-6 sm:grid-cols-4">
          <div className="flex flex-col">
            <dt className="order-2 t-meta mt-1">App Store rating</dt>
            <dd className="order-1 flex items-center gap-1.5 whitespace-nowrap font-serif text-[1.75rem] font-medium leading-tight text-ink tabular">{appStoreInfo.rating}<Star className="h-5 w-5 fill-ink text-ink" strokeWidth={1.75} aria-hidden="true" /></dd>
          </div>
          <div className="flex flex-col"><dt className="order-2 t-meta mt-1">Reviews</dt><dd className="order-1 whitespace-nowrap font-serif text-[1.75rem] font-medium leading-tight text-ink tabular">{appStoreInfo.reviews}</dd></div>
          <div className="flex flex-col"><dt className="order-2 t-meta mt-1">App size</dt><dd className="order-1 whitespace-nowrap font-serif text-[1.75rem] font-medium leading-tight text-ink tabular">{appStoreInfo.size}</dd></div>
          <div className="flex flex-col"><dt className="order-2 t-meta mt-1">Age rating</dt><dd className="order-1 whitespace-nowrap font-serif text-[1.75rem] font-medium leading-tight text-ink tabular">{appStoreInfo.age}</dd></div>
        </dl>
      </PageHeader>

      <div className="relative mx-auto flex w-full max-w-[26rem] justify-center pb-6 lg:pt-12">
        <Phone src="/images/screens/phone-home.png" alt="Listenable on iPhone: the home screen with Now playing" className="relative z-10 w-[62%]" />
        <Phone src="/images/screens/phone-book.png" alt="Listenable on iPhone: a book page" className="-ml-[18%] mt-12 w-[52%] opacity-95" />
      </div>
    </div>

    {/* Features */}
    <section aria-labelledby="features" className="mt-16 md:mt-24">
      <h2 id="features" className="t-h2 text-ink">Made for iPhone and iPad</h2>
      <div className="mt-8 grid gap-x-12 gap-y-10 md:grid-cols-2">
        {features.map((f) => (
          <div key={f.title} className="border-t border-ink pt-5">
            <h3 className="t-h3 text-ink">{f.title}</h3>
            <p className="mt-1 text-ink-2">{f.description}</p>
            <ul className="mt-4 space-y-2">
              {f.details.map((d) => (
                <li key={d} className="flex items-start gap-2.5 text-[0.9375rem] text-ink-2">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-ink" strokeWidth={2} aria-hidden="true" />{d}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>

    {/* Requirements and privacy */}
    <div className="mt-16 grid gap-12 md:mt-20 lg:grid-cols-2 lg:gap-16">
      <section id="requirements" aria-labelledby="req-title" className="scroll-mt-24">
        <h2 id="req-title" className="t-h2 text-ink">System requirements</h2>
        <dl className="mt-5 divide-y divide-line border-y border-line">
          {systemRequirements.map((r) => (
            <div key={r.requirement} className="flex justify-between gap-4 py-3.5">
              <dt className="font-medium text-ink">{r.requirement}</dt>
              <dd className="text-right text-ink-2">{r.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[0.9375rem] text-ink-2">Optimized for the latest iPhone and iPad models, with smooth performance and battery-efficient playback.</p>
      </section>

      <section aria-labelledby="privacy-title" className="rounded-2xl bg-surface-sunk p-6 md:p-8">
        <h2 id="privacy-title" className="t-h2 text-ink">Privacy and security</h2>
        <p className="mt-2 text-ink-2">Your privacy and security come first. How we protect your data on iOS:</p>
        <ul className="mt-5 space-y-2.5">
          {privacyFeatures.map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-ink">
              <Check className="mt-1 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />{p}
            </li>
          ))}
        </ul>
        <Link to="/privacy" className="mt-6 inline-flex h-11 items-center rounded-full border border-line-strong bg-surface px-5 text-[0.9375rem] font-medium text-ink hover:bg-paper">View full privacy policy</Link>
      </section>
    </div>

    {/* Store details */}
    <section aria-labelledby="store" className="mt-16 md:mt-20">
      <h2 id="store" className="t-h2 text-ink">App Store details</h2>
      <div className="mt-6 grid gap-10 md:grid-cols-2 md:gap-16">
        <dl className="divide-y divide-line border-y border-line">
          {[
            ['Developer', appStoreInfo.developer],
            ['Size', appStoreInfo.size],
            ['Age rating', appStoreInfo.age],
            ['Languages', appStoreInfo.languages],
            ['Last update', appStoreInfo.lastUpdate],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-3">
              <dt className="text-ink-2">{k}</dt>
              <dd className="text-right font-medium text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        <div>
          <h3 className="t-h3 text-ink">What is new in version 3.2.1</h3>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink-2 marker:text-ink-3">
            {whatsNew.map((w) => <li key={w} className="pl-1">{w}</li>)}
          </ul>
        </div>
      </div>
    </section>

    {/* Close */}
    <section aria-labelledby="ready" className="mt-16 flex flex-col gap-6 rounded-2xl border border-line bg-surface p-6 md:mt-20 md:flex-row md:items-center md:justify-between md:p-10">
      <div>
        <h2 id="ready" className="t-h2 text-ink">Ready to start listening?</h2>
        <p className="mt-2 text-ink-2">Download Listenable for iOS and get your first audiobook free with a 30-day trial.</p>
      </div>
      <Button size="lg" variant="highlight" leftIcon={<Download className="h-5 w-5" strokeWidth={1.75} />}>Download on the App Store</Button>
    </section>
  </div>
);

export default IOSApp;
