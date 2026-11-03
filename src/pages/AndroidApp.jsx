import { useState } from 'react';
import { Download, Check, Star } from 'lucide-react';
import { PageHeader, Button } from '../components/ui';

/**
 * Android app: the real app in a phone frame, the Play facts as numbers,
 * features as a ruled two-by-two, ecosystem notes, requirements and the
 * store details. Screens are captured from the running app.
 */
const DEMO_NOTICE = 'Listenable is an educational demo, so there is no Android app to download. The web app works in your browser.';

const features = [
  { title: 'Universal Android support', description: 'Works on phones, tablets and Android TV devices', details: ['Compatible with Android 7.0 and above', 'Optimized for phones and tablets', 'Android TV app for big screens', 'Chrome OS support for Chromebooks'] },
  { title: 'Smart downloads', description: 'Download management for offline listening', details: ['Wi-Fi-only download options', 'Automatic quality optimization', 'Storage management tools', 'Background download support'] },
  { title: 'Google Assistant integration', description: 'Control playback with voice commands', details: ['Play, pause and skip with voice', 'Ask for recommendations', 'Control playback speed', 'Search your library hands-free'] },
  { title: 'Material Design experience', description: 'An intuitive interface that follows Android design principles', details: ['Adaptive theming (light and dark mode)', 'Gesture controls and navigation', 'Customizable home screen widgets', 'Consistent with the Android ecosystem'] },
];

const systemRequirements = [
  { requirement: 'Android version', value: '7.0 or later' },
  { requirement: 'Device', value: 'Phone, tablet, or Android TV' },
  { requirement: 'Storage', value: '200 MB free space' },
  { requirement: 'RAM', value: '2 GB minimum' },
  { requirement: 'Google Play Services', value: 'Required' },
];

const playStoreInfo = {
  rating: 4.7,
  reviews: '1.8M+',
  size: '142 MB',
  installs: '100M+',
  age: 'Mature',
  languages: '40+',
  developer: 'Audible, Inc.',
  lastUpdate: 'January 15, 2025',
};

const androidFeatures = [
  'Google Play Protect certified',
  'End-to-end encrypted data transmission',
  'Secure payment processing',
  'Privacy controls for all Android versions',
  'Battery optimization for extended listening',
  'Works with Android Auto for car playback',
];

const recentUpdates = ['Enhanced Android TV support', 'Improved Google Assistant integration', 'New Material You theming', 'Performance optimizations', 'Android 14 compatibility'];

const Phone = ({ src, alt, className = '' }) => (
  <div className={`overflow-hidden rounded-[2rem] border-8 border-ink bg-ink shadow-[var(--shadow-cover)] ${className}`}>
    <img src={src} alt={alt} width={390} height={844} loading="lazy" className="block h-auto w-full rounded-[1.5rem]" />
  </div>
);

