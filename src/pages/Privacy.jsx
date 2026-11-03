import { useEffect, useState } from 'react';
import { PageHeader } from '../components/ui';

/**
 * Privacy Policy, set as a reading page (the legal reading layout shared by
 * Terms, Privacy, Cookies and Content policy): PageHeader with the date, a
 * sticky contents list on the left at lg+ (a disclosure below lg), and the
 * text in a 68ch column at 16px/1.7. The legal text itself is unchanged.
 */
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/** Marks the section nearest the top of the viewport as current. */
const useActiveSection = (ids) => {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: '-96px 0px -60% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
};

const lastUpdated = 'January 15, 2025';

const sections = [
  { title: 'Information We Collect', content: [
    { subtitle: 'Information You Provide', items: ['Account registration details (name, email, password)', 'Payment information for subscription services', 'Profile information and preferences', 'Communications with our support team', 'Survey responses and feedback'] },
    { subtitle: 'Information We Collect Automatically', items: ['Device information and identifiers', 'Usage data and listening habits', 'IP addresses and location data', 'Browser and app analytics', 'Performance and diagnostic data'] },
    { subtitle: 'Information from Third Parties', items: ['Social media platforms (when connecting accounts)', 'Payment processors for billing information', 'Analytics providers for usage insights', 'Marketing partners for advertising effectiveness'] },
  ] },
  { title: 'How We Use Your Information', content: [
    { subtitle: 'Service Provision', items: ['Provide access to our audio entertainment services', 'Process payments and manage subscriptions', 'Deliver personalized content recommendations', 'Maintain and improve service functionality', 'Provide customer support and technical assistance'] },
    { subtitle: 'Personalization and Analytics', items: ['Analyze usage patterns to improve user experience', 'Recommend content based on listening history', 'Conduct research and develop new features', 'Measure service performance and user engagement', 'Generate aggregated, anonymized analytics'] },
    { subtitle: 'Communication and Marketing', items: ['Send service-related notifications and updates', 'Provide information about new features and content', 'Deliver promotional offers (with your consent)', 'Respond to inquiries and support requests', 'Send important account and security information'] },
  ] },
  { title: 'Information Sharing and Disclosure', content: [
    { subtitle: 'With Your Consent', items: ['Sharing information with connected social media accounts', 'Providing data to third-party services you authorize', 'Participating in research studies you opt into', 'Sharing anonymized data for permitted purposes'] },
    { subtitle: 'Service Providers and Partners', items: ['Payment processing and financial transaction services', 'Content delivery networks and cloud storage providers', 'Analytics and customer support platform providers', 'Marketing and advertising technology partners'] },
    { subtitle: 'Legal Requirements', items: ['Complying with applicable laws and regulations', 'Responding to legal requests and court orders', 'Protecting rights and safety of users and third parties', 'Enforcing our Terms of Service and other agreements'] },
  ] },
  { title: 'Data Security and Retention', content: [
    { subtitle: 'Security Measures', items: ['Industry-standard encryption for data transmission', 'Secure storage systems with access controls', 'Regular security audits and vulnerability assessments', 'Employee training on data protection practices', 'Incident response procedures for data breaches'] },
    { subtitle: 'Data Retention', items: ['Account data retained while account is active', 'Usage data retained for service improvement purposes', 'Legal retention requirements may extend storage periods', 'Data deletion upon account closure (subject to legal requirements)', 'Anonymized data may be retained indefinitely for analytics'] },
  ] },
  { title: 'Your Rights and Choices', content: [
    { subtitle: 'Access and Control', items: ['Access your personal information through account settings', 'Update or correct your account information', 'Download your data in a portable format', 'Delete your account and associated data', 'Opt out of marketing communications'] },
    { subtitle: 'Privacy Settings', items: ['Control social sharing and activity visibility', 'Manage cookie preferences and tracking', 'Adjust notification and communication settings', 'Limit data collection for personalization', 'Control location and device data sharing'] },
    { subtitle: 'Data Portability', items: ['Export your listening history and preferences', 'Transfer data to compatible services', 'Receive data in machine-readable formats', 'Request data migration assistance', 'Access third-party data sharing records'] },
  ] },
  { title: 'Cookies and Tracking Technologies', content: [
    { subtitle: 'Types of Cookies We Use', items: ['Essential cookies for basic service functionality', 'Performance cookies for analytics and optimization', 'Functional cookies for personalized features', 'Marketing cookies for advertising and promotions', 'Third-party cookies from service providers'] },
    { subtitle: 'Managing Cookies', items: ['Browser settings to control cookie acceptance', 'Cookie preference center in our applications', 'Opt-out links for marketing and advertising cookies', 'Automatic expiration of temporary cookies', 'Clear instructions for cookie management'] },
  ] },
  { title: 'International Data Transfers', content: [
    { subtitle: 'Cross-Border Transfers', items: ['Data may be transferred to countries with different privacy laws', 'Standard contractual clauses for international transfers', 'Adequacy decisions for certain jurisdictions', 'Additional safeguards for sensitive data transfers', 'Transparency about international data processing'] },
    { subtitle: 'Regional Compliance', items: ['GDPR compliance for European Union users', 'CCPA compliance for California residents', 'Additional regional privacy law compliance', 'Local data protection authority cooperation', 'Regional privacy representative availability'] },
  ] },
  { title: "Children's Privacy", content: [
    { subtitle: 'Age Restrictions', items: ['Service not intended for children under 13', 'Parental consent required for users under 18', 'Special protections for younger users', 'Limited data collection for minors', 'Enhanced privacy controls for youth accounts'] },
    { subtitle: 'Family Features', items: ['Family sharing with parental controls', 'Content filtering and age-appropriate recommendations', 'Usage monitoring and reporting for parents', 'Privacy settings for family accounts', 'Educational content and safe listening features'] },
  ] },
  { title: 'Changes to This Policy', content: [
    { subtitle: 'Policy Updates', items: ['Regular review and updates to privacy practices', 'Material changes communicated to users', 'Advance notice of significant policy changes', 'User consent for major privacy practice changes', 'Previous policy versions available in archives'] },
    { subtitle: 'Notification Methods', items: ['Email notifications for policy changes', 'In-app notifications and banners', 'Website announcements and updates', 'Direct communication for material changes', 'User dashboard privacy policy updates'] },
  ] },
].map((s, i) => ({ ...s, id: slug(s.title), number: i + 1 }));

