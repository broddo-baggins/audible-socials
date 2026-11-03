import { useState, useRef } from 'react';
import { Download, Check, Star, ShieldCheck } from 'lucide-react';
import { PageHeader, Button } from '../components/ui';

/**
 * Desktop app: a platform picker (tabs) with the download for the chosen
 * system, the real app in a laptop frame, then features, the requirements
 * table and security notes. The screen is captured from the running app.
 */
const platforms = [
  { id: 'windows', name: 'Windows', versions: '10, 11', requirements: '64-bit processor, 4GB RAM', downloadSize: '85 MB' },
  { id: 'macos', name: 'macOS', versions: '10.14 or later', requirements: 'Intel or Apple Silicon', downloadSize: '92 MB' },
  { id: 'linux', name: 'Linux', versions: 'Ubuntu 18.04+, Fedora 30+, Debian 10+', requirements: '64-bit, glibc 2.27+', downloadSize: '78 MB' },
];

const features = [
  { title: 'High-performance playback', description: 'Professional-grade audio playback with studio-quality sound', details: ['Lossless audio streaming capabilities', 'Advanced audio processing and equalization', 'Multi-channel audio support', 'High-resolution audio output (up to 24-bit/192kHz)', 'Custom audio device selection'] },
  { title: 'Advanced library management', description: 'Tools for organising and managing your audio collection', details: ['Bulk download and management tools', 'Advanced search and filtering options', 'Custom playlists and collections', 'Library statistics and insights', 'Export and backup capabilities'] },
  { title: 'Multi-device sync', description: 'Your place, kept in step across all your devices', details: ['Real-time progress synchronization', 'Bookmark and note syncing', 'Playback preferences across devices', 'Offline content management', 'Cross-platform library access'] },
  { title: 'Keyboard shortcuts and hotkeys', description: 'Full keyboard control for power users', details: ['Customizable keyboard shortcuts', 'Global hotkeys for playback control', 'Quick search and navigation', 'Accessibility keyboard navigation', 'Macro support for advanced users'] },
];

const systemRequirements = [
  { component: 'Operating system', windows: 'Windows 10/11 (64-bit)', mac: 'macOS 10.14+', linux: 'Ubuntu 18.04+/Fedora 30+/Debian 10+' },
  { component: 'Processor', windows: 'Intel Core i3 or equivalent', mac: 'Intel Core i3 or Apple M1', linux: '64-bit x86 or ARM64' },
  { component: 'Memory', windows: '4 GB RAM', mac: '4 GB RAM', linux: '4 GB RAM' },
  { component: 'Storage', windows: '200 MB available space', mac: '200 MB available space', linux: '200 MB available space' },
  { component: 'Internet', windows: 'Broadband connection', mac: 'Broadband connection', linux: 'Broadband connection' },
];

const downloadStats = { rating: 4.9, downloads: '50M+', size: '85-92 MB', lastUpdate: 'January 15, 2025' };

const desktopFeatures = [
  'Native performance optimizations', 'System tray integration', 'Global media key support', 'Customizable UI themes',
  'Advanced audio settings', 'Bulk operations support', 'Offline mode capabilities', 'Multi-monitor support',
];

const security = [
  { title: 'Secure downloads', text: 'All downloads are encrypted and verified for integrity.' },
  { title: 'Local storage', text: 'Your data stays on your device with optional cloud backup.' },
  { title: 'No tracking', text: 'We do not track your listening habits or share personal data.' },
];

const demoNotice = (platform = 'desktop') =>
  `Listenable is an educational demo, so there is no ${platform} app to download. The web app works in your browser.`;

