import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { PageHeader, Button } from '../components/ui';

/**
 * Careers: a jobs board, not a brochure. Numbers sit under the title, open
 * roles are a ruled table by department, benefits a two-by-two list, offices
 * a plain column list, and one closing block.
 */
const benefits = [
  { title: 'Work-life balance', description: 'Flexible schedules and remote work options to help you thrive personally and professionally.' },
  { title: 'Health and wellness', description: 'Comprehensive health benefits, mental health support and wellness programs.' },
  { title: 'Growth and learning', description: 'Continuous learning, mentorship programs and career development support.' },
  { title: 'Inclusive culture', description: 'A diverse and inclusive workplace where everyone can bring their whole self to work.' },
];

const departments = [
  { name: 'Engineering', openings: 12, description: 'Build the future of audio entertainment' },
  { name: 'Product', openings: 8, description: 'Shape user experiences and product strategy' },
  { name: 'Design', openings: 6, description: 'Create clear and intuitive interfaces' },
  { name: 'Marketing', openings: 10, description: 'Tell our story and grow our community' },
  { name: 'Content', openings: 15, description: 'Curate and produce audio worth listening to' },
  { name: 'Operations', openings: 7, description: 'Keep everything running smoothly' },
];

const locations = [
  'New York, NY', 'San Francisco, CA', 'Austin, TX', 'Seattle, WA',
  'London, UK', 'Berlin, Germany', 'Toronto, Canada', 'Sydney, Australia',
];

const stats = [
  { value: '500+', label: 'Team members', note: 'Across the globe' },
  { value: '50+', label: 'Open positions', note: 'Waiting for you' },
  { value: '95%', label: 'Employee satisfaction', note: 'Love working here' },
];

const scrollToRoles = () => {
  document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const Careers = () => {
  const [selectedDept, setSelectedDept] = useState(null);

  return (
    <div className="page pb-20">
      <PageHeader
        title="Join our team"
        description="Help us change the way people experience stories. We are looking for curious, creative and driven people who want to make a real difference in audio."
        actions={<Button onClick={scrollToRoles} rightIcon={<ArrowRight className="h-4 w-4" strokeWidth={1.75} />}>See open roles</Button>}
      >
        <dl className="flex flex-wrap gap-x-12 gap-y-6 border-t border-line pt-6">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col">
              <dt className="order-2 mt-1 text-sm font-semibold text-ink">{s.label}</dt>
              <dd className="order-1 t-h1 tabular text-ink">{s.value}</dd>
              <dd className="order-3 t-meta">{s.note}</dd>
            </div>
          ))}
        </dl>
      </PageHeader>

      {/* Open roles as a table */}
      <section id="open-positions" aria-labelledby="roles-title" className="mt-10 scroll-mt-24 md:mt-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="roles-title" className="t-h2 text-ink">Open positions by department</h2>
            <p className="mt-1 text-[0.9375rem] text-ink-2">Find your role in a diverse and growing team.</p>
          </div>
          <p className="t-meta">{departments.reduce((n, d) => n + d.openings, 0)} openings in {departments.length} departments</p>
        </div>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {departments.map((dept) => (
            <li key={dept.name} className="flex flex-col gap-3 py-5 md:grid md:grid-cols-[12rem_minmax(0,1fr)_7rem_auto] md:items-center md:gap-6">
              <div className="flex items-baseline justify-between gap-4 md:block">
                <h3 className="font-serif text-xl font-medium text-ink">{dept.name}</h3>
                <p className="text-sm text-ink-2 tabular md:hidden"><span className="font-semibold text-ink">{dept.openings}</span> openings</p>
              </div>
              <p className="text-[0.9375rem] text-ink-2">{dept.description}</p>
              <p className="hidden text-sm text-ink-2 tabular md:block md:text-right"><span className="font-semibold text-ink">{dept.openings}</span> openings</p>
              <Button
                variant="outline"
                size="sm"
                className="self-start"
                aria-label={`View positions: ${dept.name}`}
                onClick={() => setSelectedDept(dept)}
              >
                View positions
              </Button>
            </li>
          ))}
        </ul>
        <p role="status" className={selectedDept ? 'mt-4 text-[0.9375rem] text-ink-2' : ''}>
          {selectedDept && `${selectedDept.name}: ${selectedDept.openings} openings. This is an educational demo, so there are no real job applications.`}
        </p>
      </section>

      {/* Benefits: two by two, ruled */}
      <section aria-labelledby="why" className="mt-16 grid gap-8 md:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12">
        <div>
          <h2 id="why" className="t-h2 text-ink">Why work at Listenable</h2>
          <p className="mt-2 text-[0.9375rem] text-ink-2 max-w-[40ch]">We are committed to a place where you can do your best work and live your best life.</p>
        </div>
        <dl className="grid gap-x-10 sm:grid-cols-2">
          {benefits.map((b) => (
            <div key={b.title} className="border-t border-ink py-5">
              <dt className="t-h3 text-ink">{b.title}</dt>
              <dd className="mt-1.5 text-ink-2">{b.description}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Offices */}
      <section aria-labelledby="offices" className="mt-16 md:mt-20">
        <h2 id="offices" className="t-h2 text-ink">Global offices</h2>
        <p className="mt-1 text-[0.9375rem] text-ink-2">Work from anywhere, or join us at one of our offices.</p>
        <ul className="mt-6 grid grid-cols-1 gap-x-8 border-t border-line xs:grid-cols-2 md:grid-cols-4">
          {locations.map((location) => (
            <li key={location} className="flex items-center gap-2.5 border-b border-line py-3.5 text-ink">
              <MapPin className="h-4 w-4 shrink-0 text-ink-3" strokeWidth={1.75} aria-hidden="true" />
              {location}
            </li>
          ))}
        </ul>
      </section>

      {/* Closing block */}
      <section aria-labelledby="impact" className="mt-16 flex flex-col gap-6 rounded-2xl border border-line bg-surface p-6 md:mt-20 md:flex-row md:items-center md:justify-between md:p-10">
        <div>
          <h2 id="impact" className="t-h2 text-ink">Ready to make an impact?</h2>
          <p className="mt-2 text-ink-2">Join us in changing how the world experiences stories.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="highlight" size="lg" onClick={scrollToRoles}>View all openings</Button>
          <Link to="/about" className="inline-flex h-12 items-center rounded-full border border-line-strong px-6 font-medium text-ink hover:bg-paper">About us</Link>
        </div>
      </section>
    </div>
  );
};

export default Careers;
