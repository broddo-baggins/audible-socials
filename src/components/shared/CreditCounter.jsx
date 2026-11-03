import { CreditCard } from 'lucide-react';
import { getUserData } from '../../utils/localStorage';
import { useState, useEffect } from 'react';

/** CreditCounter: how many credits you have, as a quiet surface pill. */
export default function CreditCounter({ className = '' }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    setUserData(getUserData());
  }, []);

  if (!userData) return null;

  return (
    <div className={`inline-flex h-9 items-center gap-2 rounded-full border border-line bg-surface px-3.5 text-ink ${className}`}>
      <CreditCard className="h-4 w-4 text-ink-2" strokeWidth={1.75} aria-hidden="true" />
      <span className="text-sm font-semibold tabular">{userData.credits}</span>
      <span className="text-[0.8125rem] text-ink-2">
        {userData.credits === 1 ? 'credit' : 'credits'}
      </span>
    </div>
  );
}
