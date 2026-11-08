import { useEffect, useState } from 'react';
import { PageHeader } from '../components/ui';

/**
 * Terms of Service, set as a reading page (the legal reading layout shared by
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
  { title: 'Acceptance of Terms', content: [
    'EDUCATIONAL DISCLAIMER: This is a mock educational project ("Listenable") created for academic purposes. This is not a real service and no actual terms apply.',
    'This demonstration showcases social networking features for audiobook platforms. Not affiliated with Audible or Amazon.',
    'By using this demo, you acknowledge this is for educational purposes only.',
  ] },
  { title: 'Description of Service', content: [
    'Listenable demonstrates access to a mock digital library of audiobooks and audio content.',
    'Services include streaming, downloading, and offline access to content, subject to subscription terms.',
    'Content is available through web browsers, mobile applications, and supported devices.',
    'Service availability may vary by region and device compatibility.',
  ] },
  { title: 'User Accounts', content: [
    'You must create an account to access premium features and content.',
    'You are responsible for maintaining the confidentiality of your account credentials.',
    'You agree to provide accurate and complete information during registration.',
    'You must be at least 13 years old to create an account.',
    'One person may not maintain more than one account without permission.',
  ] },
  { title: 'Subscription and Billing', content: [
    'Listenable demonstrates various subscription plan concepts (educational mock only).',
    'Subscriptions automatically renew unless cancelled before the renewal date.',
    'You may cancel your subscription at any time through your account settings.',
    'Refunds are available for eligible purchases within specified timeframes.',
    'Pricing and plans may change with advance notice to subscribers.',
  ] },
  { title: 'Content Usage Rights', content: [
    'Licensed content is for personal, non-commercial use only.',
    'You may not copy, distribute, or create derivative works from licensed content.',
    'Content may include digital rights management (DRM) protections.',
    'License terms vary by content and are specified in individual agreements.',
    'Violations of usage rights may result in account suspension or termination.',
  ] },
  { title: 'Device and Platform Restrictions', content: [
    'Content may be accessed on up to 16 compatible devices per account.',
    'Some content may have additional device or platform restrictions.',
    'This is a demonstration project showing device compatibility concepts.',
    'Unsupported devices may lose access to certain features or content.',
  ] },
  { title: 'Privacy and Data Collection', content: [
    'Your privacy is important to us. Please review our Privacy Policy for details.',
    'We collect information necessary to provide and improve our services.',
    'Personal information is handled in accordance with applicable privacy laws.',
    'You have rights regarding your personal data as outlined in our Privacy Policy.',
  ] },
  { title: 'Prohibited Activities', content: [
    'You may not use the service for any illegal or unauthorized purpose.',
    'Sharing account credentials or circumventing access controls is prohibited.',
    'Reverse engineering, decompiling, or hacking the service is not allowed.',
    'Creating multiple accounts for the same individual is prohibited.',
    'Any attempt to disrupt service operations is strictly forbidden.',
  ] },
  { title: 'Service Availability and Changes', content: [
    'This educational demonstration is provided as-is for academic purposes.',
    'We reserve the right to modify, suspend, or discontinue services with notice.',
    'Content availability may change based on licensing agreements.',
    'Technical support is available for service-related issues.',
    'Emergency maintenance may occur without prior notice.',
  ] },
  { title: 'Limitation of Liability', content: [
    'This is a concept demo with sample data and no actual liability (not a real service).',
    'We are not liable for indirect, incidental, or consequential damages.',
    'Service is provided "as is" without warranties of any kind.',
    'Your sole remedy for dissatisfaction is to discontinue use of the service.',
    'These limitations apply even if Audible has been advised of potential damages.',
  ] },
  { title: 'Governing Law and Dispute Resolution', content: [
    'These terms are governed by the laws of the jurisdiction specified.',
    'Disputes will be resolved through binding arbitration in applicable cases.',
    'You agree to submit to the exclusive jurisdiction of specified courts.',
    'International users may be subject to additional terms and conditions.',
  ] },
  { title: 'Changes to Terms', content: [
    'Audible reserves the right to modify these terms at any time.',
    'Changes will be communicated through the service or via email.',
    'Continued use after changes constitutes acceptance of new terms.',
    'Material changes may require explicit consent from users.',
    'Previous versions of terms remain accessible in our archives.',
  ] },
].map((s, i) => ({ ...s, id: slug(s.title), number: i + 1 }));

const toc = [...sections.map((s) => ({ id: s.id, label: `${s.number}. ${s.title}` })), { id: 'questions', label: 'Questions About These Terms?' }];
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

const Terms = () => {
  const active = useActiveSection(tocIds);

  return (
    <div className="page pb-20">
      <PageHeader
        title="Terms of Service"
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
          <aside aria-labelledby="notice" className="mb-10 border-l-[3px] border-ink bg-surface py-4 pl-5 pr-4">
            <h2 id="notice" className="font-semibold text-ink">Important Notice</h2>
            <p className="mt-1">
              Please read these Terms of Service carefully before using Audible&apos;s services.
              By using our service, you agree to be bound by these terms. If you do not agree
              to these terms, please do not use our service.
            </p>
          </aside>

          {sections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-h`} className="scroll-mt-24 border-t border-line pt-8 pb-10 first-of-type:border-t-0 first-of-type:pt-0">
              <h2 id={`${section.id}-h`} className="t-h2 text-ink">
                <span className="tabular text-ink-3">{section.number}.</span> {section.title}
              </h2>
              <div className="mt-4 space-y-4">
                {section.content.map((p) => <p key={p}>{p}</p>)}
              </div>
            </section>
          ))}

          <section id="questions" aria-labelledby="questions-h" className="scroll-mt-24 rounded-lg bg-surface-sunk p-5 md:p-6">
            <h2 id="questions-h" className="t-h3 text-ink">Questions About These Terms?</h2>
            <p className="mt-1">If you have any questions about these Terms of Service, please contact us:</p>
            <dl className="mt-4 grid grid-cols-[5rem_minmax(0,1fr)] gap-y-1.5 text-[0.9375rem]">
              <dt className="text-ink-3">Email</dt><dd><a href="mailto:legal@audible.com" className="link">legal@audible.com</a></dd>
              <dt className="text-ink-3">Phone</dt><dd><a href="tel:18882834253" className="link tabular">1-888-AUDIBLE (1-888-283-4253)</a></dd>
              <dt className="text-ink-3">Address</dt><dd className="text-ink">Legal Department, Audible Inc.</dd>
            </dl>
          </section>

          <p className="mt-8 text-sm text-ink-3">
            These terms were last updated on {lastUpdated}.
            For previous versions, please contact our legal department.
          </p>
        </article>
      </div>
    </div>
  );
};

export default Terms;
