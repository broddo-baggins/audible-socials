import { Crown } from 'lucide-react';

export default function PremiumBadge({ size = 'md', showText = true }) {
  const sizes = {
    sm: { icon: 'w-3 h-3', text: 'text-xs', padding: 'px-2 py-0.5' },
    md: { icon: 'w-4 h-4', text: 'text-xs', padding: 'px-2 py-1' },
    lg: { icon: 'w-5 h-5', text: 'text-sm', padding: 'px-3 py-1' }
  };

  const sizeClasses = sizes[size];

  if (!showText) {
    return (
      <div className="bg-audible-gold rounded-full p-1">
        <Crown className={`${sizeClasses.icon} text-white`} />
      </div>
    );
  }

  return (
    <span className={`bg-audible-gold text-white font-semibold rounded-full flex items-center ${sizeClasses.padding} ${sizeClasses.text}`}>
      <Crown className={`${sizeClasses.icon} mr-1`} />
      Premium
    </span>
  );
}