const toc = [...sections.map((s) => ({ id: s.id, label: `${s.number}. ${s.title}` })), { id: 'questions', label: 'Questions About Your Privacy?' }];
const tocIds = toc.map((t) => t.id);

const Toc = ({ active }) => (
  <ol className="space-y-0.5">
    {toc.map((t) => (
      <li key={t.id}>
        <a
          href={`#${t.id}`}
          aria-current={active === t.id ? 'location' : undefined}
          className={`block border-l-[3px] py-1.5 pl-3 text-sm leading-snug hover:text-ink ${active === t.id ? 'border-hl font-medium text-ink' : 'border-transparent text-ink-2'}`}
        >
          {t.label}
        </a>
      </li>
    ))}
  </ol>
);

const Privacy = () => {
  const active = useActiveSection(tocIds);

  return (
    <div className="page pb-20">
      <PageHeader
        title="Privacy Policy"
        description={<>Last updated <time dateTime="2025-01-15">{lastUpdated}</time></>}
      />

      <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="On this page" className="mb-8 lg:mb-0">
          <details className="rounded-lg border border-line bg-surface lg:hidden">
            <summary className="flex min-h-11 cursor-pointer items-center px-4 font-medium text-ink">On this page</summary>
            <div className="border-t border-line px-1 py-2"><Toc active={active} /></div>
          </details>
          <div className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto lg:block">
            <p className="t-label mb-3 text-ink-3">On this page</p>
            <Toc active={active} />
          </div>
        </nav>

        <article className="max-w-[68ch] text-base leading-[1.7] text-ink-2">
          <div className="mb-10 space-y-4 text-[1.0625rem] text-ink">
            <p>
              At Audible, we are committed to protecting your privacy and being transparent about how we collect,
              use, and share your information. This Privacy Policy explains our practices regarding your personal
              information and your rights to control it.
            </p>
            <p>
              This policy applies to all Audible services, including our websites, mobile applications, and
              related services. By using our services, you agree to the collection and use of information
              in accordance with this policy.
            </p>
          </div>

          {sections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-h`} className="scroll-mt-24 border-t border-line pt-8 pb-10">
              <h2 id={`${section.id}-h`} className="t-h2 text-ink">
                <span className="tabular text-ink-3">{section.number}.</span> {section.title}
              </h2>
              <div className="mt-5 space-y-6">
                {section.content.map((sub) => (
                  <div key={sub.subtitle}>
                    <h3 className="font-semibold text-ink">{sub.subtitle}</h3>
                    <ul className="mt-2 list-disc space-y-1.5 pl-5 marker:text-ink-3">
                      {sub.items.map((item) => <li key={item} className="pl-1">{item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section id="questions" aria-labelledby="questions-h" className="scroll-mt-24 rounded-lg bg-surface-sunk p-5 md:p-6">
            <h2 id="questions-h" className="t-h3 text-ink">Questions About Your Privacy?</h2>
            <p className="mt-1">If you have questions about this Privacy Policy or our data practices, please contact us:</p>
            <dl className="mt-4 grid grid-cols-[5rem_minmax(0,1fr)] gap-y-1.5 text-[0.9375rem]">
              <dt className="text-ink-3">Email</dt><dd><a href="mailto:privacy@audible.com" className="link">privacy@audible.com</a></dd>
              <dt className="text-ink-3">Phone</dt><dd><a href="tel:18882834253" className="link tabular">1-888-AUDIBLE (1-888-283-4253)</a></dd>
              <dt className="text-ink-3">Address</dt><dd className="text-ink">Privacy Team, Audible Inc.</dd>
            </dl>
            <p className="mt-4 text-[0.9375rem]">You can also update your privacy preferences in your account settings.</p>
          </section>

          <p className="mt-8 text-sm text-ink-3">
            This privacy policy was last updated on {lastUpdated}.
            We will notify you of any material changes to this policy.
          </p>
        </article>
      </div>
    </div>
  );
};

export default Privacy;
