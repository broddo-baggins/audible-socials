import { useId } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Check, Lock, ChevronDown, Headphones, Armchair, Coffee, Library, Circle, ChefHat, Sprout, Sofa } from 'lucide-react';
import { UPGRADES, isUpgradeAvailable } from '../../utils/idleGame';

// Icon mapping for dynamic rendering
const ICON_MAP = {
  Headphones,
  Armchair,
  Coffee,
  Library,
  Circle,
  ChefHat,
  Sprout,
  Sofa,
};

const sentence = (s = '') => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

const categoryNames = {
  equipment: 'Equipment',
  furniture: 'Furniture',
  consumable: 'Consumables',
};

/**
 * UpgradeShop: spend focus points on permanent bonuses. A disclosure row on
 * night; open, three short lists by category and your balance. Each row
 * says what it costs, what it needs first, or that you own it.
 */
const UpgradeShop = ({ gameState, onPurchase, showShop, onToggleShop }) => {
  const panelId = useId();

  // Group upgrades by category
  const categories = {
    equipment: [],
    furniture: [],
    consumable: [],
  };

  Object.values(UPGRADES).forEach(upgrade => {
    if (categories[upgrade.category]) {
      categories[upgrade.category].push(upgrade);
    }
  });

  const owned = gameState.purchasedUpgrades.length;

  return (
    <div>
      <button
        type="button"
        onClick={onToggleShop}
        aria-expanded={showShop}
        aria-controls={panelId}
        className="flex min-h-12 w-full items-center gap-3 rounded-lg border border-[#3A3D45] px-4 py-3 text-left transition-colors hover:bg-night-raised"
      >
        <ShoppingBag className="h-5 w-5 shrink-0 text-ink-on-night-2" strokeWidth={1.75} aria-hidden="true" />
        <span className="flex-1 font-medium">Upgrade shop</span>
        <span className="text-[0.8125rem] text-ink-on-night-2 tabular">{owned} of {Object.keys(UPGRADES).length} owned</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-ink-on-night-2 transition-transform duration-200 ${showShop ? 'rotate-180' : ''}`} strokeWidth={1.75} aria-hidden="true" />
      </button>

      <AnimatePresence initial={false}>
        {showShop && (
          <Motion.div
            id={panelId}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-6 px-1">
              <div className="flex items-baseline justify-between rounded-lg bg-night-raised px-4 py-3">
                <span className="text-[0.8125rem] text-ink-on-night-2">Your focus points</span>
                <span className="font-serif text-2xl font-medium tabular">{gameState.focusPoints.toLocaleString()} <span className="font-sans text-sm text-ink-on-night-2">FP</span></span>
              </div>

              {Object.entries(categories).map(([category, upgrades]) => (
                <section key={category} aria-label={categoryNames[category]}>
                  <h3 className="px-3 text-[0.8125rem] font-semibold text-ink-on-night-2">{categoryNames[category]}</h3>
                  <ul className="mt-1 divide-y divide-[#2C2F36]">
                    {upgrades.map(upgrade => {
                      const isPurchased = gameState.purchasedUpgrades.includes(upgrade.id);
                      const canAfford = gameState.focusPoints >= upgrade.cost;
                      const meetsRequirements = !upgrade.requires ||
                        gameState.purchasedUpgrades.includes(upgrade.requires);
                      const isAvailable = isUpgradeAvailable(upgrade.id, gameState);
                      const Icon = ICON_MAP[upgrade.icon] || Circle;
                      const shortBy = upgrade.cost - gameState.focusPoints;

                      return (
                        <li key={upgrade.id}>
                          <button
                            type="button"
                            onClick={() => isAvailable && onPurchase(upgrade.id)}
                            disabled={!isAvailable || isPurchased}
                            aria-label={`${sentence(upgrade.name)}, ${upgrade.description}. ${isPurchased ? 'Owned' : `${upgrade.cost} focus points`}`}
                            className={`flex min-h-14 w-full items-center gap-4 rounded-md px-3 py-3 text-left transition-colors ${
                              isAvailable && !isPurchased ? 'hover:bg-night-raised' : 'cursor-default'
                            }`}
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#3A3D45]">
                              <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
                            </span>

                            <span className="min-w-0 flex-1">
                              <span className="flex items-center gap-2 font-medium">
                                {sentence(upgrade.name)}
                                {isPurchased && <Check className="h-4 w-4 text-hl" strokeWidth={2} aria-hidden="true" />}
                              </span>
                              <span className="block text-[0.8125rem] text-ink-on-night-2">{upgrade.description}</span>
                              {upgrade.requires && !meetsRequirements && (
                                <span className="mt-1 flex items-center gap-1 text-[0.8125rem] text-ink-on-night-2">
                                  <Lock className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
                                  Needs {sentence(UPGRADES[upgrade.requires]?.name)}
                                </span>
                              )}
                            </span>

                            <span className="shrink-0 text-right tabular">
                              {isPurchased ? (
                                <span className="text-[0.8125rem] font-semibold">Owned</span>
                              ) : isAvailable ? (
                                <span className="inline-flex h-9 items-center rounded-full bg-ink-on-night px-3.5 text-[0.8125rem] font-semibold text-ink">
                                  {upgrade.cost.toLocaleString()} FP
                                </span>
                              ) : (
                                <>
                                  <span className="block text-[0.9375rem] font-semibold text-ink-on-night-2">{upgrade.cost.toLocaleString()} FP</span>
                                  {!canAfford && meetsRequirements && (
                                    <span className="block text-xs text-ink-on-night-2">{shortBy.toLocaleString()} short</span>
                                  )}
                                </>
                              )}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UpgradeShop;
