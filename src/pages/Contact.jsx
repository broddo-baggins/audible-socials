import { useState, useId, useRef } from 'react';
import { Mail, Phone, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { PageHeader, Button, Input } from '../components/ui';

/**
 * Contact: the form leads (labels above, hints and errors below, errors
 * announced), other ways to reach us sit beside it as a ruled list, then
 * offices and hours as plain columns.
 */
const emptyForm = { name: '', email: '', subject: '', category: '', message: '' };

const contactMethods = [
  { title: 'Email support', description: 'Send us a detailed message', icon: Mail, contact: 'support@audible.com', href: 'mailto:support@audible.com', response: 'Response within 24 hours', action: 'Send email' },
  { title: 'Phone support', description: 'Speak with a specialist', icon: Phone, contact: '1-888-AUDIBLE (1-888-283-4253)', href: 'tel:18882834253', response: 'Mon to Fri, 9 AM to 6 PM EST', action: 'Call now' },
  { title: 'Live chat', description: 'Get instant help online', icon: MessageCircle, contact: 'Available 24/7', response: 'Instant response', action: 'Start chat' },
];

const offices = [
  { city: 'New York', address: '123 Audio Street, New York, NY 10001', phone: '+1 (555) 123-4567', email: 'nyc@audible.com' },
  { city: 'San Francisco', address: '456 Sound Avenue, San Francisco, CA 94102', phone: '+1 (555) 987-6543', email: 'sf@audible.com' },
  { city: 'London', address: '789 Listening Lane, London EC1A 1BB', phone: '+44 20 1234 5678', email: 'london@audible.com' },
];

const categories = [
  'Account & Billing',
  'Technical Support',
  'Content Questions',
  'Partnerships',
  'Press Inquiries',
  'General Feedback',
  'Other',
];

const validate = (data) => {
  const errors = {};
  if (!data.name.trim()) errors.name = 'Enter your full name.';
  if (!data.email.trim()) errors.email = 'Enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Enter an email address like name@example.com.';
  if (!data.category) errors.category = 'Choose the category closest to your question.';
  if (!data.subject.trim()) errors.subject = 'Add a short subject.';
  if (!data.message.trim()) errors.message = 'Tell us how we can help.';
  return errors;
};

const fieldBase = 'w-full bg-surface text-base text-ink border rounded-lg transition-colors focus:outline-none focus:border-ink focus:shadow-[0_0_0_3px_var(--hl)]';

const Contact = () => {
  const [formData, setFormData] = useState(emptyForm);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);
  const categoryId = useId();
  const messageId = useId();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(formData);
    if (Object.keys(found).length) {
      setErrors(found);
      const first = Object.keys(found)[0];
      formRef.current?.querySelector(`[name="${first}"]`)?.focus();
      return;
    }
    // In a real app, this would submit to an API
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setFormData(emptyForm);
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div className="page pb-20">
      <PageHeader
        title="Contact us"
        description="A question, a problem or some feedback? Send a message, or choose another way to reach our team below."
      />

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
        {/* Form */}
        <section aria-labelledby="form-title" className="rounded-2xl border border-line bg-surface p-5 md:p-8">
          {isSubmitted ? (
            <div role="status" className="flex flex-col items-start gap-4 py-6">
              <CheckCircle2 className="h-8 w-8 text-success" strokeWidth={1.75} aria-hidden="true" />
              <h2 id="form-title" className="t-h2 text-ink">Message sent</h2>
              <p className="text-ink-2 max-w-[52ch]">Thank you for contacting us. We have your message and will reply within 24 hours.</p>
              <Button onClick={() => setIsSubmitted(false)} variant="primary">Send another message</Button>
            </div>
          ) : (
            <>
              <h2 id="form-title" className="t-h2 text-ink">Send us a message</h2>
              <p className="mt-1 text-[0.8125rem] text-ink-3">All fields are required.</p>
              <form ref={formRef} onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <Input label="Full name" name="name" value={formData.name} onChange={handleInputChange} required autoComplete="name" error={errors.name} fullWidth />
                  <Input label="Email address" type="email" name="email" value={formData.email} onChange={handleInputChange} required autoComplete="email" error={errors.email} hint="We only use it to reply." fullWidth />
                </div>

                <div>
                  <label htmlFor={categoryId} className="block text-sm font-medium text-ink mb-1.5">Category</label>
                  <select
                    id={categoryId}
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    aria-invalid={errors.category ? true : undefined}
                    aria-describedby={errors.category ? `${categoryId}-error` : undefined}
                    className={`${fieldBase} h-11 px-3 ${errors.category ? 'border-danger' : 'border-line-strong'}`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && <p id={`${categoryId}-error`} role="alert" className="mt-1.5 text-sm text-danger">{errors.category}</p>}
                </div>

                <Input label="Subject" name="subject" value={formData.subject} onChange={handleInputChange} required error={errors.subject} fullWidth />

                <div>
                  <label htmlFor={messageId} className="block text-sm font-medium text-ink mb-1.5">Message</label>
                  <textarea
                    id={messageId}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    aria-invalid={errors.message ? true : undefined}
                    aria-describedby={errors.message ? `${messageId}-error` : `${messageId}-hint`}
                    placeholder="Tell us how we can help you"
                    className={`${fieldBase} resize-y px-3.5 py-3 ${errors.message ? 'border-danger' : 'border-line-strong'}`}
                  />
                  {errors.message
                    ? <p id={`${messageId}-error`} role="alert" className="mt-1.5 text-sm text-danger">{errors.message}</p>
                    : <p id={`${messageId}-hint`} className="mt-1.5 text-sm text-ink-3">Include your device and app version for technical questions.</p>}
                </div>

                <Button type="submit" variant="primary" size="lg" rightIcon={<Send className="h-4 w-4" strokeWidth={1.75} />}>
                  Send message
                </Button>
              </form>
            </>
          )}
        </section>

        {/* Other ways */}
        <section aria-labelledby="other-ways">
          <h2 id="other-ways" className="t-h2 text-ink">Other ways to reach us</h2>
          <ul className="mt-5 divide-y divide-line border-y border-line">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <li key={method.title} className="flex gap-4 py-5">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-ink-2" strokeWidth={1.75} aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <h3 className="t-h3 text-ink">{method.title}</h3>
                    <p className="text-ink-2">{method.description}</p>
                    <p className="mt-2 text-sm font-medium text-ink">{method.contact}</p>
                    <p className="text-[0.8125rem] text-ink-3">{method.response}</p>
                    {method.href ? (
                      <a href={method.href} className="mt-3 inline-flex h-9 items-center rounded-full border border-line-strong px-4 text-sm font-medium text-ink hover:bg-surface">{method.action}</a>
                    ) : (
                      <Button variant="outline" size="sm" className="mt-3">{method.action}</Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* Offices and hours */}
      <section aria-labelledby="offices" className="mt-16 md:mt-20">
        <h2 id="offices" className="t-h2 text-ink">Our offices</h2>
        <div className="mt-6 grid gap-x-10 md:grid-cols-3">
          {offices.map((office) => (
            <address key={office.city} className="border-t border-ink py-5 not-italic">
              <h3 className="font-serif text-xl font-medium text-ink">{office.city}</h3>
              <p className="mt-2 text-ink-2">{office.address}</p>
              <p className="mt-3 text-[0.9375rem]"><a href={`tel:${office.phone.replace(/[^+\d]/g, '')}`} className="link tabular">{office.phone}</a></p>
              <p className="text-[0.9375rem]"><a href={`mailto:${office.email}`} className="link">{office.email}</a></p>
            </address>
          ))}
        </div>
      </section>

      <section aria-labelledby="hours" className="mt-12 rounded-lg bg-surface-sunk p-5 md:p-6">
        <h2 id="hours" className="t-h3 text-ink">Business hours</h2>
        <dl className="mt-3 grid gap-x-8 gap-y-2 text-[0.9375rem] sm:grid-cols-[10rem_minmax(0,1fr)]">
          <dt className="font-medium text-ink">Customer support</dt><dd className="text-ink-2">Monday to Friday, 9:00 AM to 6:00 PM EST</dd>
          <dt className="font-medium text-ink">Live chat</dt><dd className="text-ink-2">24 hours a day, 7 days a week</dd>
          <dt className="font-medium text-ink">Email</dt><dd className="text-ink-2">Response within 24 hours on business days</dd>
        </dl>
      </section>
    </div>
  );
};

export default Contact;