const AndroidApp = () => {
  const [heroNotice, setHeroNotice] = useState('');
  const [ctaNotice, setCtaNotice] = useState('');

  return (
    <div className="page pb-20">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <PageHeader
            kicker="Phones, tablets and Android TV"
            title="Listenable for Android"
            description="All of Listenable on your Android device. Get it on Google Play, with the Assistant, Android Auto and widgets built in."
          >
            <div className="flex flex-wrap gap-3">
              <Button size="lg" variant="primary" leftIcon={<Download className="h-5 w-5" strokeWidth={1.75} />} onClick={() => setHeroNotice(DEMO_NOTICE)}>Get it on Google Play</Button>
              <a href="#system-requirements" className="inline-flex h-12 items-center rounded-full border border-line-strong px-6 font-medium text-ink hover:bg-surface">System requirements</a>
            </div>
            <p role="status" className={heroNotice ? 'mt-3 text-[0.9375rem] text-ink-2' : ''}>{heroNotice}</p>
          </PageHeader>

          <dl className="grid grid-cols-2 border-y border-line sm:grid-cols-4">
            {[
              ['Play Store rating', <span key="r" className="inline-flex items-center gap-1.5">{playStoreInfo.rating}<Star className="h-5 w-5 fill-ink text-ink" strokeWidth={1.75} aria-hidden="true" /></span>],
              ['Reviews', playStoreInfo.reviews],
              ['Installs', playStoreInfo.installs],
              ['Content rating', playStoreInfo.age],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col py-5 pr-4">
                <dt className="order-2 t-meta mt-1">{label}</dt>
                <dd className="order-1 whitespace-nowrap font-serif text-[1.75rem] font-medium leading-tight text-ink tabular">{value}</dd>
              </div>
            ))}
          </dl>

          {/* Features beside the phone at desktop */}
          <section id="app-features" aria-labelledby="features" className="mt-14 scroll-mt-24">
            <h2 id="features" className="t-h2 text-ink">Built for Android</h2>
            <p className="mt-1 text-ink-2">Native Android features, connected to the rest of your devices.</p>
            <div className="mt-6 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {features.map((f) => (
                <div key={f.title} className="border-t border-ink pt-4">
                  <h3 className="t-h3 text-ink">{f.title}</h3>
                  <p className="mt-1 text-[0.9375rem] text-ink-2">{f.description}</p>
                  <ul className="mt-3 space-y-1.5">
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
        </div>

        <div className="order-first mx-auto w-full max-w-[18rem] lg:order-none lg:sticky lg:top-24 lg:mt-12 lg:max-w-[20rem]">
          <Phone src="/images/screens/phone-home.png" alt="Listenable on an Android phone: the home screen with Now playing" />
          <p className="mt-4 text-center t-meta">The home screen, captured from the app.</p>
        </div>
      </div>

      {/* Ecosystem and requirements */}
      <div className="mt-16 grid gap-12 md:mt-20 lg:grid-cols-2 lg:gap-16">
        <section aria-labelledby="eco" className="rounded-2xl bg-surface-sunk p-6 md:p-8">
          <h2 id="eco" className="t-h2 text-ink">Android ecosystem integration</h2>
          <p className="mt-2 text-ink-2">Battery-saving features, background processing and integration with Google services.</p>
          <ul className="mt-5 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {androidFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-ink">
                <Check className="mt-1 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />{f}
              </li>
            ))}
          </ul>
        </section>

        <section id="system-requirements" aria-labelledby="req-title" className="scroll-mt-24">
          <h2 id="req-title" className="t-h2 text-ink">System requirements</h2>
          <dl className="mt-5 divide-y divide-line border-y border-line">
            {systemRequirements.map((r) => (
              <div key={r.requirement} className="flex justify-between gap-4 py-3.5">
                <dt className="font-medium text-ink">{r.requirement}</dt>
                <dd className="text-right text-ink-2">{r.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {/* Store details */}
      <section aria-labelledby="store" className="mt-16 md:mt-20">
        <h2 id="store" className="t-h2 text-ink">Google Play details</h2>
        <div className="mt-6 grid gap-10 md:grid-cols-2 md:gap-16">
          <dl className="divide-y divide-line border-y border-line">
            {[
              ['Developer', playStoreInfo.developer],
              ['Size', playStoreInfo.size],
              ['Installs', playStoreInfo.installs],
              ['Content rating', playStoreInfo.age],
              ['Languages', playStoreInfo.languages],
              ['Last update', playStoreInfo.lastUpdate],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-3">
                <dt className="text-ink-2">{k}</dt>
                <dd className="text-right font-medium text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <div>
            <h3 className="t-h3 text-ink">Recent updates in version 3.2.0</h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink-2 marker:text-ink-3">
              {recentUpdates.map((u) => <li key={u} className="pl-1">{u}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="ready" className="mt-16 flex flex-col gap-6 rounded-2xl border border-line bg-surface p-6 md:mt-20 md:flex-row md:items-center md:justify-between md:p-10">
        <div>
          <h2 id="ready" className="t-h2 text-ink">Ready for Android?</h2>
          <p className="mt-2 text-ink-2">Download Listenable for Android and get your first audiobook free with a 30-day trial.</p>
          <p role="status" className={ctaNotice ? 'mt-3 text-[0.9375rem] text-ink-2' : ''}>{ctaNotice}</p>
        </div>
        <Button size="lg" variant="highlight" leftIcon={<Download className="h-5 w-5" strokeWidth={1.75} />} onClick={() => setCtaNotice(DEMO_NOTICE)}>Get it on Google Play</Button>
      </section>
    </div>
  );
};

export default AndroidApp;
