import PropTypes from 'prop-types';
import { Check } from 'lucide-react';

/**
 * DiscountDisplay: what a member saves, as a list with the value set large on
 * the right. The book-ownership rule sits above it, the members-only events below.
 */

const money = (d) => (d.type === 'percentage' ? `${d.value}%` : `$${d.value}`);

export default function DiscountDisplay({ club, ownsBook, showOwnership = true }) {
  if (!club?.discounts) return null;

  const { discounts, memberBenefits } = club;
  const rows = [
    discounts.monthlyBook && {
      key: 'monthly',
      title: 'Monthly book discount',
      text: discounts.monthlyBook.description,
      value: `$${discounts.monthlyBook.maxSavings}`,
      unit: `saved a month (${money(discounts.monthlyBook)} off)`,
    },
    discounts.membershipBonus && {
      key: 'bonus',
      title: 'Welcome bonus',
      text: discounts.membershipBonus.description,
      value: `+${discounts.membershipBonus.value}`,
      unit: 'credits',
    },
    discounts.loyaltyDiscount && {
      key: 'loyalty',
      title: 'Loyalty reward',
      text: discounts.loyaltyDiscount.description,
      value: money(discounts.loyaltyDiscount),
      unit: 'extra savings',
    },
  ].filter(Boolean);

  return (
    <div className="space-y-10">
      {showOwnership && memberBenefits?.bookOwnershipRequired && (
        <div className={`flex items-start gap-3 rounded-lg border p-4 ${ownsBook ? 'border-success/30 bg-success-wash' : 'border-line bg-surface'}`}>
          {ownsBook && <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" strokeWidth={2} aria-hidden="true" />}
          <div>
            <h3 className={`font-semibold ${ownsBook ? 'text-success' : 'text-ink'}`}>{ownsBook ? 'You own this month’s book' : 'This month’s book is required to join'}</h3>
            <p className="mt-0.5 text-sm text-ink-2">
              {ownsBook
                ? 'You can take part in every club activity.'
                : 'Own the featured book to join the club and come to events. Each month has a different book, and new members start with the current pick.'}
            </p>
          </div>
        </div>
      )}

      {rows.length > 0 && (
        <div>
          <h2 className="t-h2 text-ink">Member savings</h2>
          <ul className="mt-5 divide-y divide-line border-y border-line">
            {rows.map((r) => (
              <li key={r.key} className="flex items-center justify-between gap-6 py-4">
                <div className="min-w-0">
                  <h3 className="font-semibold text-ink">{r.title}</h3>
                  <p className="mt-0.5 text-sm text-ink-2">{r.text}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-serif text-3xl font-medium leading-none text-ink tabular">{r.value}</p>
                  <p className="mt-1 text-[0.8125rem] text-ink-3">{r.unit}</p>
                </div>
              </li>
            ))}
          </ul>
          {discounts.monthlyBook?.maxSavings ? (
            <p className="mt-3 text-sm text-ink-2">
              Join this month and save <span className="font-semibold text-ink tabular">${discounts.monthlyBook.maxSavings}</span> on the featured book.
            </p>
          ) : null}
        </div>
      )}

      {memberBenefits?.exclusiveEvents && (
        <div>
          <h2 className="t-h2 text-ink">Members-only events</h2>
          <dl className="mt-5 grid gap-6 sm:grid-cols-3">
            {[
              ['Author and narrator Q&A', 'Live sessions where you ask the people who made the book.'],
              ['Host conversations', 'Discussions and insight from the club’s host.'],
              ['Early book access', 'Next month’s pick before general release.'],
            ].map(([t, d]) => (
              <div key={t} className="border-t-2 border-ink pt-3">
                <dt className="font-semibold text-ink">{t}</dt>
                <dd className="mt-1 text-sm text-ink-2">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}

DiscountDisplay.propTypes = {
  club: PropTypes.object,
  ownsBook: PropTypes.bool,
  showOwnership: PropTypes.bool,
};
