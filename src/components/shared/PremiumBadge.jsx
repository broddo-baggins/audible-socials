import { Crown } from 'lucide-react';

/**
 * PremiumBadge: a small ink sticker. With showText={false} it is an ink disc
 * with a crown, labelled for screen readers.
 */
export default function PremiumBadge({ size = 'md', showText = true }) {
  const sizes = {
    sm: { icon: 'w-3 h-3', text: 'text-[0.6875rem]', padding: 'px-1.5 py-0.5 gap-1', disc: 'h-5 w-5' },
    md: { icon: 'w-3.5 h-3.5', text: 'text-xs', padding: 'px-2 py-0.5 gap-1', disc: 'h-6 w-6' },
    lg: { icon: 'w-4 h-4', text: 'text-sm', padding: 'px-2.5 py-1 gap-1.5', disc: 'h-7 w-7' },
  };

  const sizeClasses = sizes[size] || sizes.md;

  if (!showText) {
    return (
      <span className={`inline-flex items-center justify-center rounded-full bg-ink text-paper ring-2 ring-paper ${sizeClasses.disc}`} title="Premium">
        <Crown className={sizeClasses.icon} strokeWidth={1.75} aria-hidden="true" />
        <span className="sr-only">Premium member</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-sm bg-ink font-semibold tracking-[0.02em] text-paper whitespace-nowrap ${sizeClasses.padding} ${sizeClasses.text}`}>
      <Crown className={sizeClasses.icon} strokeWidth={1.75} aria-hidden="true" />
      Premium
    </span>
  );
}
