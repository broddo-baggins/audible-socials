import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';

/**
 * Footer: the site map on paper, with the project's disclaimer stated once and plainly.
 * Social links are text, not a row of brand circles.
 */
const footerSections = [
  { title: 'Listen', links: [
    { label: 'Browse', path: '/browse' },
    { label: 'Originals', path: '/originals' },
    { label: 'Podcasts', path: '/podcasts' },
    { label: 'Book clubs', path: '/clubs' },
  ] },
  { title: 'Company', links: [
    { label: 'About', path: '/about' },
    { label: 'Careers', path: '/careers' },
    { label: 'Press', path: '/press' },
    { label: 'Blog', path: '/blog' },
  ] },
  { title: 'Help', links: [
    { label: 'Support center', path: '/support' },
    { label: 'FAQs', path: '/faq' },
    { label: 'Contact', path: '/contact' },
    { label: 'Accessibility', path: '/accessibility' },
  ] },
  { title: 'Legal', links: [
    { label: 'Terms of service', path: '/terms' },
    { label: 'Privacy policy', path: '/privacy' },
    { label: 'Cookie policy', path: '/cookies' },
    { label: 'Content policy', path: '/content-policy' },
  ] },
  { title: 'Apps', links: [
    { label: 'iOS', path: '/apps/ios' },
    { label: 'Android', path: '/apps/android' },
    { label: 'Desktop', path: '/apps/desktop' },
  ] },
];

const socialLinks = [
  { label: 'Instagram', url: 'https://instagram.com' },
  { label: 'YouTube', url: 'https://youtube.com' },
  { label: 'X', url: 'https://twitter.com' },
  { label: 'Facebook', url: 'https://facebook.com' },
];

const Footer = () => (
  <footer className="mt-auto border-t border-line bg-paper">
    <div className="page py-12 md:py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,3fr)]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm text-ink-2">
            Audiobooks are better with company. Listen along with friends, join a club, and argue about the ending.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-semibold text-ink">{section.title}</h2>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-sm text-ink-2 hover:text-ink hover:underline underline-offset-4">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
        <p className="text-[0.8125rem] text-ink-3">
          &copy; {new Date().getFullYear()} Listenable. An educational mock project, not affiliated with or endorsed by Audible or Amazon.
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {socialLinks.map((s) => (
            <li key={s.label}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[0.8125rem] text-ink-2 hover:text-ink hover:underline underline-offset-4">{s.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </footer>
);

export default Footer;
