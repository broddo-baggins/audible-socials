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
    <footer className="bg-echo-charcoal text-white mt-auto">
      <div className="max-w-9xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-white/70 hover:text-white transition-colors text-sm"
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
        <div className="border-t border-white/10 mb-8" />
        
        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link 
              to="/" 
              className="text-2xl font-bold text-white hover:text-echo-orange transition-colors"
            >
              EchoRead
            </Link>
            <p className="text-white/60 text-sm">
              &copy; {currentYear} EchoRead. All rights reserved.
            </p>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-echo-orange text-white transition-colors"
                  aria-label={social.label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>
        
        {/* Additional Links */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            Discover, listen, and explore thousands of audiobooks and podcasts
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
