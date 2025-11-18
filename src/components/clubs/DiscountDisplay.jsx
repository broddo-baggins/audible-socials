import { DollarSign, Gift, BookOpen, Crown } from 'lucide-react';

export default function DiscountDisplay({ club, ownsBook }) {
  if (!club?.discounts) return null;

  const { discounts, memberBenefits } = club;

  return (
    <div className="space-y-4">
      {/* Book Ownership Requirement */}
      {memberBenefits?.bookOwnershipRequired && (
        <div className={`p-4 rounded-lg border-2 ${
          ownsBook
            ? 'bg-green-50 border-green-200'
            : 'bg-orange-50 border-orange-200'
        }`}>
          <div className="flex items-start space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              ownsBook ? 'bg-green-500' : 'bg-orange-500'
            }`}>
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className={`text-lg font-bold ${ownsBook ? 'text-green-900' : 'text-orange-900'}`}>
                {ownsBook ? '✓ Book Owned' : 'Book Required to Join'}
              </h4>
              <p className={`text-sm ${ownsBook ? 'text-green-700' : 'text-orange-700'}`}>
                {ownsBook
                  ? 'You own this month\'s book and can participate in all club activities!'
                  : 'You must own this month\'s featured book to join the club and attend events.'
                }
              </p>
              {!ownsBook && (
                <div className="mt-2 text-xs text-orange-600">
                  Each month features a different book - new members get access to the current month's selection
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Discounts Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-center space-x-2 mb-4">
          <DollarSign className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-bold text-green-900">Club Member Discounts</h3>
        </div>

        <div className="space-y-3">
          {/* Monthly Book Discount */}
          {discounts.monthlyBook && (
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {discounts.monthlyBook.type === 'percentage' ? `${discounts.monthlyBook.value}%` : `$${discounts.monthlyBook.value}`}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Monthly Book Discount</h4>
                    <p className="text-sm text-gray-600">{discounts.monthlyBook.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    Save ${discounts.monthlyBook.maxSavings}
                  </div>
                  <div className="text-xs text-gray-500">per month</div>
                </div>
              </div>
            </div>
          )}

          {/* Membership Bonus */}
          {discounts.membershipBonus && (
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Welcome Bonus</h4>
                    <p className="text-sm text-gray-600">{discounts.membershipBonus.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    +{discounts.membershipBonus.value}
                  </div>
                  <div className="text-xs text-gray-500">credits</div>
                </div>
              </div>
            </div>
          )}

          {/* Loyalty Discount */}
          {discounts.loyaltyDiscount && (
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Loyalty Reward</h4>
                    <p className="text-sm text-gray-600">{discounts.loyaltyDiscount.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">
                    {discounts.loyaltyDiscount.type === 'percentage' ? `${discounts.loyaltyDiscount.value}%` : `$${discounts.loyaltyDiscount.value}`}
                  </div>
                  <div className="text-xs text-gray-500">extra savings</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-300">
          <p className="text-sm text-green-800 text-center font-semibold">
            Join this month and save ${discounts.monthlyBook?.maxSavings || 0} on the featured book!
          </p>
        </div>
      </div>

      {/* Exclusive Events Highlight */}
      {memberBenefits?.exclusiveEvents && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center space-x-2 mb-4">
            <Crown className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-purple-900">Exclusive Member Events</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <div>
                <h4 className="font-semibold text-purple-900">Author & Narrator Q&A Sessions</h4>
                <p className="text-sm text-purple-700">Live interactive sessions where you can ask questions directly to creators</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <div>
                <h4 className="font-semibold text-purple-900">Host Conversations</h4>
                <p className="text-sm text-purple-700">Exclusive discussions and insights from celebrity hosts</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <div>
                <h4 className="font-semibold text-purple-900">Early Book Access</h4>
                <p className="text-sm text-purple-700">Get the next month's book selection before general release</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