const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const DesktopApp = () => {
  const [platformId, setPlatformId] = useState('windows');
  const [platformNotice, setPlatformNotice] = useState('');
  const [ctaNotice, setCtaNotice] = useState('');
  const tabRefs = useRef([]);
  const platformIndex = platforms.findIndex((p) => p.id === platformId);
  const platform = platforms[platformIndex];

  const onTabKey = (e, i) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (i + dir + platforms.length) % platforms.length;
    setPlatformId(platforms[next].id);
    tabRefs.current[next]?.focus();
  };

  const viewAllPlatforms = () => {
    scrollToSection('platforms');
    tabRefs.current[platformIndex]?.focus({ preventScroll: true });
  };

  return (
    <div className="page pb-20">
      <PageHeader
        kicker="Windows, macOS and Linux"
        title="Listenable for desktop"
        description="All of Listenable on your computer, with high-quality playback, keyboard control and advanced library management."
      />

      {/* Platform picker and the real app */}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-14">
        <section id="platforms" aria-labelledby="platforms-title" className="scroll-mt-24">
          <h2 id="platforms-title" className="sr-only">Choose your platform</h2>
          <div role="tablist" aria-label="Platform" className="flex border-b border-line">
            {platforms.map((p, i) => {
              const selected = p.id === platformId;
              return (
                <button
                  key={p.id}
                  ref={(el) => { tabRefs.current[i] = el; }}
                  role="tab"
                  type="button"
                  id={`tab-${p.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${p.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setPlatformId(p.id)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={`relative h-12 px-4 text-[0.9375rem] font-medium first:pl-0 ${selected ? 'text-ink' : 'text-ink-2 hover:text-ink'}`}
                >
                  {p.name}
                  {selected && <span className={`absolute -bottom-px h-[3px] rounded-full bg-hl ${i === 0 ? 'left-0 right-4' : 'inset-x-4'}`} aria-hidden="true" />}
                </button>
              );
            })}
          </div>
          <div role="tabpanel" id={`panel-${platform.id}`} aria-labelledby={`tab-${platform.id}`} className="pt-6">
            <dl className="divide-y divide-line border-b border-line">
              {[['Versions', platform.versions], ['Requirements', platform.requirements], ['Download size', platform.downloadSize]].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-4 py-3">
                  <dt className="text-ink-2">{k}</dt>
                  <dd className="font-medium text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <Button size="lg" variant="highlight" className="mt-6" leftIcon={<Download className="h-5 w-5" strokeWidth={1.75} />} onClick={() => setPlatformNotice(demoNotice(platform.name))}>
              Download for {platform.name}
            </Button>
            <p role="status" className={platformNotice ? 'mt-3 text-[0.9375rem] text-ink-2' : ''}>{platformNotice}</p>
            <a href="#system-requirements" className="mt-3 block w-fit text-[0.9375rem] font-medium text-ink underline underline-offset-4 decoration-1 hover:decoration-2">Full system requirements</a>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6">
            <div className="flex flex-col">
              <dt className="order-2 t-meta mt-1">User rating</dt>
              <dd className="order-1 flex items-center gap-1.5 font-serif text-[1.75rem] font-medium leading-tight text-ink tabular">{downloadStats.rating}<Star className="h-5 w-5 fill-ink text-ink" strokeWidth={1.75} aria-hidden="true" /></dd>
            </div>
            <div className="flex flex-col"><dt className="order-2 t-meta mt-1">Downloads</dt><dd className="order-1 font-serif text-[1.75rem] font-medium leading-tight text-ink tabular">{downloadStats.downloads}</dd></div>
            <div className="flex flex-col"><dt className="order-2 t-meta mt-1">App size</dt><dd className="order-1 font-serif text-[1.75rem] font-medium leading-tight text-ink tabular">{downloadStats.size}</dd></div>
            <div className="flex flex-col"><dt className="order-2 t-meta mt-1">Platforms</dt><dd className="order-1 font-serif text-[1.75rem] font-medium leading-tight text-ink tabular">{platforms.length}</dd></div>
          </dl>
          <p className="mt-4 text-[0.8125rem] text-ink-3">Last update {downloadStats.lastUpdate}</p>
        </section>

        <figure className="self-start">
          <div className="overflow-hidden rounded-xl border-8 border-ink bg-ink shadow-[var(--shadow-cover)]">
            <img src="/images/screens/desktop-home.png" alt="Listenable on desktop: the home page with Now playing and friends listening" width={1440} height={900} className="block h-auto w-full rounded-[3px]" />
          </div>
          <div className="mx-auto h-3 w-[86%] rounded-b-2xl bg-ink" aria-hidden="true" />
          <figcaption className="mt-4 text-[0.8125rem] text-ink-3">The home page on a 1440 px window, captured from the app.</figcaption>
        </figure>
      </div>

      {/* Features */}
      <section aria-labelledby="features" className="mt-16 md:mt-24">
        <h2 id="features" className="t-h2 text-ink">Desktop-exclusive features</h2>
        <p className="mt-1 text-ink-2">Features only available on desktop.</p>
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

      {/* Requirements table */}
      <section id="system-requirements" aria-labelledby="req-title" className="mt-16 scroll-mt-24 md:mt-20">
        <h2 id="req-title" className="t-h2 text-ink">System requirements</h2>
        <div className="mt-6 overflow-x-auto rounded-lg border border-line bg-surface" tabIndex={0} role="region" aria-label="System requirements table">
          <table className="w-full min-w-[40rem] text-left text-[0.9375rem]">
            <caption className="sr-only">System requirements by platform</caption>
            <thead className="border-b border-line">
              <tr>
                {['Component', 'Windows', 'macOS', 'Linux'].map((h) => <th key={h} scope="col" className="px-4 py-3 text-sm font-semibold text-ink">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {systemRequirements.map((r) => (
                <tr key={r.component}>
                  <th scope="row" className="px-4 py-3 font-medium text-ink">{r.component}</th>
                  <td className="px-4 py-3 text-ink-2">{r.windows}</td>
                  <td className="px-4 py-3 text-ink-2">{r.mac}</td>
                  <td className="px-4 py-3 text-ink-2">{r.linux}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Why desktop, and security */}
      <div className="mt-16 grid gap-12 md:mt-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
        <section aria-labelledby="why" className="rounded-2xl bg-surface-sunk p-6 md:p-8">
          <h2 id="why" className="t-h2 text-ink">Why choose desktop?</h2>
          <p className="mt-2 text-ink-2">The most complete Listenable, with native performance, hardware acceleration and low resource use.</p>
          <ul className="mt-5 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {desktopFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-ink">
                <Check className="mt-1 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />{f}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="security">
          <h2 id="security" className="t-h2 text-ink">Security and privacy</h2>
          <ul className="mt-5 divide-y divide-line border-y border-line">
            {security.map((s) => (
              <li key={s.title} className="flex gap-3 py-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" strokeWidth={1.75} aria-hidden="true" />
                <div>
                  <h3 className="font-semibold text-ink">{s.title}</h3>
                  <p className="text-[0.9375rem] text-ink-2">{s.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section aria-labelledby="ready" className="mt-16 flex flex-col gap-6 rounded-2xl border border-line bg-surface p-6 md:mt-20 md:flex-row md:items-center md:justify-between md:p-10">
        <div>
          <h2 id="ready" className="t-h2 text-ink">Ready for the desktop?</h2>
          <p className="mt-2 text-ink-2">Download Listenable for desktop and keep listening at your desk.</p>
          <p role="status" className={ctaNotice ? 'mt-3 text-[0.9375rem] text-ink-2' : ''}>{ctaNotice}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" variant="primary" leftIcon={<Download className="h-5 w-5" strokeWidth={1.75} />} onClick={() => setCtaNotice(demoNotice(platform.name))}>Download for {platform.name}</Button>
          <Button size="lg" variant="outline" onClick={viewAllPlatforms}>View all platforms</Button>
        </div>
      </section>
    </div>
  );
};

export default DesktopApp;
