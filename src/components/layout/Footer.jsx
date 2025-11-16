import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerSections = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'Careers', path: '/careers' },
        { label: 'Press', path: '/press' },
        { label: 'Blog', path: '/blog' },
      ],
    },
    {
      title: 'Help',
      links: [
        { label: 'Support Center', path: '/support' },
        { label: 'FAQs', path: '/faq' },
        { label: 'Contact Us', path: '/contact' },
        { label: 'Accessibility', path: '/accessibility' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'Cookie Policy', path: '/cookies' },
        { label: 'Content Policy', path: '/content-policy' },
      ],
    },
    {
      title: 'Apps',
      links: [
        { label: 'iOS App', path: '/apps/ios' },
        { label: 'Android App', path: '/apps/android' },
        { label: 'Desktop App', path: '/apps/desktop' },
      ],
    },
  ];
  
  const socialLinks = [
    { label: 'Facebook', icon: Facebook, url: 'https://facebook.com' },
    { label: 'Twitter', icon: Twitter, url: 'https://twitter.com' },
    { label: 'Instagram', icon: Instagram, url: 'https://instagram.com' },
    { label: 'YouTube', icon: Youtube, url: 'https://youtube.com' },
  ];
  
  return (
    <footer className="bg-audible-gray-50 border-t border-audible-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-sm text-audible-text-primary uppercase tracking-wider mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-audible-text-secondary hover:text-audible-orange transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-audible-gray-200 mb-6" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo and Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link
              to="/"
              className="text-xl font-bold text-audible-text-primary hover:text-audible-orange transition-colors"
            >
              audible
            </Link>
            <p className="text-audible-text-tertiary text-sm">
              &copy; {currentYear} Audible. All rights reserved.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-audible-gray-200 hover:bg-audible-orange text-audible-gray-600 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
