import { CreditCard } from 'lucide-react';
import { getUserData } from '../../utils/localStorage';
import { useState, useEffect } from 'react';

export default function CreditCounter({ className = '' }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    setUserData(getUserData());
  }, []);

  if (!userData) return null;

  return (
    <div className={`flex items-center space-x-2 px-3 py-1.5 bg-audible-cream rounded-full ${className}`}>
      <CreditCard className="w-4 h-4 text-audible-orange" />
      <span className="text-sm font-semibold text-audible-orange">
        {userData.credits}
      </span>
      <span className="text-xs text-gray-600">
        {userData.credits === 1 ? 'Credit' : 'Credits'}
      </span>
    </div>
  );
}

