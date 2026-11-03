import { Link } from 'react-router-dom';
import { PageHeader, Waveform } from '../components/ui';

/**
 * About: an editorial page. A disclaimer stated once, the mission as a lead
 * paragraph, the numbers as a ruled row, values as a numbered list and the
 * story as a two-column essay. No cards, no icon tiles.
 */
const stats = [
  { label: 'Hours listened', value: '2.1B+', description: 'Total listening hours' },
  { label: 'Active members', value: '50M+', description: 'Worldwide subscribers' },
  { label: 'Titles available', value: '425K+', description: 'Audiobooks and podcasts' },
  { label: 'Countries', value: '180+', description: 'Available worldwide' },
];

const values = [
  { title: 'Accessibility', description: 'Making storytelling accessible to everyone, everywhere, through audio technology that works for every listener.' },
  { title: 'Community', description: 'Building connections through shared listening experiences and social features.' },
  { title: 'Innovation', description: 'Pushing what audio entertainment can do, with technology that serves the story.' },
  { title: 'Global reach', description: 'Bringing diverse stories and voices from around the world to listeners everywhere.' },
];

const About = () => (
  <div className="page pb-20">
    <PageHeader
      title="About Listenable"
      description="This platform shows how social features can change the audiobook experience. It was made for academic purposes, to study social networking inside an audiobook service."
    />

    <p className="rounded-lg border border-line bg-surface-sunk px-4 py-3 text-[0.9375rem] text-ink-2">
      <span className="font-semibold text-ink">Educational mock project.</span> Not affiliated with Audible or Amazon.
    </p>

    {/* Mission as a lead paragraph */}
    <section aria-labelledby="mission" className="mt-16 grid gap-6 md:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:gap-12">
      <h2 id="mission" className="t-h2 text-ink">Our mission</h2>
      <p className="font-serif text-[1.375rem] leading-[1.5] text-ink md:text-[1.625rem]">
        To connect people with the stories that matter most to them. Whether it is escaping into a gripping novel,
        learning something new or discovering the next great podcast, we believe everyone deserves access to
        extraordinary audio that enriches their lives and <span className="mark">widens their perspective</span>.
      </p>
    </section>

    {/* Numbers on a rule */}
    <section aria-label="Listenable in numbers" className="mt-16 border-y border-line md:mt-20">
      <dl className="grid grid-cols-2 gap-px bg-line lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col bg-paper py-8 pr-4 [&:nth-child(even)]:pl-4 lg:[&:not(:first-child)]:pl-6">
            <dt className="order-2 mt-2 text-[0.9375rem] font-semibold text-ink">{stat.label}</dt>
            <dd className="order-1 t-h1 tabular text-ink">{stat.value}</dd>
            <dd className="order-3 t-meta mt-0.5">{stat.description}</dd>
          </div>
        ))}
      </dl>
    </section>

    {/* Values as a numbered list */}
    <section aria-labelledby="values" className="mt-16 md:mt-20">
      <div className="max-w-2xl">
        <h2 id="values" className="t-h2 text-ink">Our values</h2>
        <p className="mt-2 text-[0.9375rem] text-ink-2">The principles that guide this educational project.</p>
      </div>
      <ol className="mt-8 grid border-t border-line md:grid-cols-2 md:gap-x-12">
        {values.map((value, i) => (
          <li key={value.title} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-2 border-b border-line py-6">
            <span className="font-serif text-lg text-ink-3 tabular" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3 className="t-h3 text-ink">{value.title}</h3>
              <p className="mt-1.5 text-ink-2 max-w-[48ch]">{value.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>

    {/* Story: an essay beside a quiet waveform */}
    <section aria-labelledby="story" className="mt-16 grid gap-10 md:mt-20 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
      <div>
        <h2 id="story" className="t-h2 text-ink">Our story</h2>
        <div className="mt-5 max-w-[64ch] space-y-4 text-[1.0625rem] leading-[1.7] text-ink-2">
          <p>
            It started with a simple belief: that stories have the power to change lives. What began as a small team
            passionate about audiobooks grew into a platform connecting millions with their next great listen.
          </p>
          <p>
            Today we keep expanding what we offer, from bestselling audiobooks to exclusive originals and podcasts.
            We are not only delivering content; we are making experiences that inspire, educate and entertain.
          </p>
          <p>
            Join us in making every moment a chance for discovery and connection through audio.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/careers" className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-[0.9375rem] font-medium text-paper hover:bg-gray-800">Work with us</Link>
          <Link to="/press" className="inline-flex h-11 items-center rounded-full border border-line-strong px-5 text-[0.9375rem] font-medium text-ink hover:bg-surface">Press center</Link>
        </div>
      </div>
      <figure className="self-start rounded-2xl border border-line bg-surface p-6 md:p-8">
        <Waveform seed="about-listenable" bars={44} height={72} progress={0.62} playedClassName="text-ink" className="h-20 w-full text-ink" />
        <figcaption className="mt-5 text-[0.9375rem] text-ink-2">
          Every book, club and listener on Listenable has its own waveform. The filled part is what has been heard so far.
        </figcaption>
      </figure>
    </section>
  </div>
);

export default About;
